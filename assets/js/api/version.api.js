"use strict";

/**
 * @class Version
 * Start admin namespace
 */
var Version = {

    //Id used for edit
    id: null
};

/**
 *  @namespace Version
 *  @class Version.model
 *  Model for Version Object
 */
Version.model = {

    url: "api/versions",

    defaults: function () {
        return {
            "title": "",
            "description": ""
        }
    },

    save: function () {

        //Get form data
        var data = $q('form').aeroSerialize();
        data.active = (data.active) ? true : false;

        //Create or update
        if (Version.id) {
            Version.api.update(data, Version.id);
        } else {
            Version.api.create(data);
        }
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
    get: function (id, callback) {
        //Get by id?
        var data = {};
        if (id) data = {id: id};

        Aero.send(Version.model.url, data, function (r) {
            if (callback) callback(r);
        }, "GET");
    },

    /**
     * Restore an older version
     * @param version int Version number
     */
    restore: function (version, callback) {
        var data = {id: Version.id, version: version};

        Aero.send(Version.model.url, data, function (r) {
            Version.view.table.ajax.reload();
            if (callback) callback(r);
        }, "POST");
    },

    /**
     *  Delete version
     *  @param string version Version number
     */
    del: function (version) {
        //Call
        Aero.send(Version.model.url, {id: Version.id, version: version}, function () {
            Version.view.table.ajax.reload();
        }, "DELETE");
    }
};
