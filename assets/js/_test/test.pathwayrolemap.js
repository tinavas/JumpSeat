var PATHWAYMAP = {

		id : "",
		url : "api/pathwayrolemap",
		roleid : "54bf019e7dfb2af5e8000010",
		pathwayid : "54bf01957dfb2aeecc000022",

		getByRole : function(roleid){
			var data = {};
				data.roleid = roleid ? roleid : this.roleid;

			Aero.send(this.url + "/by_role", data, function(r){
				console.log(r);
			}, "GET");
		},

		getByPathway : function(pathwayid){
			var data = {};
				data.pathwayid = pathwayid ? pathwayid : this.pathwayid;

			Aero.send(this.url + "/by_pathway", data, function(r){
				console.log(r);
			}, "GET");
		},

		post : function(option){
			var self = this;
			var data = {
				"pathwayid": this.pathwayid,
				"roleid" : this.roleid
			};

			data = $q.extend({}, data, option);

			Aero.send(this.url, data, function(r){
				self.id = r;
				console.log(r);
			}, "POST");

		},

		del : function(pathwayid, roleid){
			var data = {};
				data.pathwayid = pathwayid ? pathwayid : this.pathwayid;
				data.roleid = roleid ? roleid : this.roleid;

			Aero.send(this.url, data, function(r){
				console.log(r);
			}, "DELETE");
		}
};