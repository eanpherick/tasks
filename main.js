var app = {};

$(function() { //when DOM is ready...
  app.currentUser = null;
  app.users = new UserCollection();
  app.tasks = new TaskCollection();

  app.gui = new GUI('#app'); // selector of main div
});
