var app = app || {}

app.TaskCollection = Backbone.Collection.extend({
  model: app.TaskModel,
  url: "/tasks",
  initialize: function() {
    this.fetch(); // returns and array of object. each obj is passed to new TaskModel(obj)
  }
})
