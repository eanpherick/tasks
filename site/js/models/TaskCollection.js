var app = app || {}

app.TaskCollection = Backbone.Collection.extend({
  model: app.TaskModel,
  url: "/tasks",
  initialize: function(args) {
    console.log("url: ", this.url);
    if (args !== undefined) {
      this.url += "-" + args;
      if (args === "user") {
        this.url += "/" + app.currentUser.get("username");
      }
    }
    console.log("url is now: ", this.url);
    this.fetch(); // returns and array of object. each obj is passed to new TaskModel(obj)
  }
})
