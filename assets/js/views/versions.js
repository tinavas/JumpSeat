"use strict";

/**
 *  Start the role mapping to pathways
 */
require(['api/versions'], function(){

    /**
     *  @namespace Version
     *  @class Version.view
     *  UX Views and Event Handlers
     */
    Version.view = {

        table: null,

        /**
         *  Initialize versions
         */
        init: function () {
            //Clear
            $q('#form-wrapper').html("");

            Version.id = $q('#version').data('versionid');
            Version.view.render();

            //New Menu
            var options = {
                onDelete: function (ids) {
                    if (ids.length > 0) {
                        //Confirm
                        Aero.confirm({
                            ok: "Delete",
                            title: "Deleting",
                            msg: "You are about to delete <strong>" + ids.length + "</strong> version(s)</strong>?",
                            onConfirm: function () {
                                Version.api.del(ids);
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

            var url = "versions/table";

            var columns = [
                {"width": "5%", "sClass": "center"},
                {"width": "8%", "sClass": "center"},
                {"width": "30%"},
                {"width": "5%", "sClass": "center"},
                {"width": "20%"},
                {"width": "5%", "sClass": "tright"}
            ];

            this.table = new Utils.datatable(url, columns, Version.id);
            this.setEvents();
        },

        /**
         *  Setup all event triggers
         */
        setEvents: function () {

            //Delete
            $q('body').off("click.pathd").on("click.pathd", ".delete", function () {
                var id = $q(this).parents('div:eq(0)').data('id');
                //Confirm
                Aero.confirm({
                    ok: "Delete",
                    title: 'Delete version',
                    msg: "Are you sure you want to delete this?",
                    onConfirm: function () {
                        Version.api.del(id);
                    }
                });
                return false;
            });

            //Restore version
            $q('body').off("click.pathu").on("click.pathu", ".restore", function () {
                var id = $q(this).parents('div:eq(0)').data('id');

                Version.api.restore(id, function (r) {
                    //Version.view.render(r);
                });
                return false;
            });
        }
    };

    $q(function () {
        Version.view.init(); });

});
