var app = app || {};

$(function() {
  app.currentUser = null;
  app.users = new app.UserCollection();
  app.tasks = new app.TaskCollection();

  app.gui = new GUI('#app'); // selector of main div
});
