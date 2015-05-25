"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var RoleUserMap = {

	//Id used for edit
	roleid : null,
	initialized : false,

	init : function(){
		if(this.initialized) return;
		this.initialized = true;

		$q('#roleusermap .form-wrapper').html("")
		RoleUserMap.view.render();

		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "un-link",
							title : "Removing User Links",
							msg : "Are you sure you want to remove the association for " + ids.length + " items?",
							onConfirm : function(){
								RoleUserMap.api.del(ids);
							}
						});
					}
				}
		};
		new Utils.menu("#menuUser", options);
	}
};


/**
 *  @namespace RoleUserMap
 *  @class RoleUserMap.model
 *  Model for RoleUserMap Object
 */
RoleUserMap.model = {

	url : "api/roleusermap",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	save : function(){
		//Get form data
		var data = $q('form').aeroSerialize();
		RoleUserMap.api.create(data.userid);
	}
};

/**
 *  @namespace RoleUserMap
 *  @class RoleUserMap.view
 *  UX Views and Event Handlers
 */
RoleUserMap.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = "roleusermap/table?roleid=" + Rolemap.roleid;

		var columns = [
		       { "width": "5%",  "sClass" : "center" },
		       { "width": "30%" }, { "width": "50%" },
		       { "width": "5%",  "sClass" : "center"},
		       { "width": "10%", "sClass" : "tright"}
		 ];

		this.table = new Utils.datatable(url, columns);
		this.table.columns.adjust().draw();
		this.setEvents();
	},

	/**
	 *  Render list view
	 */
	renderForm : function(){

		var self = this;
		Aero.tpl.get("roleusermap-form.html", function(r){
			RoleUserMap.api.getUsers(function(){
				var tpl = _q.template(r);
				Aero.confirm({
					ok : "Save",
					title : "Associate to this role",
					msg : tpl( { users: RoleUserMap.USERS }),
					onConfirm : function(){
						RoleUserMap.model.save();
					}
				});
			});
		});
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		//Move to tab
		$q('ul.tabs a:eq(1)').off("click.tab").on("click.tab", function(e){
			RoleUserMap.init();
		});

		//Add
		$q('#roleusermap .add').off("click.patha").on("click.patha", function(){
			RoleUserMap.view.renderForm();
			return false;
		});

		//Delete
		$q('body').off("click.pathd").on("click.pathd", "#roleusermap .delete", function(){
			var id = $q(this).parents('div:eq(0)').data('id');
			var name  = $q(this).parents('tr:eq(0)').find('td:eq(1)').text();

			//Confirm
			Aero.confirm({
				ok : "un-link",
				title :name,
				msg : "Are you sure you want to un-link this user?",
				onConfirm : function(){
					RoleUserMap.api.del(id);
				}
			});
			return false;
		});
	}
};


/**
 *  @namespace RoleUserMap
 *  @class RoleUserMap.api
 *  API REST Services
 */
RoleUserMap.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
			data.roleid = Rolemap.roleid;

		Aero.send(RoleUserMap.model.url + "/by_role", data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Get all users for list
	 *  @param function callback
	 *  @param id
	 */
	getUsers : function(callback){

		if(RoleUserMap.USERS){
			callback(RoleUserMap.USERS);
			return;
		}

		Aero.send("api/users", { select : ['firstname', 'lastname' ]}, function(r){
			RoleUserMap.USERS = r;
			callback();
		}, "GET");
	},

	/**
	 *  Create new roleusermap
	 *  @param function callback
	 *  @param id
	 */
	create : function(userid){

		//Testing
		Aero.log('Associating with userid: ' + userid, 'info');

		//Call
		var data = {
			"roleid": Rolemap.roleid,
			"userid" : userid
		};

		Aero.send(RoleUserMap.model.url, data, function(r){
			if(r) RoleUserMap.view.table.ajax.reload();
		}, "POST");
	},

	/**
	 *  Delete roleusermap
	 *  @param string id
	 */
	del : function(userid){

		//Testing
		Aero.log('Deleting with userid: ' + userid, 'info');
		var data = {
			"roleid": Rolemap.roleid,
			"userid" : userid
		};

		//Call
		Aero.send(RoleUserMap.model.url, data, function(r){
			RoleUserMap.view.table.ajax.reload();
		}, "DELETE");
	}
};
