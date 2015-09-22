var GUI = (function() { //IIFE for all Views
  /**
   This view displays a single task, showing its title, description, status, creator, and assignee (if any). Each TaskView should include one or more controls (e.g. a select or set of buttons) to change its state.

   Each task view will be associated with exactly one task model, although a model may have more than one view instance.
   */
  var TaskView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
      this.render();
      // $("#app").html(this.$el);
    },
    render: function() {
      console.log(this);
      var $taskCollectionView = $("<div class='task-collection " + this.kind + "'>")
      $taskCollectionView.append($("<h1>").html("I am a task collection view"));
      this.$el = $taskCollectionView;
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
        this.relevantTasks = this.collection.where({status: "unassigned"});
      } else {
        this.relevantTasks = this.collection.where({assignee: app.currentUser.get("username")});
      }
      console.log(this.relevantTasks);
    },
    render: function() {
      var $taskCollectionView = $("<div class='task-collection " + this.kind + "'>")
      $taskCollectionView.append($("<h1>").html("I am a task collection view"));
      // make a new TaskView for each this.collection
      this.$el = $taskCollectionView;
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
      $output.append($("<button id='addTask'>").html("Add Task"));
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
      this.$el = $output;
    },
    events: {
      "click button#logout": "logout"
    },
    logout: function(e) {
      var loginView = new LoginView({
        collection: app.gui.users,
        el: "#app"
      })
      this.remove(); // TODO: remove the view, but not the main #app div
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

      // this.model.set('username', $("select#usernames").val());
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
    // users is collection of User models
    // tasks is collection of Task models
    // el is selector for where GUI connects in DOM
    //...
    // console.log("GUI");
    this.users = users; // a UsersCollection
    this.tasks = tasks; // an IssuesCollection

    var loginView = new LoginView({
      collection: this.users
      // el: "#app"
    })
    // var taskCollectionView = new TaskCollectionView({
    //   collection: this.tasks,
    //   el: "#app";
    // })
  }

  return GUI;
} ())
