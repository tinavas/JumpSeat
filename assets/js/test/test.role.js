var ROLE = {

		id : "",
		url : "api/role",

		get : function(id){
			var self = this;
			var data = {};
			if(id) data = { id : id };

			Aero.send(this.url, data, function(r){
				if(id) self.id = r[0]['id'];
				console.log(r);
			}, "GET");
		},

		post : function(){
			var self = this;
			var data = {
				"title": "Role 1",
				"description" : "Some description",
				"pathways" : []
			};

			Aero.send(this.url, data, function(r){
				self.id = r;
				console.log(r);
			}, "POST");

		},

		put : function(){
			var data = {
				id : this.id,
				title: "Role Updated"
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "PUT");

		},

		del : function(){
			Aero.send(this.url, { id : this.id}, function(r){
				console.log(r);
			}, "DELETE");
		}
};