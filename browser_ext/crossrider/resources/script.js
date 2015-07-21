function crossriderMain($) {
    function saveHostname() {
        var input = document.getElementById('hostname');
        var hostname = input.val();

        appAPI.message.toAllTabs({ 'request' : 'save-hostname', 'hostname' : hostname });
    }

    var btn = document.getElementById('save');
    btn.addEventListener('click', saveHostname);

}