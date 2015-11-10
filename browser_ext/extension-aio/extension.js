appAPI.ready(function($) {

    var hostname = appAPI.db.get('hostname');

    appAPI.dom.addRemoteJS({
        url: hostname + '/aerospace',
        additionalAttributes: { charset: "UTF-8" },
        callback: function() {
        }
    });

    appAPI.message.addListener(function(msg) {
        if (msg.type === 'dataToSend') {
            appAPI.dom.addInlineJS({
                js: "if(Aero.tip._guide) Aero.view.step.admin.initPicker();",
                additionalAttributes: {charset: "UTF-8"}
            });
        }
    });
});
