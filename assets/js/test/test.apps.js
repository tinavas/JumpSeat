var APPS = {
		id : null,

		url : "api/apps",

		get : function(){
			var data = (this.id == "") ? {} : { id : this.id };

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(){
			var self = this;
			var data = {
				"title": "Google",
				"host": "google.ca",
				"active": true,
				"step-defaults": "",
				"theme": ""
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
				self.id = r;
			}, "POST");

		},

		put : function(){
			var data = {
				"title": "Google",
				"host": "google.ca",
				"active": true,
				"step-defaults": "",
				"theme": ""
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "PUT");

		},

		del : function(){
//			var id = [ "54b32addd77e88be0a8b4574", "54b32ae3d77e8842058b456b"]
			var id = this.id;
			this.id = null;

			Aero.send(this.url, { id : id }, function(r){
				console.log(r);
			}, "DELETE");
		}
};