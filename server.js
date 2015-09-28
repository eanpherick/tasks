var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var db = require('orchestrate')(config.orchestratekey);

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
] // TODO: create the list of users on startup, if there are none
var currentUser = null; // TODO: save the current user to a cookie so different browsers can have different users logged in.

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

app.get('/', function(req, res) {
  res.send(currentUser);
})

app.post('/', function(req, res) {
  currentUser = req.body;
  res.end();
})

// get an existing task
app.get('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log('GET task ' + id);
  res.send(tasks[id]);
});

// update an existing task
app.put('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log("update task with id: ", id);
  console.log("passed in: ", req.body);
  db.put('tasks', id, req.body)
    .then(function(result) {
      res.send({id: id});
    })
    .fail(function(err) {
      console.log("PUT FAILED: ", err);
      res.end()
    })
  // console.log("called PUT for id: " + id);
  // console.log("passed in ", req.body);
  // tasks[id] = req.body;
  // showData();
});

// create a new Task
app.post('/tasks', function(req, res) {
  console.log("Called POST for ");
  console.log('Receiving a new task...');

  db.post('tasks', req.body)
  .then(function(result) {
    console.log(">> put in a thing <<");
    console.log(result.path.key);
    console.log(">> --- <<");
    console.log();
    res.send({id: result.path.key}); // TODO: actually send back some info?
  })
  .fail(function(err) {
    res.end(); // TODO: actually post some kind of error message
  })
  // tasks[newid] = req.body;
  // res.send({
  //   id: newid
  // });
});

app.get('/tasks', function(req, res) {
  db.list('tasks')
    .then(function(result) {
      // console.log("got all tasks back");
      // console.log(result.body.results);
      tasksArray = result.body.results.map(function(e) {
        var task = e.value;
        task.id = e.path.key;
        console.log("mapping", e);
        return e.value;
      })
      // result.body.results is an array or objects with keys: path, value, reftime
      res.send(tasksArray);
    })
    .fail(function(err) {
      console.log(err);
    });
  // var tasksArray = tasks.map(function(e, i) {
  //   var newTask = {};
  //   for (var key in e) {
  //     newTask[key] = e[key];
  //   }
  //   newTask.id = i;
  //   return newTask;
  // });
  // res.send(tasksArray);
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
