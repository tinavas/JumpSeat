"use strict";

/**
 * @class Version
 * Start admin namespace
 */
var Version = {

    //Id used for edit
    id : null,

    init : function(){

        this.id = $q('#version').data('versionid');

        $q('#form-wrapper').html("");
        Version.view.render();

        //New Menu
        var options = {
            onDelete : function(ids){
                if(ids.length > 0){
                    //Confirm
                    Aero.confirm({
                        ok : "Delete",
                        title : "Deleting",
                        msg : "You are about to delete <strong>"+ ids.length +"</strong> version(s)</strong>?",
                        onConfirm : function(){
                            Version.api.del(ids);
                        }
                    });
                }
            }
        };
        new Utils.menu("#menu", options);
    }
};

/**
 *  @namespace Version
 *  @class Version.model
 *  Model for Version Object
 */
Version.model = {

    url : "api/versions",

    defaults : function(){
        return {
            "title" : "",
            "description" : ""
        }
    },

    save : function(){

        //Get form data
        var data = $q('form').aeroSerialize();
        data.active = (data.active) ? true : false;

        //Create or update
        if(Version.id){
            Version.api.update(data, Version.id);
        }else{
            Version.api.create(data);
        }
    }
};

/**
 *  @namespace Version
 *  @class Version.view
 *  UX Views and Event Handlers
 */
Version.view = {

    table : null,

    /**
     *  Render list view
     */
    render : function(){

        var url = "versions/table";

        var columns = [
            { "width": "5%",  "sClass" : "center" },
            { "width": "8%",  "sClass" : "center" },
            { "width": "30%" },
            { "width": "5%", "sClass" : "center" },
            { "width": "20%"},
            { "width": "5%", "sClass" : "tright"}
        ];

        this.table = new Utils.datatable(url, columns, Version.id);
        this.setEvents();
    },

    /**
     *  Setup all event triggers
     */
    setEvents : function(){

        //Delete
        $q('body').off("click.pathd").on("click.pathd", ".delete", function(){
            var id = $q(this).parents('div:eq(0)').data('id');
            //Confirm
            Aero.confirm({
                ok : "Delete",
                title : 'Delete version',
                msg : "Are you sure you want to delete this?",
                onConfirm : function(){
                    Version.api.del(id);
                }
            });
            return false;
        });

        //Restore version
        $q('body').off("click.pathu").on("click.pathu", ".restore", function(){
            var id = $q(this).parents('div:eq(0)').data('id');

            Version.api.restore(id, function(r){
                //Version.view.render(r);
            });
            return false;
        });
    }
};

/**
 *  @namespace Version
 *  @class Version.api
 *  API REST Services
 */
Version.api = {

    /**
     *  Get all versions by id
     *  @param function callback
     *  @param id
     */
    get : function(id, callback){
        //Get by id?
        var data = {};
        if(id) data = { id : id };

        Aero.send(Version.model.url, data, function(r){
            if(callback) callback(r);
        }, "GET");
    },

    /**
     * Restore an older version
     * @param version int Version number
     */
    restore : function(version, callback){
        var data = { id: Version.id, version: version};

        Aero.send(Version.model.url, data, function(r){
            Version.view.table.ajax.reload();
            if(callback) callback(r);
        }, "POST");
    },

    /**
     *  Delete version
     *  @param string version Version number
     */
    del : function(version){
        //Call
        Aero.send(Version.model.url, { id : Version.id, version : version }, function(){
            Version.view.table.ajax.reload();
        }, "DELETE");
    }
};

$q(function(){
    Version.init();
});