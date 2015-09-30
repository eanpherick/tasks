var app = app || {};

$(function() {
  app.currentUser = null;
  app.users = new app.UserCollection();
  // app.tasks = new app.TaskCollection();
  // app.allTasks = {};
  app.allTasks = new app.MasterTaskCollection();
  // app.tasksUnassigned = new app.TaskCollection([], {url: "/tasks-unassigned"});
//   app.tasksCompleted = new app.TaskCollection([], {url: "/tasks-completed"});
  // app.tasksUnassigned = new app.TaskCollection();
  // app.tasksCompleted = new app.TaskCollection();

  app.gui = new GUI('#app'); // selector of main div
});
