"use strict";
var offset = 0;
var settings = {
    chimeMode: 0,
    bgcolor: '#000000',
    oncolor: '#c80000',
    offcolor: '#280000',
    autosync: false
};
var clk;
var shouldChime = function() { return null; };
var onlinesync = onlineSync();

function resizeCanvas() {
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var diameter = Math.min(viewportWidth, viewportHeight);
    var canvasdiameter = 1.00 * diameter;
    var canvas = document.getElementById("clock");
    canvas.setAttribute("width", canvasdiameter);
    canvas.setAttribute("height", canvasdiameter);
}

function optionHandlers(clock) {
    var menu = document.getElementById("menu");
    var menubtn = document.getElementById("menubtn");
    var menupopup = document.getElementById("menupopup");

    menu.onmouseover = function() {
      menubtn.style.visibility = 'visible';
    };
    menu.onmouseout = function() {
      menubtn.style.visibility = 'hidden';
    };
    menu.onmouseover();
    setTimeout(menu.onmouseout, 10000);
    menubtn.onclick = function(ev) {
      menupopup.style.visibility = 'visible';
      ev.stopPropagation();
    };
    window.addEventListener('click', function() {
      menupopup.style.visibility = 'hidden';
    });
    menupopup.onclick = function(ev) {
        ev.stopPropagation();
    };
    var oncolor = document.getElementById("oncolor");
    oncolor.value = settings.oncolor;
    clock.led_on = oncolor.value;
    oncolor.oninput = function() {
        settings.oncolor = oncolor.value;
        clock.led_on = oncolor.value;
        chrome.storage.sync.set({oncolor: oncolor.value});
    };
    var offcolor = document.getElementById("offcolor");
    offcolor.value = settings.offcolor;
    clock.led_off = offcolor.value;
    offcolor.oninput = function() {
        settings.offcolor = offcolor.value;
        clock.led_off = offcolor.value;
        chrome.storage.sync.set({offcolor: offcolor.value});
    };
    var bgcolor = document.getElementById("bgcolor");
    bgcolor.value = settings.bgcolor;
    clock.background = bgcolor.value;
    bgcolor.oninput = function() {
        settings.bgcolor = bgcolor.value;
        clock.background = bgcolor.value;
        chrome.storage.sync.set({bgcolor: bgcolor.value});
    };
    var autosync = document.getElementById("autosync");
    autosync.checked = settings.autosync;
    onlinesync(autosync.checked);
    autosync.onchange = function() {
        settings.autosync = autosync.checked;
        onlinesync(autosync.checked);
        chrome.storage.sync.set({autosync: autosync.checked});
    };
    var reset = document.getElementById("reset");
    reset.onclick = function() {
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

function update() {
    var localnow = new Date().getTime();
    clk.time = new Date(localnow + offset);
    var ms = clk.time.getMilliseconds();
    setTimeout(update, 1000 - ms);
    var ch = shouldChime(clk.time);
    if (ch !== null ) {
      var to = (ms<900)? (900 - ms):0;
      setTimeout(function (){ch.play();}, to);
    }
    document.body.style.background = clk.background;
    clk.draw();
}

window.addEventListener('resize', function() {
    resizeCanvas();
    if (typeof clk !== "undefined") {
        clk.draw();
    }
});

window.addEventListener('load', function() {
    var i;
    var canvas = document.getElementById("clock");
    resizeCanvas();
    clk = new LEDclock(canvas.getContext("2d"));
    chrome.storage.sync.get(settings, function(items) {
        for (i in items) {
            settings[i] = items[i];
        }
        shouldChime = chimerSetup(settings.chimeMode);
        optionHandlers(clk);
        update();
    });
});
