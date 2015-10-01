var app = app || {};

$(function() {
  app.currentUser = null;
  app.users = new app.UserCollection();
  app.allTasks = new app.MasterTaskCollection();
  app.gui = new GUI('#app'); // selector of main div
});
