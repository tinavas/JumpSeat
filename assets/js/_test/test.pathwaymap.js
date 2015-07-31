var PATHWAYMAP = {

		id : "",
		url : "api/pathwaymap",
		guideid : "54b7376e7dfb2a6702000116",
		pathwayid : "54c6cb6e7dfb2ab017000001", //Sales

		putIndexes : function(pathway){
			var data = {};
				data.pathwayid = pathway ? pathway : this.pathwayid;
				data.guides = [
				      "54c6cb617dfb2a361100002a" : 3,
				      "54c6d2647dfb2ab717000005" : 1,
				      "54c6d2667dfb2ab717000006" : 2
				]

			Aero.send(this.url + "/indexes", data, function(r){
				console.log(r);
			}, "PUT");
		},

		getByRole : function(role){
			var data = {};
				data.role = role;

			Aero.send(this.url + "/by_role", data, function(r){
				console.log(r);
			}, "GET");
		},

		getByGuide : function(guide){
			var data = {};
				data.guideid = guide ? guide : this.guideid;

			Aero.send(this.url + "/by_guide", data, function(r){
				console.log(r);
			}, "GET");
		},

		getByPathway : function(pathway){
			var data = {};
				data.pathwayid = pathway ? pathway : this.pathwayid;

			Aero.send(this.url + "/by_pathway", data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(option){
			var self = this;
			var data = {
				"pathwayid": this.pathwayid,
				"guideid" : this.guideid
			};

			data = $q.extend({}, data, option);

			Aero.send(this.url, data, function(r){
				self.id = r;
				console.log(r);
			}, "POST");
		},

		del : function(){
			var data = {
				"pathwayid": "1",
				"guideid" : "2"
			};

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "DELETE");
		}
};