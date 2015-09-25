var UserModel = Backbone.Model.extend({
	defaults: {
		username:''
	},
  initialize: function(opts) {
    console.log("make a new UserModel with:", opts);
  }
})

// status options: 'unassigned', 'in progress', 'completed'
var TaskModel = Backbone.Model.extend({
	defaults: {
		title:'New Task',
		description:'task details...',
		creator:'',
		assignee:'',
		status:'unassigned',
    createdOn:new Date(),
    completedOn:new Date(),
	},
  initialize: function(opts) {
    console.log("make a new TaskModel with:", opts);
  }
})

var UserCollection = Backbone.Collection.extend({
	model:UserModel,
  url : "/users",
  initialize: function() {
    this.fetch();
  },
  activeUser:null
})

var TaskCollection = Backbone.Collection.extend({
	model:TaskModel,
  url : "/tasks",
  initialize: function () {
      this.fetch();
  }
})
