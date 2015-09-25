var app = {};

$(function() { //when DOM is ready...
  app.currentUser = "";
  app.users = new UserCollection();
  app.tasks = new TaskCollection();

  app.gui = new GUI(app.users, app.tasks, '#app'); // selector of main div
});
