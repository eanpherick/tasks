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
var currentUser = null; // TODO: save the current user to a cookie so different browsers can have different users logged in.

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
    res.send({id: result.path.key}); // TODO: actually send back more info?
  })
  .fail(function(err) {
    res.end(); // TODO: actually post some kind of error message
  })
});

// Get all the tasks
app.get('/tasks', function(req, res) {
  db.list('tasks', {limit: 100})
    .then(function(result) {
      // `result.body.results` is an array of objects with keys: path, value, reftime
      tasksArray = result.body.results.map(function(e) {
        var task = e.value;
        task.id = e.path.key;
        return task;
      })
      res.send(tasksArray);
    })
    .fail(function(err) {
      console.log(err);
    });
});

// get all Users
app.get('/users', function(req, res) {
  // get the users from the database
  db.list('users')
    .then(function(result) {
      var usersArray = result.body.results.map(function(e) {
        var user = e.value;
        user.id = e.path.key;
        return user;
      })
      res.send(usersArray);
    })
    .fail(function(err) {
      console.log(err);
    })
});

app.listen(3000);
