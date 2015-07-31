var BLACKLIST = {
		id : null,

		url : "api/blacklist",

		get : function(blacklistUrl){
			var data = { 
				"url" : blacklistUrl
			}
			
			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(){
			var self = this;
			var data = {
                "url" : "JumpSeat.com",
                "globPrefix" : false,
                "globSuffix" : false,
                "description" : "Exact match URL"
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
				self.id = r;
			}, "POST");

		},

		put : function(){
			var data = {
				"id" : this.id,
				"url" : "JumpSeat.com",
                "globPrefix" : false,
                "globSuffix" : true,
                "description" : "Match any suffix"
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
}