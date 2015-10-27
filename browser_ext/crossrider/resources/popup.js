function crossriderMain($) {
    function saveHostname() {
        var input = document.getElementById('hostname');
        var hostname = input.val();

        //appAPI.message.toBackground({ 'request' : 'save-hostname', 'hostname' : hostname });
        console.log('Saving: ' + { 'hostname' : hostname });
        debugger;
        appAPI.db.set({ 'hostname' : hostname });
    }

    alert(23);
    var btn = document.getElementById('save');
    btn.addEventListener('click', saveHostname);

}