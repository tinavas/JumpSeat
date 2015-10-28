appAPI.ready(function($) {

//    appAPI.db.set('hostname', 'hello');

    var hostname = appAPI.db.get('hostname');

    appAPI.dom.addRemoteJS({
        url: hostname + '/aerospace',
        additionalAttributes: { charset: "UTF-8" },
        callback: function() {
        }
    });
});
