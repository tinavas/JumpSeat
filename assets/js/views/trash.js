"use strict";

/**
 *  Start the trash app
 */
require(['api/trash'], function() {

	/**
	 *  @namespace Trash
	 *  @class Trash.view
	 *  UX Views and Event Handlers
	 */
	Trash.view = {

		table: null,

		/**
		 *  Initialize View
		 */
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
		},


		/**
		 *  Render list view
		 */
		render: function () {

			var url = 'trash/table';
			var columns = [
				{"width": "5%", "sClass": "center"},
				{"width": "25%"},
				{"width": "30%"},
				{"width": "5%", "sClass": "center"},
				{"width": "5%", "sClass": "center"},
				{"width": "20%"},
				{"width": "5%", "sClass": "tright"}
			];

			this.table = new Utils.datatable(url, columns);
			this.setEvents();
		},


		/**
		 *  Setup all event triggers
		 */
		setEvents: function () {

			//Delete
			$q('body').off("click.pathd").on("click.pathd", ".delete", function () {

				var id = $q(this).parents('div:eq(0)').data('id');
				var name = $q(this).parents('tr').find('td:eq(1)').text();

				//Confirm
				Aero.confirm({
					ok: "Delete",
					title: name,
					msg: "Are you sure you want to delete this?",
					onConfirm: function () {
						Trash.api.del(id);
					}
				});
				return false;
			});

			//Restore
			$q('body').off("click.pathe").on("click.pathr", ".restore", function () {

				var id = $q(this).parents('div:eq(0)').data('id');

				Trash.api.restore(id);
				//function(r){
				//Trash.view.renderForm(r);
				//}, id);
				return false;
			});
		}
	};

	//Start
    $q(function () { Trash.view.init(); });
});
