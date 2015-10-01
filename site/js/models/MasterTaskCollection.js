var app = app || {}

app.MasterTaskCollection = Backbone.Collection.extend({
  url: "/tasks",
  model: app.TaskModel
})
