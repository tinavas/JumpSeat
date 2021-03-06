appAPI.ready(function() {

    var options = {
        CH: {height: 155, width: 210},
        FF: {height: 200, width: 210},
        IE: {height: 190, width: 250},
        SF: {height: 190, width: 210}
    };

    // Sets the badge text and background color
    appAPI.browserAction.setResourceIcon('images/icon.png');

    if ("CHFFIESF".indexOf(appAPI.platform) !== -1) {
        appAPI.browserAction.setPopup({
            resourcePath: 'popup.html',
            height: options[appAPI.platform].height,
            width: options[appAPI.platform].width
        });
    }
    else {
        alert('This extension is not supported on your browser');
    }

    appAPI.contextMenu.add("key1", "Add Step (only for active guides)", function (data) {
        appAPI.message.toActiveTab({type:'dataToSend', data: {}});
    }, ["all"]);
});
