document.getElementById('save').onclick = function (e) {
    appAPI.db.set('hostname', document.getElementById('hostname').value);
    appAPI.browserAction.closePopup();
}
