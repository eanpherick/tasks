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

// Constructor that either returns an existing TaskModel that is stored in
// the MasterTaskCollection, or first adds a new TaskModel to the
// MasterTaskCollection and then returns it
app.SharedTaskModel = function(attrs) {
  if ('id' in attrs && app.allTasks.find(function(e) {
      return e.id === attrs.id;
    })) {
    var currentTask = app.allTasks.find(function(e) {
      return e.id === attrs.id;
    });
    if (currentTask) {
      return currentTask;
    }
  } else {
    var task = new app.TaskModel(attrs)
    if ('id' in attrs) {
      app.allTasks.add(task, {silent: true});
    }
    return task;
  }
}