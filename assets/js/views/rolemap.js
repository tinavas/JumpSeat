"use strict";

/**
 *  Start the user app
 */
require([ 'api/rolemap' ], function() {

	/**
	 *  @namespace Rolemap
	 *  @class Rolemap.view
	 *  UX Views and Event Handlers
	 */
	Rolemap.view = {

		table : null,

        /**
         *  Initialize View
         */
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
        },

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
				Rolemap.view.init();
			});

			//Move to tab
			$q('ul.tabs a:eq(2)').off("click.tab2").on("click.tab2", function(e){
				RoleUserMap.view.init();
			});

			//ACL Update
			$q('.acl').off("change").on("change", function(){
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
			$q('#rolemap .add').off("click.guia").on("click.guia", function(){
				Rolemap.view.renderForm();
				return false;
			});

			//Delete
			$q('body').off("click.guid").on("click.guid", "#rolemap .delete", function(){
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

	$q(function(){
		Rolemap.roleid = $q('.description').data('id');
		Rolemap.view.setEvents();
		Rolemap.view.init();
	});
});
