"use strict";

/**
 *  Start the role mapping to pathways
 */
require([ 'api/rolemap-pathway' ], function() {

    /**
     *  @namespace Rolepath
     *  @class Rolepath.view
     *  UX Views and Event Handlers
     */
    Rolepath.view = {

        table: null,

        /**
         *  Initialize
         */
        init: function () {
            $q('#rolepath .form-wrapper').html("")
            Rolepath.view.render();

            var options = {
                onDelete: function (ids) {
                    if (ids.length > 0) {
                        //Confirm
                        Aero.confirm({
                            ok: "un-link",
                            title: "Removing Path links",
                            msg: "Are you sure you want to un-link " + ids.length + " items?",
                            onConfirm: function () {
                                Rolepath.api.del(ids);
                            }
                        });
                    }
                }
            };
            new Utils.menu("#menuPath", options);
        },

        /**
         *  Render list view
         */
        render: function () {

            var url = "pathwayrolemap/table?roleid=" + Rolemap.roleid;
            var columns = [
                {"width": "5%", "sClass": "center"},
                {"width": "30%"}, {"width": "50%"},
                {"width": "5%", "sClass": "center"},
                {"width": "10%", "sClass": "tright"}
            ];

            this.table = new Utils.datatable(url, columns, "rolepath");
            this.setEvents();
        },

        /**
         *  Render list view
         */
        renderForm: function () {

            var self = this;
            Aero.tpl.get("rolepath-form.html", function (r) {

                Rolepath.api.getPathways(function () {
                    var tpl = _q.template(r);
                    Aero.confirm({
                        ok: "Save",
                        title: "Associate to this role",
                        msg: tpl({paths: Rolepath.PATHWAYS}),
                        onConfirm: function () {
                            Rolepath.model.save();
                        }
                    });
                });
            });
        },


        /**
         *  Setup all event triggers
         */
        setEvents: function () {

            //Key save
            $q('#rolepath .form-wrapper').off("keypress.pkey").on("keypress.pkey", function (e) {
                var k = e.keyCode || e.which;
                if (k == '13') Rolepath.model.save();
            });

            //Add
            $q('#rolepath .add').off("click.pa").on("click.pa", function () {
                Rolepath.view.renderForm();
                return false;
            });

            //Delete
            $q('body').off("click.pd").on("click.pd", "#rolepath .delete", function () {
                var id = $q(this).parents('div:eq(0)').data('id');
                var name = $q(this).parents('tr:eq(0)').find('td:eq(1)').text();

                //Confirm
                Aero.confirm({
                    ok: "un-link",
                    title: name,
                    msg: "Are you sure you want to un-link this path?",
                    onConfirm: function () {
                        Rolepath.api.del(id);
                    }
                });
                return false;
            });

            //Save
            $q('#rolepath .save').off("click.ps").on("click.ps", function () {
                Rolepath.model.save();
                return false;
            });

            //Cancel
            $q('.cancel').off("click.pc").on("click.pc", function () {
                $q('#rolepath .form-wrapper').html("");
                return false;
            });
        }
    };

    $q(function(){ Rolepath.view.init(); });
});
