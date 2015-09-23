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
      if (status === "unassigned") {
        this.$el.append($("<button class='claim'>").html("CLAIM"));
      } else if (assignee === app.currentUser.get("username") && status !== "completed") {
        this.$el.append($("<button class='quit'>").html("QUIT"));
        this.$el.append($("<button class='done'>").html("DONE"));
      } // TODO: completed tasks should be marked completed in some way. or they should be removed or moved to a new TaskCollectionView for completed tasks
      this.$el.addClass("task-view");
    },
    updateTask: function(e) {
      // TODO: this currently is not really used because the entire TaskCollectionView will update if ANY TaskModel changes
      console.log("updateTask() called with e:");
      console.log(e);
      this.render();
    },
    events: {
      "click button.quit": "quitTask",
      "click button.done": "completeTask",
      "click button.claim": "claimTask"
    },
    quitTask: function(e) {
      this.model.set({"assignee": "", "status": "unassigned"});
    },
    completeTask: function(e) {
      this.model.set({"status": "completed"})
      console.log("completeTask");
    },
    claimTask: function(e) {
      this.model.set({"assignee": app.currentUser.get("username"), "status": "in progress"});
    }
  });

  /**
   You'll need a view with input fields for the user to fill in when creating a new task. It should probably have both a create and cancel button. The location and format of the view is up to you.
   */
  var CreateTaskView = Backbone.View.extend({

  });

  var TaskCollectionView = Backbone.View.extend({
    relevantTasks: [],
    initialize: function(opts) {
      _.extend(this, opts);
      this.listenTo(this.collection, 'add', this.addTask);
      this.listenTo(this.collection, 'change', this.updateTask);
      this.listenTo(this.collection, 'remove', this.removeTask);
      this.render();
    },
    addTask: function(e) {
      this.render();
    },
    updateTask: function(e) {
      this.render();
    },
    removeTask: function(e) {
      this.render();
    },
    filterCollection: function() {
      if (this.kind === "unassigned") {
        this.relevantTasks = this.collection.where({
          status: "unassigned"
        });
      } else {
        var assigned = this.collection.where({
          assignee: app.currentUser.get("username")
        });
        var created = this.collection.where({
          creator: app.currentUser.get("username")
        });
        this.relevantTasks = _.union(assigned, created);
      }
    },
    render: function() {
      this.filterCollection();
      var title = this.kind === 'unassigned' ? "Unassigned Tasks" : app.currentUser.get("username") + "'s Tasks"
      this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
      this.$el.append($("<h1>").html(title));
      // make a new TaskView for each this.relevantTasks
      var self = this;
      this.relevantTasks.forEach(function(e) {
        var taskView = new TaskView({
          model: e,
        });
        self.$el.append(taskView.$el);
      })
      this.$el.addClass('task-collection');
      this.$el.addClass(this.kind);
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
      var $taskViews = $("<div id='taskViews'>");
      var taskCollectionView1 = new TaskCollectionView({
        collection: app.gui.tasks,
        kind: "unassigned"
      });
      var taskCollectionView2 = new TaskCollectionView({
        collection: app.gui.tasks,
        kind: "user"
      });
      $taskViews.append(taskCollectionView1.$el);
      $taskViews.append(taskCollectionView2.$el);
      this.$el.append($taskViews);
    },
    events: {
      "click button#logout": "logout",
      "click button#add-task": "addTask"
    },
    logout: function(e) {
      var loginView = new LoginView({
        collection: app.gui.users
      })
      this.remove();
    },
    addTask: function(e) {
      // TODO: this method will create a CreateTaskView, not immediately create a task
      this.tasks.add({creator:this.user.get("username")});
    }
  });

  // a list of known users to choose from
  var LoginView = Backbone.View.extend({
    initialize: function() {
      this.render();
      $("#app").append(this.$el);
    },
    events: {
      "click button#login": "login"
    },
    login: function(e) {
      e.preventDefault();
      var id = $("select#usernames").val();
      var selectedUser = this.collection.get(id);
      app.currentUser = selectedUser;
      var homePageView = new HomePageView({
        user: selectedUser,
        tasks: app.gui.tasks
      })
      this.remove();
    },
    render: function() {
      var users = this.collection.models;
      var output = "<h1>Welcome!</h1><form><select id='usernames'><option></option>"
      users.forEach(function(user) {
        output += "<option value='" + user.cid + "'>" + user.get("username") + "</option>"
      })
      output += "</select><button type='submit' name='submit' id='login'>LOG IN</button></form>"
      this.$el.html(output);
    }
  });

  // generic ctor to represent interface:
  function GUI(users, tasks, el) {
    this.users = users; // a UsersCollection
    this.tasks = tasks; // an IssuesCollection
    var loginView = new LoginView({
      collection: this.users
    })
  }

  return GUI;
} ())
