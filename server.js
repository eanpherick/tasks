var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var path = require('path');
var db = require('orchestrate')(config.orchestratekey);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'site')));
// app.use(express.static(__dirname));

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
  console.log("GET /tasks/" + id);
  res.send(tasks[id]);
});

// update an existing task
app.put('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log("PUT /tasks/" + id);
  db.put('tasks', id, req.body)
    .then(function(result) {
      res.send({id: id});
    })
    .fail(function(err) {
      console.log("PUT FAILED: ", err);
      res.end()
    })
});

// delete an existing task
app.delete('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log("DELETE /tasks/" + id);
  db.remove('tasks', id)
    .then(function (result) {
      res.send({id: id});
    })
    .fail(function (err) {
      console.log("failed to delete " + id);
    })
});

// create a new Task
app.post('/tasks', function(req, res) {
  console.log("POST /tasks - ", req.body);
  console.log('Receiving a new task...');

  db.post('tasks', req.body)
  .then(function(result) {
    console.log(">> put in a thing <<");
    console.log(result.path.key);
    console.log(">> --- <<");
    console.log();
    res.send({id: result.path.key}); // TODO: actually send back more info? <-- Actually assigns the ID to the backbone model
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
      var tasksArray = result.body.results.map(function(e) {
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

// Get all the Unassigned Tasks
app.get('/tasks-unassigned', function(req, res) {
  db.search('tasks', 'status:"unassigned"') // if `status === "unassigned"`
  .then(function(result) {
    var tasksArray = result.body.results.map(function(e) {
      var task = e.value;
      task.id = e.path.key;
      return task;
    })
    res.send(tasksArray);
  })
  .fail(function(err) {
    console.log("ERROR");
    res.end();
  })
});

// Get a single Unassigned Task
app.get('/tasks-unassigned/:id', function(req, res) {
  db.search('tasks', 'status:"unassigned" AND id:"' + req.params.id + '"')
  .then(function(result) {
    var tasksArray = result.body.results.map(function(e) {
      return e.value;
      // var task = e.value;
      // task.id = e.path.key;
      // return task;
    })
    res.send(tasksArray);
  })
  .fail(function(err) {
    console.log("ERROR");
    res.end();
  })
});


app.post('/tasks-unassigned', function(req, res) {
  console.log("POST in unassigned: ", e.req.body);
  res.end();
})

// set a single task model
app.put('/tasks-unassigned/:id', function(req, res) {
  console.log("PUT in unassigned: ", e.req.body);
  // return the task if it should be added, else res.end();

  // db.search('tasks', 'status:"unassigned"') // if `status === "unassigned"`
  // .then(function(result) {
  //   var tasksArray = result.body.results.map(function(e) {
  //     var task = e.value;
  //     task.id = e.path.key;
  //     return task;
  //   })
  //   res.send(tasksArray);
  // })
  // .fail(function(err) {
  //   console.log("ERROR");
  //   res.end();
  // })
  res.end();
});

app.get('/tasks-completed', function(req, res) {
  db.search('tasks', 'status:"completed"') // if `status === "unassigned"`
  .then(function(result) {
    var tasksArray = result.body.results.map(function(e) {
      var task = e.value;
      task.id = e.path.key;
      return task;
    })
    res.send(tasksArray);
  })
  .fail(function(err) {
    console.log("ERROR");
    res.end();
  })
});

app.get('/tasks-user/:username', function(req, res) {
  // var username = currentUser.username;
  var username = req.params.username;
  // var query = '(status:"in progress" AND assignee:"joe") OR (creator:"joe" AND NOT status:"completed")'
var query = '(status:"in progress" AND assignee:"' + username + '") OR (creator:"' + username + '" AND NOT status:"completed")';
  db.search('tasks', query)
  .then(function(result) {
    var tasksArray = result.body.results.map(function(e) {
      var task = e.value;
      task.id = e.path.key;
      return task;
    })
    res.send(tasksArray);
  })
  .fail(function(err) {
    console.log("ERROR");
    res.end();
  })
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
