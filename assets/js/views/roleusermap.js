"use strict";

/**
 *  Start the role mapping to user app
 */
require([ 'api/rolemap-user' ], function() {

    /**
     *  @namespace RoleUserMap
     *  @class RoleUserMap.view
     *  UX Views and Event Handlers
     */
    RoleUserMap.view = {

        table : null,

        /**
         *  Initialize
         */
        init : function(){
            if(this.initialized) return;
            this.initialized = true;

            $q('#roleusermap .form-wrapper').html("");
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
        },

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
                RoleUserMap.view.init();
            });

            //Add
            $q('#roleusermap .add').off("click.ua").on("click.ua", function(){
                RoleUserMap.view.renderForm();
                return false;
            });

            //Delete
            $q('body').off("click.ud").on("click.ud", "#roleusermap .delete", function(){
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

});
