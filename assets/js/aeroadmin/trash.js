"use strict";

/**
 * @class Guide
 * Start admin namespace
 */
var Trash = {

	init : function(){
		$q('#form-wrapper').html("");
		Trash.view.render();

		//New Menu
		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "Delete",
							title : "Deleting",
							msg : "You are about to delete <strong>"+ ids.length +"</strong> item(s)</strong>?",
							onConfirm : function(){
								Trash.api.del(ids);
							}
						});
					}
				},
				onExport : function(ids){
					Utils._export("guide", ids);
				}
		};
		new Utils.menu("#menu", options);
	}
};

/**
 *  @namespace Trash
 *  @class Trash.model
 *  Model for Trash Object
 */
Trash.model = {

	url : "api/trash",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	}
};

/**
 *  @namespace Trash
 *  @class Trash.view
 *  UX Views and Event Handlers
 */
Trash.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = 'trash/table';
		var columns = [
		       { "width": "5%",  "sClass" : "center" },
		       { "width": "25%" },
		       { "width": "30%" },
		       { "width": "5%", "sClass" : "center" },
		       { "width": "5%", "sClass" : "center" },
		       { "width": "20%"},
		       { "width": "5%", "sClass" : "tright"}
		 ];

		this.table = new Utils.datatable(url, columns);
		this.setEvents();
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		//Delete
		$q('body').off("click.pathd").on("click.pathd", ".delete", function(){
            console.log('Delete');
            console.log(this);
			var id = $q(this).parents('div:eq(0)').data('id');
			var name = $q(this).parents('tr').find('td:eq(1)').text();
            console.log(id);
            console.log(name);
			//Confirm
			Aero.confirm({
				ok : "Delete",
				title : name,
				msg : "Are you sure you want to delete this?",
				onConfirm : function(){
					Trash.api.del(id);
				}
			});
			return false;
		});

		//Restore
		$q('body').off("click.pathe").on("click.pathr", ".restore", function(){
            console.log('Edit');
            console.log(this);
			var id = $q(this).parents('div:eq(0)').data('id');
            console.log(id);

			Trash.api.restore(id);
                //function(r){
				//Trash.view.renderForm(r);
			//}, id);
			return false;
		});
	}
};


/**
 *  @namespace Trash
 *  @class Trash.api
 *  API REST Services
 */
Trash.api = {

	/**
	 *  Retrieve the guides in the trash
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback){

		var data = {};

		Aero.send(Trash.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

    restore : function(id, callback){
        var data = { id: id };

        Aero.send(Trash.model.url, data, function(r){
            if(callback) callback(r);
        }, 'POST');
    },

	/**
	 *  Delete guide
	 *  @param string id
	 */
	del : function(id){
		//Call
		Aero.send(Trash.model.url, { id : id}, function(){
			Trash.view.table.ajax.reload();
		}, "DELETE");
	}
};

$q(function(){
	Trash.init();
});
