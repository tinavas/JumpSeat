"use strict";

/**
 *  Start the role mapping to pathways
 */
require(['api/blacklist'], function() {

	/**
	 *  @namespace Blacklist
	 *  @class Blacklist.view
	 *  UX Views and Event Handlers
	 */
	Blacklist.view = {

		table: null,

		/**
		 *  Initialize Blacklis
		 */
		init: function () {
			$q('#form-wrapper').html("");
			Blacklist.view.render();

			var options = {
				onDelete: function (ids) {
					if (ids.length > 0) {
						//Confirm
						Aero.confirm({
							ok: "Delete",
							title: "Deleting URLs",
							msg: "You are about to delete " + ids.length + " items. Are you sure?",
							onConfirm: function () {
								Blacklist.api.del(ids);
							}
						});
					}
				}
			};
			new Utils.menu("#menu", options);
		},

		/**
		 *  Render list view
		 */
		render: function () {

			var url = "blacklist/table";
			var columns = [
				{"width": "5%", "sClass": "center"},
				{"width": "40%"},
				{"width": "35%"},
				{"width": "10%", "sClass": "center"},
				{"width": "10%", "sClass": "center"},
				{"width": "10%", "sClass": "tright"}
			];

			this.table = new Utils.datatable(url, columns);
			this.setEvents();
		},

		/**
		 *  Render list view
		 */
		renderForm: function (blacklist) {

			var self = this;
			Aero.tpl.get("blacklist-form.html", function (r) {

				Blacklist.id = (blacklist) ? blacklist.id : null;
				if (!blacklist) blacklist = {};
				var tpl = _q.template(r);
				//Confirm
				Aero.confirm({
					ok: "save",
					title: "URL information",
					msg: tpl({blacklist: blacklist}),
					onValidate: function () {
						return Blacklist.model.validate();
					},
					onConfirm: function () {
						Blacklist.model.save();
					}
				});
			});
		},


		/**
		 *  Setup all event triggers
		 */
		setEvents: function () {

			//Shortcuts
			$q('body').off("keypress.sn").on("keypress.sn", function (e) {
				var k = e.keyCode || e.which;
				if (e.target.tagName == "BODY" && k == '78' && e.shiftKey) Blacklist.view.renderForm();
			});

			//Save
			$q('.add').off("click.patha").on("click.patha", function () {
				Blacklist.view.renderForm();
				return false;
			});

			//Delete
			$q('body').off("click.pathd").on("click.pathd", ".delete", function () {
				var id = $q(this).parents('div:eq(0)').data('id');
				var name = $q(this).parents('tr:eq(0)').find('td:eq(1)').text();
				//Confirm
				Aero.confirm({
					ok: "delete",
					title: name,
					msg: "Are you sure you want to delete this item?",
					onConfirm: function () {
						Blacklist.api.del(id);
					}
				});
				return false;
			});

			//Edit
			$q('body').off("click.pathe").on("click.pathe", ".edit", function () {
				var id = $q(this).parents('div:eq(0)').data('id');

				Blacklist.api.get(function (r) {
					Blacklist.view.renderForm(r);
				}, id);
				return false;
			});
		}
	};


	$q(function () {
		Blacklist.view.init(); });
});
