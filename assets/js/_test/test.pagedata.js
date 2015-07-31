var PAGEDATA = {
		id : null,

		url : "api/pagedata",

		get : function(){
			var data = this.id == null ? {} : { id : this.id };

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(){
			var self = this;
			var data = {
					"type" : "javascript",
					"prop" : "username",
					"value" : "APP.username"
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
				self.id = r;
			}, "POST");

		},

		put : function(){
			var data = {
				"id" : this.id,
				"type" : "javascript",
				"prop" : "roles",
				"value" : [ "Administrator", "Fartface" ]
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "PUT");

		},

		del : function(){
			var id = this.id;
			this.id = null;

			Aero.send(this.url, { id : id }, function(r){
				console.log(r);
			}, "DELETE");
		}
};