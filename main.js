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
    description: 'it will be relaxing',
    creator: 'Pilar',
    assignee: 'Pilar',
    status: 'in progress'
  },
  {
    title: 'wake up',
    description: 'it will suck',
    creator: 'RZA',
    assignee: '',
    status: 'unassigned'
  },
  {
    title: 'take a bath',
    description: 'it will be wet',
    creator: 'Kathleen',
    assignee: 'RZA',
    status: 'in progress'
  },
  {
    title: 'brush hair',
    description: 'it will be pointless',
    creator: 'Erik',
    assignee: '',
    status: 'unassigned'
  },

  ]);

  app.gui = new GUI(app.users, app.tasks, '#app'); // selector of main div
});
