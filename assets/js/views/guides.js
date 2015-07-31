"use strict";

/**
 *  Start the role manager
 */
require([ 'api/guides','utils/password','utils/export','lib/uploadify'], function() {

    /**
     *  @namespace Guide
     *  @class Guide.view
     *  UX Views and Event Handlers
     */
    Guide.view = {

        table : null,

        /**
         *  Initialize view
         */
        init : function(){
            $q('#form-wrapper').html("");
            Guide.view.render();

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
                                Guide.api.del(ids);
                            }
                        });
                    }
                },
                onExport : function(ids){
                    Utils._export("guide", ids);
                },
                onClone : function(ids){
                    Guide.api.clone(ids);
                }
            };
            new Utils.menu("#menu", options);
        },

        /**
         *  Render list view
         */
        render : function(){

            var url = "guides/table";
            var columns = [
                   { "width": "5%",  "sClass" : "center" },
                   { "width": "25%" },
                   { "width": "30%" },
                   { "width": "5%", "sClass" : "center" },
                   { "width": "5%", "sClass" : "center" },
                   { "width": "5%", "sClass" : "center" },
                   { "width": "20%"},
                   { "width": "5%", "sClass" : "tright"}
             ];

            console.log(url);
            this.table = new Utils.datatable(url, columns);
            this.setEvents();
        },

        /**
         *  Render list view
         */
        renderForm : function(guide){

            Aero.tpl.get("guide-form.html", function(r){

                Guide.id = (guide) ? guide.id : null;
                if(!guide) guide = {};

                //Get load tpl
                var tpl = _q.template(r);

                //Confirm
                Aero.confirm({
                    ok : "save",
                    title : "Guide Information",
                    msg : tpl( { guide: guide }),
                    onValidate : function(){
                        return Guide.model.validate();
                    },
                    onConfirm : function(){
                        Guide.model.save();
                    }
                });
            });
        },


        /**
         *  Setup all event triggers
         */
        setEvents : function(){

            //Shortcuts
            $q('body').off("keypress.sn").on("keypress.sn", function(e){
                var k = e.keyCode || e.which;
                if(e.target.tagName == "BODY" && k == '78' && e.shiftKey) Guide.view.renderForm();
            });

            //Add
            $q('.add').off("click.patha").on("click.patha", function(){
                Guide.view.renderForm();
                return false;
            });

            //Delete
            $q('body').off("click.pathd").on("click.pathd", ".delete", function(){
                var id = $q(this).parents('div:eq(0)').data('id');
                var name = $q(this).parents('tr').find('td:eq(1)').text();
                //Confirm
                Aero.confirm({
                    ok : "Delete",
                    title : name,
                    msg : "Are you sure you want to delete this?",
                    onConfirm : function(){
                        Guide.api.del(id);
                    }
                });
                return false;
            });

            //Edit
            $q('body').off("click.pathe").on("click.pathe", ".edit", function(){
                var id = $q(this).parents('div:eq(0)').data('id');

                Guide.api.get(function(r){
                    Guide.view.renderForm(r);
                }, id);
                return false;
            });

            //Trash
            $q('body').off("click.pathf").on("click.pathf", ".trash", function(){
                window.location.href = '/app/' + AeroStep.host + '/trash';
                return false;
            });
        }
    };


    $q(function(){
        Guide.view.init();

        //Chrome cache issue
        setTimeout(function () {
            //New Import
            new Utils._import("#import", { uploader : '/api/import_guide', width:177 }, function(){
                Guide.view.table.ajax.reload();
            });
        }, 0);
});
});
