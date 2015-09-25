var GUI = (function() { //IIFE for all Views
  /**
   This view displays a single task, showing its title, description, status, creator, and assignee (if any). Each TaskView should include one or more controls (e.g. a select or set of buttons) to change its state.

   Each task view will be associated with exactly one task model, although a model may have more than one view instance.
   */
  var TaskView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
      this.listenTo(this.model, 'change', this.updateTask);
      this.render();
    },
    render: function() {
      var status = this.model.get('status');
      var assignee = this.model.get('assignee');
      assignee = assignee === "" ? "unassigned" : assignee;
      this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
      this.$el.append($("<h1>").html(this.model.get('title')));
      this.$el.append($("<h2>").html(this.model.get('description')));
      this.$el.append($("<p class='creator'>").html("CREATED BY: " + this.model.get('creator')));
      this.$el.append($("<p class='assignee'>").html("ASSIGNED TO: " + assignee));
      this.$el.append($("<p class='created'>").html("CREATED ON: " + this.model.get('createdOn')));
      if (status === "unassigned") {
        this.$el.append($("<button class='claim'>").html("CLAIM"));
      } else if (assignee === app.currentUser.get("username") && status !== "completed") {
        this.$el.append($("<button class='quit'>").html("QUIT"));
        this.$el.append($("<button class='done'>").html("DONE"));
      } else if (status === "completed") {
        var date = new Date(this.model.get('completedOn'));
        this.$el.append($("<p class='completed-date'>").html(date));
      }
      this.$el.addClass("task-view");
    },
    updateTask: function(e) {
      this.render();
    },
    events: {
      "click button.quit": "quitTask",
      "click button.done": "completeTask",
      "click button.claim": "claimTask"
    },
    quitTask: function(e) {
      this.model.set({"assignee": "", "status": "unassigned"});
      this.model.save();
    },
    completeTask: function(e) {
      this.model.set({"status": "completed", "completedOn": new Date().getTime()});
      this.model.save();
      console.log("completeTask");
    },
    claimTask: function(e) {
      this.model.set({"assignee": app.currentUser.get("username"), "status": "in progress"});
      this.model.save();
    }
  });

  /**
   You'll need a view with input fields for the user to fill in when creating a new task. It should probably have both a create and cancel button. The location and format of the view is up to you.
   */
  var CreateTaskView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
    },
    render: function() {
      var $form = $('<form id="form">');
      $form.append($('<input type="text" name="title" placeholder="Enter Task Title">'));
      $form.append($('<input type="type" name="description" placeholder="Enter Task Description">'));
      $form.append($('<input type="submit" name="submit" value="Submit">'));
      $form.append($('<button id="cancel">').html('Cancel'));
      this.$el.append($form)
    },
    events: {
      "submit #form": "submitForm",
      "click #cancel": function(e) {e.preventDefault(); this.remove()}
    },
    submitForm: function(e) {
      e.preventDefault();
      var newTitle = $(e.target).children("input[name='title']").val();
      var newDescription = $(e.target).children("input[name='description']").val();
      this.model.set({
        'createdOn': new Date().getTime(),
        'title': newTitle,
        'description': newDescription
      })
      this.homePage.tasks.add(this.model)
      this.remove();
    }
  });

  var TaskCollectionView = Backbone.View.extend({
    // relevantTasks: [],
    // taskViews: [], // this is shared among all TaskCollectionView instances?!?!
    initialize: function(opts) {
      this.relevantTasks = [];
      this.taskViews = [];
      _.extend(this, opts);
      this.listenTo(this.collection, 'add', this.addTask);
      this.listenTo(this.collection, 'change', this.updateTask);
      // this.listenTo(this.collection, 'remove', this.removeTask); // we won't ever remove models. they will just be marked `complete` and archived
      this.filterCollection();
      this.render();
    },
    addTask: function(e) {
      this.filterCollection();
      this.makeTaskView(e);
    },
    updateTask: function(e) {
      // this.filterCollection();
      this.updateTaskView(e);
      // this.render();
    },
    filterCollection: function() {
      this.relevantTasks = [];
      if (this.kind === "unassigned") {
        this.relevantTasks = this.collection.filter(function(task){
          return task.get('status') === "unassigned"
        })
      } else if (this.kind === "user"){
        var assigned = this.collection.filter(function(task){
          return (task.get('status') === "in progress") && (task.get('assignee') === app.currentUser.get("username"));
        })
        var created = this.collection.filter(function(task){
          return (task.get('creator') === app.currentUser.get("username")) && (task.get('status') !== "completed");
        })
        this.relevantTasks = _.union(assigned, created);
      } else {
        this.relevantTasks = this.collection.where({
          status: "completed"
        });
      }
    },
    makeTaskView: function(taskModel) {
      if (!this.hasTask(taskModel, this.relevantTasks)) return; // don't do anything if the taskModel isn't in `relevantTasks` array
      var taskView = new TaskView({
        model: taskModel
      });
      this.taskViews.push(taskView);
      this.$el.append(taskView.$el);
    },
    removeTaskView: function(taskModel) {
      if (this.hasTask(taskModel, this.relevantTasks)) return;
      this.taskViews.forEach(function(e, i, a) {
        if (e.model === taskModel) {
          e.remove();
          a.splice(i, 1);
        }
      })
    },
    // called on this.collection.change event
    updateTaskView: function(taskModel) {
      var oldTasks = this.relevantTasks.slice();
      this.filterCollection();
      if (this.hasTask(taskModel, oldTasks)) {
        if (!this.hasTask(taskModel, this.relevantTasks)) {
          this.removeTaskView(taskModel);
        }
      } else if (this.hasTask(taskModel, this.relevantTasks)) {
        this.makeTaskView(taskModel);
      }
    },
    render: function() {
      this.relevantTasks.reverse();
      var title = "Unassigned Tasks"
      if(this.kind === 'user'){
        title = app.currentUser.get("username") + "'s Tasks"
      } else if (this.kind === 'completed') {
        title = "Completed Tasks"
      };
      this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
      this.$el.append($("<h1>").html(title));
      // make a new TaskView for each this.relevantTasks
      var self = this;
      this.relevantTasks.forEach(function(task) {
        self.makeTaskView(task);
      })
      this.$el.addClass('task-collection');
      this.$el.addClass(this.kind);
    },
    // helper function to see if a given taskModel is contained in a given array
    hasTask: function(taskModel, array) {
      var result = _.find(array, function(model) {
        return taskModel.cid === model.cid;
      });
      return result !== undefined;
    }
  });

  // would have two TaskCollectionViews (for unassigned tasks and the current user's tasks)
  // would also the name of the current user, a logout button, and a Create Task button
  var HomePageView = Backbone.View.extend({
    user: null,
    tasks: null,
    initialize: function(opts) {
      _.extend(this, opts);
      this.render();
      $("#app").html(this.$el);
    },
    render: function() {
      this.$el.append($("<h1>").html("Hello " + this.user.get("username")));
      this.$el.append($("<button id='logout'>").html("Log Out"));
      this.$el.append($("<button id='add-task'>").html("Add Task"));
      this.$el.append($("<div id='task-form'>"));
      var $taskViews = $("<div id='taskViews'>");
      var unassignedTasks = new TaskCollectionView({
        collection: app.tasks,
        kind: "unassigned"
      });
      var userTasks = new TaskCollectionView({
        collection: app.tasks,
        kind: "user"
      });
      var completedTasks = new TaskCollectionView({
        collection: app.tasks,
        kind: "completed"
      });
      $taskViews.append(unassignedTasks.$el);
      $taskViews.append(userTasks.$el);
      $taskViews.append(completedTasks.$el);
      this.$el.append($taskViews);
    },
    events: {
      "click button#logout": "logout",
      "click button#add-task": "showNewTaskView"
    },
    logout: function(e) {
      var loginView = new LoginView({
        collection: app.gui.users
      })
      this.remove();
    },
    showNewTaskView: function(e) {
      // TODO: this method will create a CreateTaskView, not immediately create a task
      var newTask = new TaskModel({
        creator: this.user.get('username')
      });
      var createTaskView = new CreateTaskView({
        model: newTask,
        homePage: this
      });
      createTaskView.render()
      $("#task-form").append(createTaskView.$el)
    }
  });

  // a list of known users to choose from
  var LoginView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(app.users, 'add', this.render);
      this.render();
      $("#app").append(this.$el);
    },
    events: {
      "click button#login": "login"
    },
    login: function(e) {
      e.preventDefault();
      var id = $("select#usernames").val();
      var selectedUser = app.users.get(id);
      app.currentUser = selectedUser;
      var homePageView = new HomePageView({
        user: selectedUser,
        tasks: app.tasks
      })
      this.remove();
    },
    render: function() {
      console.log("render login view");
      var users = app.users.models;
      // var output = "<h1>Welcome!</h1><form><select id='usernames' placeholder='CHOOSE USER'><option></option>"
      var output = "<h1>Welcome!</h1><form><select id='usernames' placeholder='CHOOSE USER'>"
      users.forEach(function(user) {
        output += "<option value='" + user.cid + "'>" + user.get("username") + "</option>"
      })
      output += "</select><button type='submit' name='submit' id='login'>LOG IN</button></form>"
      this.$el.html(output);
    }
  });

  // generic ctor to represent interface:
  function GUI(el) {
    // this.users = users; // a UsersCollection
    // this.tasks = tasks; // an IssuesCollection
    var loginView = new LoginView()
  }

  return GUI;
} ())
