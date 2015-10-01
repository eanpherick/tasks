var express = require('express');
var router = express.Router();
var config = require('./config');
var db = require('orchestrate')(config.orchestratekey);
var currentUser = null; // TODO: save the current user to a cookie so different browsers can have different users logged in.

router.get('/', function(req, res) {
  res.send(currentUser);
});

router.post('/', function(req, res) {
  currentUser = req.body;
  res.end();
});

// get an existing task
router.get('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log("GET /tasks/" + id);
  res.send(tasks[id]);
});

// update an existing task
router.put('/tasks/:id', function(req, res) {
  var id = req.params.id;
  console.log("PUT /tasks/" + id);
  db.put('tasks', id, req.body)
    .then(function(result) {
      res.send({id: id});
    })
    .fail(function(err) {
      console.log("PUT FAILED: ", err);
      res.end();
    })
});

// delete an existing task
router.delete('/tasks/:id', function(req, res) {
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
router.post('/tasks', function(req, res) {
  console.log("POST /tasks");
  db.post('tasks', req.body)
  .then(function(result) {
    res.send({id: result.path.key});
  })
  .fail(function(err) {
    res.end(); // TODO: actually post some kind of error message
  })
});

// Get all the tasks
router.get('/tasks', function(req, res) {
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
router.get('/tasks-unassigned', function(req, res) {
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
router.get('/tasks-unassigned/:id', function(req, res) {
  db.search('tasks', 'status:"unassigned" AND id:"' + req.params.id + '"')
  .then(function(result) {
    var tasksArray = result.body.results.map(function(e) {
      return e.value;
    })
    res.send(tasksArray);
  })
  .fail(function(err) {
    console.log("ERROR");
    res.end();
  })
});

router.get('/tasks-completed', function(req, res) {
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

router.get('/tasks-user/:username', function(req, res) {
  var username = req.params.username;
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
router.get('/users', function(req, res) {
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

module.exports = router;