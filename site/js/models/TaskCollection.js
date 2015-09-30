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
    console.log("added ", e, " to TaskCollection of type: ", this.collectionKind);
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
    // TODO: only call this.add(e) if the new task should really be added
    // this.add(e);
  },
  taskChanged: function(e) {
    console.log("TaskCollection > change task: ", e);
    // either remove e from this or add it
  },
  taskRemoved: function(e) {
    console.log("TaskCollection > remove task: ", e);
    this.remove(e);
  },
  hasTask: function(taskModel, array) {
    var result = this.find(function(model) {
      return taskModel.cid === model.cid;
    })
    return result !== undefined;
  }
})
