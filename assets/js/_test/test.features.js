var FEATURE = {

    id : "",
    url : "api/features",

    get : function(id){
        var self = this;
        var data = {};
        if(id) data = { id : id };

        Aero.send(this.url, data, function(r){
            if(id) self.id = r[0]['id'];
            console.log(r);
        }, "GET");
    },

    post : function(){
        var self = this;
        var data = {
            "title": "Pathway 1",
            "description" : "Some description"
        };

        Aero.send(this.url, data, function(r){
            self.id = r;
            console.log(r);
        }, "POST");

    },

    put : function(){
        var data = {
            id : this.id,
            title: "Pathway Updated"
        };

        Aero.send(this.url, data, function(r){
            console.log(r);
        }, "PUT");

    },

    del : function(){
        Aero.send(this.url, { id : this.id}, function(r){
            console.log(r);
        }, "DELETE");
    }
};
