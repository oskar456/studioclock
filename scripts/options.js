function Options(clock) {
    this.clock = clock;
    var that = this;
    var menu = document.getElementById("menu");
    var menubtn = document.getElementById("menubtn");
    var menupopup = document.getElementById("menupopup");

    menu.onmouseover = function() {
      menubtn.style.visibility = 'visible';
    }
    menu.onmouseout = function() {
      menubtn.style.visibility = 'hidden';
    }
    menu.onmouseover();
    setTimeout(menu.onmouseout, 10000);
    menubtn.onclick = function(ev) {
      menupopup.style.visibility = 'visible';
      ev.stopPropagation();
    }
    window.addEventListener('click', function() {
      menupopup.style.visibility = 'hidden';
    });
    menupopup.onclick = function(event) {
        event.stopPropagation();
    };
    var oncolor = document.getElementById("oncolor");
    oncolor.value = settings.oncolor;
    clock.led_on = oncolor.value;
    oncolor.onchange = function(event) {
        settings.oncolor = oncolor.value;
        clock.led_on = oncolor.value;
        chrome.storage.sync.set({oncolor: oncolor.value});
    };
    var offcolor = document.getElementById("offcolor");
    offcolor.value = settings.offcolor;
    clock.led_off = offcolor.value;
    offcolor.onchange = function(event) {
        settings.offcolor = offcolor.value;
        clock.led_off = offcolor.value;
        chrome.storage.sync.set({offcolor: offcolor.value});
    };
    var bgcolor = document.getElementById("bgcolor");
    bgcolor.value = settings.bgcolor;
    clock.background = bgcolor.value;
    bgcolor.onchange = function(event) {
        settings.bgcolor = bgcolor.value;
        clock.background = bgcolor.value;
        chrome.storage.sync.set({bgcolor: bgcolor.value});
    };
    var autosync = document.getElementById("autosync");
    autosync.checked = settings.autosync;
    onlinesync(autosync.checked);
    autosync.onchange = function(event) {
        settings.autosync = autosync.checked;
        onlinesync(autosync.checked);
        chrome.storage.sync.set({autosync: autosync.checked});
    };
    var reset = document.getElementById("reset");
    reset.onclick = function(event) {
        settings.bgcolor = '#000000';
        settings.oncolor = '#c80000';
        settings.offcolor = '#280000';
        oncolor.value = settings.oncolor;
        offcolor.value = settings.offcolor;
        bgcolor.value = settings.bgcolor;
        clock.led_on = oncolor.value;
        clock.led_off = offcolor.value;
        clock.background = bgcolor.value;
        chrome.storage.sync.set(settings);
    };

}
