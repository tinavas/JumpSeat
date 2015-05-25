var PERMISSIONS = {

		id : "",
		url : "api/role/permission",

		getByRole : function(id){
			var self = this;
			var data = {};
			if(id) data = { id : id };

			Aero.send(this.url, data, function(r){
				if(id) self.id = r['id'];
				console.log(r);
			}, "GET");
		},

		getACL : function(roles){
			var self = this;
			var data = {};
				data.roles = ['Sales Manager','Admin'];

			Aero.send("api/role/acl", data, function(r){
				console.log(r);
			}, "GET");
		},

		put : function(){
			var data = {
				id : this.id,
				guide: {
					view : false
				}
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "PUT");
		}
};