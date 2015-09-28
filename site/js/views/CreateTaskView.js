var app = app || {};

app.CreateTaskView = Backbone.View.extend({
  initialize: function(opts) {
    _.extend(this, opts);
  },
  render: function() {
    var $form = $('<form id="form">');
    $form.append($('<input type="text" name="title" placeholder="Enter Task Title" autofocus>'));
    $form.append($('<input type="type" name="description" placeholder="Enter Task Description">'));
    $form.append($('<input type="submit" name="submit" value="Submit">'));
    $form.append($('<button id="cancel">').html('Cancel'));
    this.$el.append($form)
  },
  events: {
    "submit #form": "submitForm",
    "click #cancel": function(e) {e.preventDefault(); this.remove()}
  },
  submitForm: function(e) {
    e.preventDefault();
    var newTitle = $(e.target).children("input[name='title']").val();
    var newDescription = $(e.target).children("input[name='description']").val();
    var obj = {
      'createdOn': new Date(),
      'title': newTitle,
      'description': newDescription,
      'creator': app.currentUser.get('username')
    }
    app.tasks.create(obj)
    this.remove();
  }
});