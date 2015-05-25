"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var Rolemap = {

	//Id used for edit
	roleid : null,
	initialized : false,

	init : function(){
		if(this.initialized) return;
		this.initialized = true;

		$q('#rolemap .form-wrapper').html("")
		Rolemap.view.render();

		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "un-link",
							title : "Removing Guide Links",
							msg : "Are you sure you want to remove the association for " + ids.length + " items?",
							onConfirm : function(){
								Rolemap.api.del(ids);
							}
						});
					}
				}
		};
		new Utils.menu("#menu", options);
	}
};


/**
 *  @namespace Rolemap
 *  @class Rolemap.model
 *  Model for Rolemap Object
 */
Rolemap.model = {

	url : "api/rolemap",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	save : function(){
		//Get form data
		var data = $q('form').aeroSerialize();
		Rolemap.api.create(data.guideid);
	}
};

/**
 *  @namespace Rolemap
 *  @class Rolemap.view
 *  UX Views and Event Handlers
 */
Rolemap.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = "rolemap/tableguide?roleid=" + Rolemap.roleid;

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
		Aero.tpl.get("rolemap-form.html", function(r){
			Rolemap.api.getPathways(function(){
				var tpl = _q.template(r);
				Aero.confirm({
					ok : "Save",
					title : "Associate to this role",
					msg : tpl( { guides: Rolemap.GUIDES }),
					onConfirm : function(){
						Rolemap.model.save();
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
		$q('ul.tabs a:eq(1)').off("click.tab1").on("click.tab1", function(e){
			Rolemap.init();
		});

		//Move to tab
		$q('ul.tabs a:eq(2)').off("click.tab2").on("click.tab2", function(e){
			RoleUserMap.init();
		});

		//ACL Update
		$q('.acl').change(function(){
			var $l = $q(this).parents('.panel-active:eq(0)');
			var key = $l.data('key');
			var type = $l.data('type');

			var data = {};
				data[key] = {};
				data[key][type] = $q(this).is(':checked');

			//Save permission
			Rolemap.api.putPermission(data);
		});

		//Add
		$q('#rolemap .add').off("click.patha").on("click.patha", function(){
			Rolemap.view.renderForm();
			return false;
		});

		//Delete
		$q('body').off("click.pathd").on("click.pathd", "#rolemap .delete", function(){
			var id = $q(this).parents('div:eq(0)').data('id');
			var name  = $q(this).parents('tr:eq(0)').find('td:eq(1)').text();

			//Confirm
			Aero.confirm({
				ok : "un-link",
				title :name,
				msg : "Are you sure you want to un-link this guide?",
				onConfirm : function(){
					Rolemap.api.del(id);
				}
			});
			return false;
		});
	}
};


/**
 *  @namespace Rolemap
 *  @class Rolemap.api
 *  API REST Services
 */
Rolemap.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
			data.roleid = Rolemap.roleid;

		Aero.send(Rolemap.model.url + "/by_role", data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Get all guides for list
	 *  @param function callback
	 *  @param id
	 */
	getPathways : function(callback){

		if(Rolemap.GUIDES){
			callback(Rolemap.GUIDES);
			return;
		}

		Aero.send("api/guides", {}, function(r){
			Rolemap.GUIDES = r;
			callback();
		}, "GET");
	},


	/**
	 *  Update permissions
	 *  @param object data
	 */
	putPermission : function(data){

		data.id = Rolemap.roleid;
		Aero.send("api/role/permission", data, function(r){
		}, "PUT");
	},


	/**
	 *  Create new rolemap
	 *  @param function callback
	 *  @param id
	 */
	create : function(guideid){

		//Testing
		Aero.log('Associating with guideid: ' + guideid, 'info');

		//Call
		var data = {
			"roleid": Rolemap.roleid,
			"guideid" : guideid
		};

		Aero.send(Rolemap.model.url, data, function(r){
			if(r) Rolemap.view.table.ajax.reload();
		}, "POST");
	},

	/**
	 *  Delete rolemap
	 *  @param string id
	 */
	del : function(guideid){

		//Testing
		Aero.log('Deleting with guideid: ' + guideid, 'info');
		var data = {
			"roleid": Rolemap.roleid,
			"guideid" : guideid
		};

		//Call
		Aero.send(Rolemap.model.url, data, function(r){
			Rolemap.view.table.ajax.reload();
		}, "DELETE");
	}
};

$q(function(){
	Rolemap.roleid = $q('.description').data('id');
	Rolemap.view.setEvents();
	Rolepath.init();
});
