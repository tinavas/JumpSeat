document.getElementById('save').onclick = function (e) {
    appAPI.db.set('hostname', document.getElementById('hostname').value);
    appAPI.browserAction.closePopup();
}

document.getElementById('hostname').onkeyup = function(e){
    if (e.keyCode == 13) {
        appAPI.db.set('hostname', document.getElementById('hostname').value);
        appAPI.browserAction.closePopup();
        return false;
    }
}
