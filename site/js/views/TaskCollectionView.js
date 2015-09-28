var app = app || {};

app.TaskCollectionView = Backbone.View.extend({
  initialize: function(opts) {
    _.extend(this, opts);
    this.relevantTasks = [];
    this.taskViews = [];
    this.listenTo(this.collection, 'add', this.addTask);
    this.listenTo(this.collection, 'change', this.updateTask);
    this.listenTo(this.collection, 'remove', this.updateTask);
    this.filterCollection();
    this.render();
  },
  addTask: function(e) {
    this.filterCollection();
    this.makeTaskView(e);
  },
  updateTask: function(e) {
    this.updateTaskView(e);
  },
  filterCollection: function() {
    this.relevantTasks = [];
    if (this.kind === "unassigned") {
      this.relevantTasks = this.collection.filter(function(task){
        return task.get('status') === "unassigned"
      })
    } else if (this.kind === "user"){
      var assigned = this.collection.filter(function(task){
        return (task.get('status') === "in progress") && (task.get('assignee').toLowerCase() === app.currentUser.get("username").toLowerCase());
      })
      var created = this.collection.filter(function(task){
        return (task.get('creator').toLowerCase() === app.currentUser.get("username").toLowerCase()) && (task.get('status') !== "completed");
      })
      this.relevantTasks = _.union(assigned, created);
    } else {
      this.relevantTasks = this.collection.where({
        status: "completed"
      });
    }
  },
  makeTaskView: function(taskModel) {
    if (!this.hasTask(taskModel, this.relevantTasks)) return; // don't do anything if the taskModel isn't in `relevantTasks` array
    var taskView = new app.TaskView({
      model: taskModel
    });
    this.taskViews.push(taskView);
    this.$el.append(taskView.$el);
  },
  removeTaskView: function(taskModel) {
    if (this.hasTask(taskModel, this.relevantTasks)) return;
    this.taskViews.forEach(function(e, i, a) {
      if (e.model === taskModel) {
        e.remove();
        a.splice(i, 1);
      }
    })
  },
  // called on this.collection.change event
  updateTaskView: function(taskModel) {
    var oldTasks = this.relevantTasks.slice();
    this.filterCollection();
    if (this.hasTask(taskModel, oldTasks)) {
      if (!this.hasTask(taskModel, this.relevantTasks)) {
        this.removeTaskView(taskModel);
      }
    } else if (this.hasTask(taskModel, this.relevantTasks)) {
      this.makeTaskView(taskModel);
    }
  },
  render: function() {
    this.relevantTasks.reverse();
    var title = "Unassigned Tasks"
    if(this.kind === 'user'){
      title = app.currentUser.get("username") + "'s Tasks"
    } else if (this.kind === 'completed') {
      title = "Completed Tasks"
    };
    this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
    this.$el.append($("<h1>").html(title));
    // make a new TaskView for each this.relevantTasks
    var self = this;
    this.relevantTasks.forEach(function(task) {
      self.makeTaskView(task);
    })
    this.$el.addClass('task-collection');
    this.$el.addClass(this.kind);
  },
  // helper function to see if a given taskModel is contained in a given array
  hasTask: function(taskModel, array) {
    var result = _.find(array, function(model) {
      return taskModel.cid === model.cid;
    });
    return result !== undefined;
  }
});