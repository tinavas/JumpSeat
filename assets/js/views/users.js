"use strict";

/**
 *  Start the user app
 */
require([ 'api/users','utils/password','utils/export','lib/uploadify'], function() {

    /**
     *  @namespace User
     *  @class User.view
     *  UX Views and Event Handlers
     */
    User.view = {

        table: null,

        init: function () {

            $q('#form-wrapper').html("");
            User.view.render();

            //New Menu
            var options = {
                onDelete: function (ids) {
                    if (ids.length > 0) {
                        //Confirm
                        Aero.confirm({
                            ok: "Delete",
                            title: "Deleting",
                            msg: "You are about to delete <strong>" + ids.length + "</strong> user(s)</strong>?",
                            onConfirm: function () {
                                User.api.del(ids);
                            }
                        });
                    }
                },
                onExport: function (ids) {
                    Utils._export("user", ids);
                },
                onClone: function (ids) {
                    User.api.clone(ids);
                }
            };
            new Utils.menu("#menu", options);

        },
        /**
         *  Render list view
         */
        render: function () {

            var url = "users/table";
            var columns = [
                {"width": "3%", "sClass": "center"},
                {"width": "10%"},
                {"width": "10%"},
                {"width": "15%"},
                {"width": "5%"},
                {"width": "13%"},
                {"width": "5%", "sClass": "center"},
                {"width": "5%", "sClass": "tright"}
            ];

            this.table = new Utils.datatable(url, columns);
            this.setEvents();
        },

        /**
         *  Render list view
         */
        renderForm: function (user) {

            Aero.tpl.get("user-form.html", function (r) {

                User.id = (user) ? user.id : null;
                if (!user) user = {};

                //Get load tpl
                var tpl = _q.template(r);

                //Confirm
                Aero.confirm({
                    ok: "save",
                    title: "User Information",
                    msg: tpl({user: user}),
                    onValidate: function () {
                        return User.model.validate();
                    },
                    onConfirm: function () {
                        User.model.save();
                    }
                });

                $q(document).foundation();

                //PWD Strength
                var options = {
                    onKeyUp: function (evt) {
                        $q(evt.target).pwstrength("outputErrorList");
                    }
                };
                $q('input[name="password"]').pwstrength(options);
            });
        },


        /**
         *  Setup all event triggers
         */
        setEvents: function () {

            //Shortcuts
            $q('body').off("keypress.sn").on("keypress.sn", function (e) {
                var k = e.keyCode || e.which;
                if (e.target.tagName == "BODY" && k == '78' && e.shiftKey) User.view.renderForm();
            });

            //Save
            $q('.add').off("click.patha").on("click.patha", function () {
                User.view.renderForm();
                return false;
            });

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
                        User.api.del(id);
                    }
                });
                return false;
            });

            //Edit
            $q('body').off("click.pathe").on("click.pathe", ".edit", function () {
                var id = $q(this).parents('div:eq(0)').data('id');

                User.api.get(function (r) {
                    User.view.renderForm(r);
                }, id);
                return false;
            });

            //Disable password if email user is selected and vice versa
            $q('body').on('change', '#emailuser', function () {
                var self = this;
                $q('input[type=password]').each(function () {
                    if ($q(self).is(':checked')) {
                        $q(this).prop('disabled', true);
                    } else {
                        $q(this).prop('disabled', false);
                    }
                });
            });
        }
    };

    $q(function(){
        User.view.init();

        //Chrome cache issue
        setTimeout(function () {
            //New Import
            new Utils._import("#import", { uploader : '/api/import_user', width:177 }, function(){
                User.view.table.ajax.reload();
            });
        }, 0);
    });
});
