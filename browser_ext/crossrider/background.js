appAPI.ready(function() {
    var popupDims = {
        CH: {height: 55, width: 110},
        FF: {height: 55, width: 110},
        IE: {height: 60, width: 110},
        SF: {height: 55, width: 110}
    };
    // Sets the badge text and background color
    appAPI.browserAction.setResourceIcon('JumpSeat-32px.png');

    if ("CHFFIESF".indexOf(appAPI.platform) !== -1) {
        appAPI.browserAction.setPopup({
            resourcePath: 'popup.html',
            height: popupDims[appAPI.platform].height,
            width: popupDims[appAPI.platform].width
        });
    }
    else {
        alert('This extension is not supported on your browser');
    }
});