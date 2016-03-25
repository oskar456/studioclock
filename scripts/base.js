offset = 0;
settings = {
    chimeMode: 0,
    bgcolor: '#000000',
    oncolor: '#c80000',
    offcolor: '#280000',
    autosync: true,
};

function resizeCanvas() {
  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;
  var diameter = Math.min(viewportWidth, viewportHeight);
  var canvasdiameter = 1.00 * diameter;
  var canvas = document.getElementById("clock");
  canvas.setAttribute("width", canvasdiameter);
  canvas.setAttribute("height", canvasdiameter);
}


onlinesync = (function() {
    var synctimer;

    function timesync(callback) {
          var xmlhttp = new XMLHttpRequest();
          var localEpoch1, localEpoch2, serverEpoch, success;
          xmlhttp.open("GET", "https://time.doesnotwork.eu/fcgi/date");
          xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  localEpoch2 = new Date().getTime();
                  serverEpoch = 1000 * Number(xmlhttp.responseText);
                  success = isFinite(serverEpoch);
                  if (success) {
                    offset = serverEpoch - localEpoch1 - (localEpoch2-localEpoch1)/2;
                  }
                  if (typeof callback === 'function') {
                    callback(success);
                  }
              }
          };
          localEpoch1 = new Date().getTime();
          xmlhttp.send();
    }
    window['timesync'] = timesync;

    function dosync() {
        // repeat twice for better accurancy
        timesync(function(){
            timesync(function(success){
                document.getElementById('offset').innerHTML =
                    offset.toLocaleString();
                document.getElementById('syncstatus').innerHTML =
                    success?"success":"failure";
            });
        });
    }

    function onlinesync(enable) {
        if (enable) {
            dosync();
            synctimer = setInterval(dosync, 3600000);
        } else {
            clearInterval(synctimer);
            offset = 0;
            document.getElementById('offset').innerHTML =
                offset.toLocaleString();
        }
    }
    return onlinesync;
})();



function update(domdata) {
    var localnow = new Date().getTime();
    clk.time = new Date(localnow + offset);
    var ms = clk.time.getMilliseconds();
    setTimeout(update, 1000 - ms);
    var ch = chim.shouldChime(clk.time)
    if (ch !== null ) {
      var to = (ms<900)? (900 - ms):0;
      setTimeout(function (){ch.play();}, to);
    }
    document.body.style.background = clk.background;
    clk.draw();
}

window.onresize = function() {
  resizeCanvas();
  if (typeof clk !== "undefined") clk.draw();
}

window.onload = function() {
  var canvas = document.getElementById("clock");
  resizeCanvas();
  clk = new LEDclock(canvas.getContext("2d"));
  chrome.storage.sync.get(settings, function(items) {
      for (i in items) {
          settings[i] = items[i];
      }
      chim = new Chiming(settings.chimeMode);
      opts = new Options(clk);
      update();
  });
}
