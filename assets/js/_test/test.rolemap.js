var ROLEMAP = {

		id : "",
		url : "api/rolemap",

		getByRole : function(id){
			var data = {};
				data.roleid = id;

			Aero.send(this.url + "/by_role", data, function(r){
				console.log(r);
			}, "GET");
		},

		getByGuide : function(id){
			var data = {};
				data.guideid = id;

			Aero.send(this.url + "/by_guide", data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(option){
			var self = this;
			var data = {
				"roleid": "2",
				"guideid" : "2"
			};

			data = $q.extend({}, data, option);

			Aero.send(this.url, data, function(r){
				self.id = r;
				console.log(r);
			}, "POST");

		},

		del : function(option){
			var self = this;
			var data = {
				"roleid": "1",
				"guideid" : "2"
			};

			data = $q.extend({}, data, option);

			Aero.send(this.url, data, function(r){
				self.id = r;
				console.log(r);
			}, "DELETE");

		}
};