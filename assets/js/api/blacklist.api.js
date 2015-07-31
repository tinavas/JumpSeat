"use strict";

/**
 * @class Blacklist
 * Start admin namespace
 */
var Blacklist = {

    //Id used for edit
    id: null
};


/**
 *  @namespace Blacklist
 *  @class Blacklist.model
 *  Model for Blacklist Object
 */
Blacklist.model = {

    url: "api/blacklist",

    defaults: function () {
        return {
            "url": "",
            "description": "",
            "active": true,
            "globPrefix": false,
            "globSuffix": false
        }
    },

    validate: function () {
        //Check for required
        var valid = $q('form').isFormValid();
        return valid;
    },

    save: function () {

        //Get form data
        var data = $q('form').aeroSerialize();
        data.active = (data.active) ? true : false;

        //Still need to make booleans false to save properly
        if (!data.globPrefix) data.globPrefix = false;
        if (!data.globSuffix) data.globSuffix = false;

        //Create or update
        if (Blacklist.model.validate()) {
            if (Blacklist.id) {
                Blacklist.api.update(data, Blacklist.id);
            } else {
                Blacklist.api.create(data);
            }
        }
    }
};

/**
 *  @namespace Blacklist
 *  @class Blacklist.api
 *  API REST Services
 */
Blacklist.api = {

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    get: function (callback, id) {
        //Get by id?
        var data = {};
        if (id) data = {id: id};

        Aero.send(Blacklist.model.url, data, function (r) {
            if (callback) callback(r);
        }, "GET");
    },

    /**
     *  Create new blacklist
     *  @param function callback
     *  @param id
     */
    create: function (data) {
        //Call
        Aero.send(Blacklist.model.url, data, function (r) {
            Blacklist.view.table.ajax.reload();
        }, "POST");
    },

    /**
     *  Update blacklist data
     *  @param string[] data
     *  @param function callback
     */
    update: function (data, id, callback) {

        data.id = id;

        //Call
        Aero.send(Blacklist.model.url, data, function (r) {
            Blacklist.view.table.ajax.reload();
            if (callback) callback(r);
        }, "PUT");
    },

    /**
     *  Delete blacklist
     *  @param string id
     */
    del: function (id) {
        //Call
        Aero.send(Blacklist.model.url, {id: id}, function (r) {
            Blacklist.view.table.ajax.reload();
        }, "DELETE");
    }
};
