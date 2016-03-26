function onlineSync() {
    var synctimer = null;

    function timesync(callback) {
          var xhr = new XMLHttpRequest();
          var localEpoch1, localEpoch2, serverEpoch, success;
          xhr.open("GET", "https://time.doesnotwork.eu/fcgi/date");
          xhr.onreadystatechange = function() {
              if (xhr.readyState != 4) {
                  return;
              }
              success = false;
              if (xhr.status == 200) {
                  localEpoch2 = new Date().getTime();
                  serverEpoch = 1000 * Number(xhr.responseText);
                  success = isFinite(serverEpoch);
              }
              if (success) {
                offset = serverEpoch - localEpoch1 - (localEpoch2-localEpoch1)/2;
              }
              if (typeof callback === 'function') {
                callback(success);
              }
          };
          localEpoch1 = new Date().getTime();
          xhr.send();
    }
    window.timesync = timesync;

    function dosync() {
        console.log("Syncing...");
        // repeat twice for better accurancy
        timesync(function(){
            timesync(function(success){
                document.getElementById('offset').innerHTML =
                    offset.toLocaleString();
                document.getElementById('syncstatus').innerHTML =
                    success?"success":"failure";
                console.log("Sync "+(success?"success":"failure")+", offset "+offset+" ms");
                //repeat every hour on success, 5 minutes on failure
                if (synctimer === null) {
                    console.log("setting timer");
                    synctimer = setTimeout(function() {
                        synctimer = null;
                        dosync();
                    }, success?3600000:300000);
                }
            });
        });
    }
    window.dosync = dosync;

    function onlineEventHandler(event) {
        console.log("Online - syncing in 5 seconds");
        if (synctimer !== null) {
            clearTimeout(synctimer);
        }
        synctimer = setTimeout(function() {
            synctimer = null;
            dosync();
        }, 5000);
    }

    function onlinesync(enable) {
        if (enable) {
            window.addEventListener("online", onlineEventHandler);
            if (navigator.onLine) {
                dosync();
            }
        } else {
            window.removeEventListener("online", onlineEventHandler);
            clearTimeout(synctimer);
            synctimer = null;
            offset = 0;
            document.getElementById('offset').innerHTML =
                offset.toLocaleString();
        }
    }
    return onlinesync;
}
