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
  var UserView = Backbone.View.extend({

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
      console.log("clicked:");
      console.log(e);
    },
    render: function() {
      // console.log(this.collection);
      var usernames = this.collection.pluck("username");
      var output = "<h1>Welcome!</h1><select><option></option>"
      usernames.forEach(function(username) {
        output += "<option value='" + username + "'>" + username + "</option>"
      })
      output += "</select><button id='login'>LOG IN</button>"
      this.$el.html(output);
    }
  });

  // generic ctor to represent interface:
  function GUI(users, tasks, el) {
    // users is collection of User models
    // tasks is collection of Task models
    // el is selector for where GUI connects in DOM
    //...
    console.log("GUI");
    this.users = users; // a UsersCollection
    this.tasks = tasks; // an IssuesCollection
    var loginView = new LoginView({
      collection: this.users,
      el: "#app"
    });
  }

  return GUI;
} ())
