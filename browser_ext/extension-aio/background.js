appAPI.ready(function() {

    var options = {
        CH: {height: 155, width: 210},
        FF: {height: 155, width: 210},
        IE: {height: 160, width: 210},
        SF: {height: 155, width: 210}
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
});
