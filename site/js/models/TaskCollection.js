var app = app || {}

app.TaskCollection = Backbone.Collection.extend({
  model: app.SharedTaskModel,
  url: "/tasks", // will be overwritten to be `tasks-unassigned`, `task-user/<username>`, or `tasks-completed`
  collectionKind: null,
  initialize: function(models, options) {
    this.masterTaskCollection = app.allTasks;
    this.collectionKind = options.collectionKind;
    this.url = options.url;
    this.listenTo(this.masterTaskCollection, "add", this.taskAdded);
    this.listenTo(this.masterTaskCollection, "change", this.taskChanged);
    this.listenTo(this.masterTaskCollection, "remove", this.taskRemoved);
    this.fetch(); // returns and array of object. each obj is passed to new SharedTaskModel(obj)
  },
  taskAdded: function(e) {
    var status = e.get("status");
    var creator = e.get("creator");
    var assignee = e.get("assignee");
    var currentUser = app.currentUser.get("username");
    switch (this.collectionKind) {
    case "unassigned":
      if (status === "unassigned") {
        this.add(e);
      }
      break;
    case "user":
      if (creator === currentUser || assignee === currentUser) {
        this.add(e);
      }
      break;
    case "completed":
      if (status === "completed") {
        this.add(e);
      }
      break;
    }
  },
  taskChanged: function(e) {
    var status = e.get("status");
    var creator = e.get("creator");
    var assignee = e.get("assignee");
    var currentUser = app.currentUser.get("username");
    switch (this.collectionKind) {
    case "unassigned":
      if (status !== "unassigned") {
        this.remove(e);
      } else if (status === "unassigned") {
        this.add(e);
      }
      break;
    case "user":
      if ((creator === currentUser || assignee === currentUser) && status !== "completed") {
        this.add(e);
      } else {
        this.remove(e);
      }
      break;
    case "completed":
      if (status === "completed") {
        this.add(e);
      }
      break;
    }
  },
  taskRemoved: function(e) {
    this.remove(e);
  }
})
