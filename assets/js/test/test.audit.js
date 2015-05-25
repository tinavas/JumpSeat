var AUDIT = {
		id : null,

		url : "api/audit",

		get : function(){
			var data = (this.id == "") ? {} : { id : this.id };

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(){
			var self = this;
			var data = {
				"user": "trevor.dell",
				"host": "reddit.com",
				"guideid": "",
				"pathwayid": "",
				"progress": "1",
				"timeStart": "",
				"timeStamp": "",
				"timeTotal": ""
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
				self.id = r;
			}, "POST");

		},

		put : function(){
			var data = {
				"id": this.id,
				"user": "trevor.dell",
				"host": "reddit.com",
				"guideid": "",
				"pathwayid": "",
				"progress": "2",
				"timeStart": "",
				"timeStamp": "",
				"timeTotal": ""
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