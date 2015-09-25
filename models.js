var UserModel = Backbone.Model.extend({
	defaults: {
		username:''
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
    createdOn:new Date().getTime(),
    completedOn:new Date().getTime(),
	}
	// Add methods if needed...
})

var UserCollection = Backbone.Collection.extend({
	model:UserModel,
  activeUser:null
})

var TaskCollection = Backbone.Collection.extend({
	model:TaskModel
})
