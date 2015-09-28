var app = app || {};

app.LoginView = Backbone.View.extend({
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
    $.post("/", {username: selectedUser.get("username")});
    app.currentUser = selectedUser;
    var homePageView = new HomePageView({
      user: selectedUser
    })
    this.remove();
  },
  render: function() {
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