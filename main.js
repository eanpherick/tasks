var app = {};

$(function() { //when DOM is ready...
  app.currentUser = "";
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
    assignee: '',
    status: 'unassigned'
  },
  {
    title: 'Do Work',
    description: 'it will be hard',
    creator: 'Kathleen',
    assignee: '',
    status: 'unassigned'
  },
  {
    title: 'sleep',
    description: 'it will be hard',
    creator: 'Kathleen',
    assignee: 'Erik',
    status: 'in progress'
  }

  ]);

  app.gui = new GUI(app.users, app.tasks, '#app'); // selector of main div
});
