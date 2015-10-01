var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'site')));
app.use('/', routes);

var tasks = [];
var currentUser = null; // TODO: save the current user to a cookie so different browsers can have different users logged in.

function showData() {
  console.log('Data store is now: ', tasks);
}

app.listen(3000);
