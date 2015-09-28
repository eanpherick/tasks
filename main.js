var app = {};

$(function() {
  app.currentUser = null;
  app.users = new UserCollection();
  app.tasks = new TaskCollection();

  app.gui = new GUI('#app'); // selector of main div
});
