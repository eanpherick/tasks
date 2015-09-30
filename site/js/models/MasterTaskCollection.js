var app = app || {}

app.MasterTaskCollection = Backbone.Collection.extend({
  url: "/tasks",
  model: app.TaskModel,
  initialize: function(models, options) {
    console.log("Init MasterTaskCollection");
    this.on("add", function(e) {
      console.log("MasterTaskCollection.ADD ", e);
    })
    this.on("create", function(e) {
      console.log("MasterTaskCollection.CREATE ", e);
    })
    this.on("change", function(e) {
      console.log("MasterTaskCollection.CHANGE ", e);
    })
    this.on("remove", function(e) {
      console.log("MasterTaskCollection.REMOVE ", e);
    })
  }
})
