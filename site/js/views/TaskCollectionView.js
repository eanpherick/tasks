var app = app || {};

app.TaskCollectionView = Backbone.View.extend({
  initialize: function(opts) {
    _.extend(this, opts)
    this.taskViews = [];
    this.listenTo(this.collection, 'add', this.addTask);
    this.listenTo(this.collection, 'change', this.updateTask);
    this.listenTo(this.collection, 'remove', this.updateTask);
    this.render();
  },
  addTask: function(e) {
    console.log("Added new task: ", e);
    this.makeTaskView(e);
  },
  updateTask: function(e) {
    this.updateTaskView(e);
  },
  makeTaskView: function(taskModel) {
    if (!this.hasTask(taskModel, this.collection)) return; // don't do anything if the taskModel isn't in `relevantTasks` array
    var taskView = new app.TaskView({
      model: taskModel
    });
    this.taskViews.push(taskView);
    this.$el.append(taskView.$el);
  },
  removeTaskView: function(taskModel) {
    if (this.hasTask(taskModel, this.collection)) return;
    this.taskViews.forEach(function(e, i, a) {
      if (e.model === taskModel) {
        e.remove();
        a.splice(i, 1);
      }
    })
  },
  // called on this.collection.change event
  updateTaskView: function(taskModel) {
    var oldTasks = this.collection.models.slice();
    if (this.hasTask(taskModel, oldTasks)) {
      if (!this.hasTask(taskModel, this.collection)) {
        this.removeTaskView(taskModel);
      }
    } else if (this.hasTask(taskModel, this.collection)) {
      this.makeTaskView(taskModel);
    }
  },
  render: function() {
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
    console.log("Render: ", this.collection);
    this.collection.each(function(task) {
      console.log("make a task view for : ", task);
      self.makeTaskView(task);
    })
    this.$el.addClass('task-collection');
    this.$el.addClass(this.kind);
  },
  // helper function to see if a given taskModel is contained in a given array
  hasTask: function(taskModel, array) {
    var result = this.collection.find(function(model) {
      return taskModel.cid === model.cid;
    })
    return result !== undefined;
  }
});