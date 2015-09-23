var GUI = (function() { //IIFE for all Views
  /**
   This view displays a single task, showing its title, description, status, creator, and assignee (if any). Each TaskView should include one or more controls (e.g. a select or set of buttons) to change its state.

   Each task view will be associated with exactly one task model, although a model may have more than one view instance.
   */
  var TaskView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
      this.render();
      console.log("User job is " + this.model.get('title'));
    },
    render: function() {
      console.log(this);
      this.$el.html('<p>' + this.model.get('title') + '</p>');
      this.$el.addClass("task-view");
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
      this.filterCollection();
      this.render();
      // $("#app").html(this.$el);
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
      var $taskCollectionView = $("<div>");
      var title = this.kind === 'unassigned' ? "Unassigned Tasks" : app.currentUser.get("username") + "'s Tasks"
      $taskCollectionView.append($("<h1>").html(title));
      // make a new TaskView for each this.relevantTasks
      this.relevantTasks.forEach(function(e) {
        console.log(e.get('title'))
        var taskView = new TaskView({
          model: e,
        });
        $taskCollectionView.append(taskView.$el);
        // $taskViews.append(taskCollectionView2.$el);
      })
      this.$el.html($taskCollectionView.html());
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
      // var $output = "<h1>Hello " + this.user.get("username") + "</h1>";
      var $output = $("<div>")
      $output.append($("<h1>").html("Hello " + this.user.get("username")));
      $output.append($("<button id='logout'>").html("Log Out"));
      $output.append($("<button id='add-task'>").html("Add Task"));
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
      $output.append($taskViews);
      this.$el.html($output.html());
    },
    events: {
      "click button#logout": "logout",
      "click button#add-task": "addTask"
    },
    logout: function(e) {
      console.log("log out");
      var loginView = new LoginView({
        collection: app.gui.users,
        el: "#app"
      })
      this.remove();
    },
    addTask: function(e) {
      console.log(e);
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
      console.log("clicked log in");
      e.preventDefault();
      var id = $("select#usernames").val();
      var selectedUser = this.collection.get(id);
      app.currentUser = selectedUser;
      var homePageView = new HomePageView({
        user: selectedUser,
        tasks: app.gui.tasks
      })
      // this.remove();
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
