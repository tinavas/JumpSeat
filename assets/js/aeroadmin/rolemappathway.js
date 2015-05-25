"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var Rolepath = {

	//Id used for edit
	roleid : null,

	init : function(){
		$q('#rolepath .form-wrapper').html("")
		Rolepath.view.render();

		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "un-link",
							title : "Removing Path links",
							msg : "Are you sure you want to un-link " + ids.length + " items?",
							onConfirm : function(){
								Rolepath.api.del(ids);
							}
						});
					}
				}
		};
		new Utils.menu("#menuPath", options);
	}
};


/**
 *  @namespace Rolepath
 *  @class Rolepath.model
 *  Model for Rolepath Object
 */
Rolepath.model = {

	url : "api/pathwayrolemap",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	save : function(){
		//Get form data
		var data = $q('form').aeroSerialize();
		Rolepath.api.create(data.pathwayid);
	}
};

/**
 *  @namespace Rolepath
 *  @class Rolepath.view
 *  UX Views and Event Handlers
 */
Rolepath.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = "pathwayrolemap/table?roleid=" + Rolemap.roleid;
		var columns = [
		        { "width": "5%",  "sClass" : "center" },
		       { "width": "30%" }, { "width": "50%" },
		       { "width": "5%",  "sClass" : "center"},
		       { "width": "10%", "sClass" : "tright"}
		 ];

		this.table = new Utils.datatable(url, columns, "rolepath");
		this.setEvents();
	},

	/**
	 *  Render list view
	 */
	renderForm : function(){

		var self = this;
		Aero.tpl.get("rolepath-form.html", function(r){

			Rolepath.api.getPathways(function(){
				var tpl = _q.template(r);
				Aero.confirm({
					ok : "Save",
					title : "Associate to this role",
					msg : tpl( { paths: Rolepath.PATHWAYS }),
					onConfirm : function(){
						Rolepath.model.save();
					}
				});
			});
		});
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		//Key save
		$q('#rolepath .form-wrapper').off("keypress.pkey").on("keypress.pkey", function(e){
			var k = e.keyCode || e.which;
			if(k == '13') Rolepath.model.save();
		});

		//Add
		$q('#rolepath .add').off("click.pa").on("click.pa", function(){
			Rolepath.view.renderForm();
			return false;
		});

		//Delete
		$q('body').off("click.pd").on("click.pd", "#rolepath .delete", function(){
			var id = $q(this).parents('div:eq(0)').data('id');
			var name  = $q(this).parents('tr:eq(0)').find('td:eq(1)').text();

			//Confirm
			Aero.confirm({
				ok : "un-link",
				title : name,
				msg : "Are you sure you want to un-link this path?",
				onConfirm : function(){
					Rolepath.api.del(id);
				}
			});
			return false;
		});

		//Save
		$q('#rolepath .save').off("click.ps").on("click.ps", function(){
			Rolepath.model.save();
			return false;
		});

		//Cancel
		$q('.cancel').off("click.pc").on("click.pc", function(){
			$q('#rolepath .form-wrapper').html("");
			return false;
		});
	}
};


/**
 *  @namespace Rolepath
 *  @class Rolepath.api
 *  API REST Services
 */
Rolepath.api = {

	/**
	 *  Get all pathways for list
	 *  @param function callback
	 *  @param id
	 */
	getPathways : function(callback){

		if(Rolepath.PATHWAYS){
			callback(Rolepath.PATHWAYS);
			return;
		}

		Aero.send("api/pathway", {}, function(r){
			Rolepath.PATHWAYS = r;
			callback();
		}, "GET");
	},

	/**
	 *  Create new rolepath
	 *  @param function callback
	 *  @param id
	 */
	create : function(pathwayid){
		//Call
		var data = {
			"roleid": Rolemap.roleid,
			"pathwayid" : pathwayid
		};

		Aero.send(Rolepath.model.url, data, function(r){
			Rolepath.view.table.ajax.reload();
			$q('.form-wrapper').html("");
		}, "POST");
	},

	/**
	 *  Delete rolepath
	 *  @param string id
	 */
	del : function(pathwayid){

		//Testing
		Aero.log('Deleting with guideid: ' + pathwayid, 'info');
		var data = {
			"roleid": Rolemap.roleid,
			"pathwayid" : pathwayid
		};

		//Call
		Aero.send(Rolepath.model.url, data, function(r){
			Rolepath.view.table.ajax.reload();
			$q('.form-wrapper').html("");
		}, "DELETE");
	}
};
