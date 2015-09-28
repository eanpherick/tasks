var app = app || {};

app.HomePageView = Backbone.View.extend({
  user: null,
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
    $.post("/", {username: ""});
    var loginView = new LoginView({
      collection: app.gui.users
    })
    this.remove();
  },
  showNewTaskView: function(e) {
    var createTaskView = new CreateTaskView();
    createTaskView.render();
    $("#task-form").append(createTaskView.$el);
  }
});