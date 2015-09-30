var app = app || {}

app.MasterTaskCollection = Backbone.Collection.extend({
  model: app.TaskModel,
  initialize: function(models, options) {
    console.log("Init MasterTaskCollection");
    this.on("add", function(e) {
      console.log("ADD ", e);
    })
    this.on("create", function(e) {
      console.log("CREATE ", e);
    })
    this.on("change", function(e) {
      console.log("CHANGE ", e);
    })
  }
})
