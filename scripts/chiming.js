function Chiming(mode) {
    this.mode = mode;
    var that = this;
    var beep1 = new Audio();
    var beep5 = new Audio();
    var chiming = document.getElementById("chiming");
    var chimebtn = document.getElementById("chimebtn");
    var chimesetup = document.getElementById("chimesetup");

    function shouldChime(date) {
      if (date.getSeconds() < 56 || that.mode == 0) return null;
      chimer = (date.getSeconds() == 59)?beep5:beep1;
      switch(that.mode) {
        case 0:
          return null;
        case 1:
          return (date.getMinutes() == 59)?chimer:null;
        case 2:
          return ((date.getMinutes()%30) == 29)?chimer:null;
        case 3:
          return ((date.getMinutes()%15) == 14)?chimer:null;
        case 4:
          return chimer;
      }
    }
    this.shouldChime = shouldChime;

    function setChimeMode(mode) {
      var chimeMode = Number(mode);
      for (var i=0; i<5; i++) {
        var cm = document.getElementById("chimeMode"+i);
        cm.style.fontWeight = (i==chimeMode)?"bold":"normal";
        cm.style.backgroundColor = (i==chimeMode)?"rgb(80, 40, 40)":"rgb(40, 40, 40)";
      }
      that.mode = chimeMode;
      chrome.storage.sync.set({'chimeMode': chimeMode});
    }
    this.setChimeMode = setChimeMode;

    beep1.src = "/assets/beep1.ogg";
    beep1.load();
    beep5.src = "/assets/beep5.ogg";
    beep5.load();
    chiming.onmouseover = function() {
      chimebtn.style.visibility = 'visible';
    }
    chiming.onmouseout = function() {
      chimebtn.style.visibility = 'hidden';
    }
    chiming.onmouseover();
    setTimeout(chiming.onmouseout, 10000);
    chimebtn.onclick = function(ev) {
      chimesetup.style.visibility = 'visible';
      ev.stopPropagation();
    }
    window.addEventListener('click', function() {
      chimesetup.style.visibility = 'hidden';
    });
    for (var i=0; i<5; i++) {
      (function(n){
          var handler = function() { setChimeMode(n); };
          document.getElementById("chimeMode"+n).onclick = handler;
      })(i);
    }
    //Initialize chiming buttons
    setChimeMode(this.mode);

}
