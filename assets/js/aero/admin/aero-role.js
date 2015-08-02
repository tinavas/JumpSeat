"use strict";

/**
 * Admin Role APIs
 * @author Mike Priest
 * @type {{getAll: Function, getByGuideid: Function, createMapping: Function, destroyMapping: Function}}
 */
Aero.roles = {

    /**
     *  Get role listing
     */
    getAll : function(callback){
        if(!Aero.constants.ROLES){
            Aero.send("api/role", {}, function(r){
                Aero.constants.ROLES = r;
                callback(r)
            }, "GET");
        }else{
            callback(Aero.constants.ROLES);
        }
    },

    /**
     *  Get roles assigned to guide
     */
    getByGuideid : function(guideid, callback){
        Aero.send("api/rolemap/by_guide", { guideid : guideid }, function(r){
            callback(r);
        }, "GET");
    },

    /**
     *  Create association with role and guide
     */
    createMapping : function(roleid, guideid){
        Aero.send("api/rolemap", { guideid: guideid, roleid: roleid}, function(){
            Aero.view.guide.admin.renderMapping('roles');
        }, "POST");
    },

    /**
     *  Delete assication between role and guide
     */
    destroyMapping : function(roleid, guideid){
        Aero.send("api/rolemap", { guideid: guideid, roleid: roleid}, function(){
            Aero.view.guide.admin.renderMapping('roles');
        }, "DELETE");
    }
};
