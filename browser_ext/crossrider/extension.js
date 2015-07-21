appAPI.ready(function($) {
    appAPI.message.addListener(function(msg) {
        if (msg.request == 'save-hostname') {
            appAPI.dom.addRemoteJS({
                url: msg.hostname + '/aerospace',
                additionalAttributes: {charset: "UTF-8"},
                callback: function() {
                }
            });
        }
    });
});