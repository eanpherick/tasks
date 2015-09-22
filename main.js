var app = {};

$(function() { //when DOM is ready...
  app.users = new UserCollection([{
    username: 'Kathleen'
  },
  {
    username: 'Erik'
  },
  {
    username: 'RZA'
  },
  {
    username: 'Pilar'
  }]);

  app.tasks = new TaskCollection([{
    title: 'Eat Lunch',
    description: 'it will be good',
    creator: 'Erik',
    assignee: 'Kathleen',
    status: 'unassigned'
  },
  {
    title: 'Do Work',
    description: 'it will be hard',
    creator: 'Kathleen',
    assignee: 'Erik',
    status: 'unassigned'
  }

  ]);

  app.gui = new GUI(app.users, app.tasks, '#app'); // selector of main div
});
