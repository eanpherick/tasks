var GUI = (function() { //IIFE for all Views
  /**
   This view displays a single task, showing its title, description, status, creator, and assignee (if any). Each TaskView should include one or more controls (e.g. a select or set of buttons) to change its state.

   Each task view will be associated with exactly one task model, although a model may have more than one view instance.
   */
  var TaskView = Backbone.View.extend({

  });

  /**
   You'll need a view with input fields for the user to fill in when creating a new task. It should probably have both a create and cancel button. The location and format of the view is up to you.
   */
  var CreateTaskView = Backbone.View.extend({

  });

  var TaskCollectionView = Backbone.View.extend({

  });

  // would have two TaskCollectionViews (for unassigned tasks and the current user's tasks)
  // would also the name of the current user, a logout button, and a Create Task button
  var HomePageView = Backbone.View.extend({
    user: null,
    tasks: null,
    initialize: function(opts) {
      _.extend(this, opts);
      this.render();
    },
    render: function() {
      console.log(this.tasks);
      this.$el.html("<button>" + this.user.get("username") + "</button>")
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
      var selectedUser = this.collection.get(id)
      var homePageView = new HomePageView({user: selectedUser, el: "#app", tasks: app.gui.tasks})

      // this.model.set('username', $("select#usernames").val());
    },
    render: function() {
      console.log(this.collection);
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
    this.currentUser = "";
    var loginView = new LoginView({
      collection: this.users,
      el: "#app"
    })
    // var taskCollectionView = new TaskCollectionView({
    //   collection: this.tasks,
    //   el: "#app";
    // })
  }

  return GUI;
} ())
