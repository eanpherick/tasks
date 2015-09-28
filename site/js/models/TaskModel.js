var app = app || {}

app.TaskModel = Backbone.Model.extend({
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