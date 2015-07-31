var PAGE = {

    id : "556fc539fe3c10c4130041a8",
    url : "api/pages",

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
            "featureid" : this.id,
            "title": "Step 1",
            "desc" : "Some description"
        };

        Aero.send(this.url, data, function(r){
            self.id = r;
            console.log(r);
        }, "POST");

    },

    put : function(){
        var data = {
            id : this.id,
            pages : [{ "title" : "one", "desc" : "hello" }]
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
