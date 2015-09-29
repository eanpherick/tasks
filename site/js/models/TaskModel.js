var app = app || {}

app.TaskModel = Backbone.Model.extend({
  urlRoot: "/tasks",
  // idAttribute: "_id",
  defaults: {
    title: 'New Task',
    description: 'task details...',
    creator: '',
    assignee: '',
    status: 'unassigned',
    createdOn: new Date(),
    completedOn: new Date()
  }
})

app.SharedTaskModel = function(attrs) {
  // console.log("SharedTaskModel: ", attrs);
  if (('id' in attrs) && app.allTasks[attrs.id]) {
    return app.allTasks[attrs.id];
  } else {
    var task = new app.TaskModel(attrs)
    if ('id' in attrs) {
      app.allTasks[attrs.id] = task;
    }
    return task;
  }
}