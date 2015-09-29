var app = app || {}

app.TaskCollection = Backbone.Collection.extend({
  model: app.SharedTaskModel,
  url: "/tasks",
  initialize: function(models, options) {
    this.url = options.url;
    console.log("new TaskCollection: ", options);
    console.log("url is now: ", this.url);
    this.fetch(); // returns and array of object. each obj is passed to new TaskModel(obj)
  }
})
