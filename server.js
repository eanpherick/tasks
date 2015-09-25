var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname));

var tasks = [];
var users = [
{
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
}
]
var currentUser = null;

// Allow optional test data...
var testValues = [
  {
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
  }
]
var useTestValues = process.argv[2]; // a number, optional extra argument when starting server
if (useTestValues) tasks = testValues.slice(0, useTestValues);

function showData() {
  console.log('Data store is now: ', tasks);
}

// get an existing task
app.get('/tasks/:id', function(req, res) {
  var id = req.params.id;
  res.send(tasks[id]);
});

// update an existing task
app.put('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log("called PUT for id: " + id);
  console.log("passed in ", req.body);
  tasks[id] = req.body.value;
  res.send({
    id: id
  });
});

// create a new Task
app.post('/tasks', function(req, res) {
  console.log("Called POST for ");
  console.log('Receiving a new task...');
  var newid = tasks.length;
  console.log('Assigning id of %s', newid);
  tasks[newid] = req.body.value;
  res.send({
    id: newid
  });
});

// get all Tasks
app.get('/tasks', function(req, res) {
  // showData();
  console.log('Get all of the tasks...');
  var tasksArray = tasks.map(function(e, i) {
    var newTask = {};
    for (var key in e) {
      newTask[key] = e[key];
    }
    newTask.id = i;
    return newTask;
  });
  console.log('sending ', tasksArray);
  res.send(tasksArray);
});

// get all Users
app.get('/users', function(req, res) {
  var usersArray = users.map(function(e, i) {
    var newUser = {};
    for (var key in e) {
      newUser[key] = e[key];
    }
    newUser.id = i;
    return newUser;
  });
  console.log('sending ', usersArray);
  res.send(usersArray);
});

app.listen(3000);
// showData();
