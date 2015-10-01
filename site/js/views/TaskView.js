var app = app || {};

app.TaskView = Backbone.View.extend({
  initialize: function(opts) {
    _.extend(this, opts);
    this.listenTo(this.model, 'change', this.updateView);
    this.render();
  },
  render: function() {
    var status = this.model.get('status');
    var assignee = this.model.get('assignee');
    var creator = this.model.get('creator');
    assignee = assignee === "" ? "unassigned" : assignee;
    this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
    this.$el.append($("<h1>").html(this.model.get('title')));
    this.$el.append($("<h2>").html(this.model.get('description')));
    this.$el.append($("<p class='creator'>").html("CREATED BY: " + creator));
    if (status !== "completed") {
      var date = new Date(this.model.get('createdOn'));
      var dateString = moment(date).format("MMMM Do YYYY, h:mm A")
      this.$el.append($("<p class='created-date'>").html("CREATED ON: " + dateString));
    }
    if (status === "unassigned") {
      this.$el.append($("<button class='claim'>").html("CLAIM"));
      if (creator === app.currentUser.get("username")) {
        this.$el.append($("<button class='delete'>").html("DELETE"));
      }
    } else if (status !== "completed") {
      this.$el.append($("<p class='assignee'>").html("ASSIGNED TO: " + assignee));
      if (assignee === app.currentUser.get("username")) {
        this.$el.append($("<button class='quit'>").html("QUIT"));
        this.$el.append($("<button class='done'>").html("DONE"));
      }
    } else if (status === "completed") {
      this.$el.append($("<p class='assignee'>").html("COMPLETED BY: " + assignee));
      var date = new Date(this.model.get('completedOn'));
      var dateString = moment(date).format("MMMM Do YYYY, h:mm A")
      this.$el.append($("<p class='completed-date'>").html("COMPLETED ON: " + dateString));
    }
    this.$el.addClass("task-view");
  },
  updateView: function(e) {
    this.render();
  },
  events: {
    "click button.quit": "quitTask",
    "click button.done": "completeTask",
    "click button.claim": "claimTask",
    "click button.delete": "deleteTask"
  },
  quitTask: function(e) {
    this.model.set({"assignee": "", "status": "unassigned"});
    this.model.save();
  },
  completeTask: function(e) {
    this.model.set({"status": "completed", "completedOn": new Date().getTime()});
    this.model.save();
  },
  claimTask: function(e) {
    console.log("claim ", this.model);
    this.model.set({"assignee": app.currentUser.get("username"), "status": "in progress"});
    this.model.save();
  },
  deleteTask: function(e) {
    this.model.destroy();
  },
});
