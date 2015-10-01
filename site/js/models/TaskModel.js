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

// SharedTaskModel is the model type on TaskCollection.
//
// Constructor that either returns an existing TaskModel that is stored in
// the MasterTaskCollection, or first adds a new TaskModel to the
// MasterTaskCollection and then returns it.
//
// ** This is how the MasterTaskCollection gets populated with TaskModel
// objects when the app starts **
//
app.SharedTaskModel = function(attrs) {
  if ('id' in attrs) {
    var existingTask = app.allTasks.find(function(e) {
      return e.id === attrs.id;
    })
    if (existingTask) {
      return existingTask;
    } else {
      var task = new app.TaskModel(attrs);
      app.allTasks.add(task, {silent: true});
      // app.allTasks.add(task);
      return task;
    }
  } else {
    var task = new app.TaskModel(attrs);
    return task;
  }
}