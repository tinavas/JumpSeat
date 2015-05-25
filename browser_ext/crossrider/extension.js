appAPI.ready(function($) {
    appAPI.dom.addRemoteJS({
        url: "https://aero.local/aerospace",
        additionalAttributes: {charset: "UTF-8"},
        callback: function() {
        }
    });
});