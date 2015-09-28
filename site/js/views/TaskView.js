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
    assignee = assignee === "" ? "unassigned" : assignee;
    this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
    this.$el.append($("<h1>").html(this.model.get('title')));
    this.$el.append($("<h2>").html(this.model.get('description')));
    this.$el.append($("<p class='creator'>").html("CREATED BY: " + this.model.get('creator')));
    this.$el.append($("<p class='assignee'>").html("ASSIGNED TO: " + assignee));
    this.$el.append($("<p class='created'>").html("CREATED ON: " + this.model.get('createdOn')));
    if (status === "unassigned") {
      this.$el.append($("<button class='claim'>").html("CLAIM"));
    } else if (assignee === app.currentUser.get("username") && status !== "completed") {
      this.$el.append($("<button class='quit'>").html("QUIT"));
      this.$el.append($("<button class='done'>").html("DONE"));
    } else if (status === "completed") {
      var date = new Date(this.model.get('completedOn'));
      this.$el.append($("<p class='completed-date'>").html(date));
    }
    this.$el.addClass("task-view");
  },
  updateView: function(e) {
    this.render();
  },
  events: {
    "click button.quit": "quitTask",
    "click button.done": "completeTask",
    "click button.claim": "claimTask"
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
    this.model.set({"assignee": app.currentUser.get("username"), "status": "in progress"});
    this.model.save();
  }
});
