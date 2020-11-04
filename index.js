finishArray = [];
alreadyInserted = [];

var interval = 250;
var durationMix = 300000;
var durationOrder = 5000;

//Blink When Mix is Ready
function toggle(element, flag, elapsed) {
  var eclass = element.className
  if (eclass == "form-control-plaintext") {
    element.className = "form-control-plaintext" + " highlight" + flag;
  } else {
    element.className = "form-control-plaintext"
  }
  elapsed += interval;
  duration = durationOrder
  if (flag == 1) {
    duration = durationMix;
  }
  if (elapsed < duration)
    setTimeout(function () {
      toggle(element, flag, elapsed);
    }, interval);
}


//Blink when Order Again is Ready
function highlightClock(elapsed) {
  if (document.getElementById('clock').style.color == 'green') {
    document.getElementById('clock').style.color = 'black';
  } else {
    document.getElementById('clock').style.color = 'green';
  }
  elapsed += interval;
  if (elapsed < durationOrder)
    setTimeout(function () {
      highlightClock(elapsed);
    }, interval);
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 1000);
  var centerTime = document.getElementById('clock').innerHTML;
  for (var i = 1; i <= 8; i++) {
    var mixTime = document.getElementById('MixTime' + i).value;
    if (mixTime === centerTime) {
      var elapsed = 0;
      var audio = new Audio('MixReady.mp3');
      audio.play();
      var element = document.getElementById('MixTime' + i);
      toggle(element, 1, elapsed);
      $(".MixTime" + i).removeClass("highlight1")

    }
  }
  // Finished Plates - Blink and Show Name near clock
  for (var i = 1; i <= 8; i++) {
    var element = document.getElementById('OrderAgain' + i);
    var orderAgainTime = element.value;
    if (orderAgainTime === centerTime) {
      var elapsed = 0;
      finishArray.push(createFinishString(i));
      //displayFinishString();
      document.getElementById("imgpcr"+i).src = 'flag.png';
      toggle(element, 2, elapsed);
      element.className = "form-control-plaintext"
      highlightClock(elapsed)
    }
  }
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  };
  return i;
}
startTime();

function dateToString(d) {
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  var time = h + ":" + m + ":" + s;
  return time;
}



function setDates(i, numberOfPlates) {
  alreadyInserted.push(i);
  var d = new Date(); // for now
  var newdate = dateToString(d);
  if (numberOfPlates == 1) {
    //Start Time
    document.querySelector('#startTime' + i).value = newdate;
    // Mix Time 
    var newDateObj = moment(d).add(30, 'm').toDate();
    var newdate = dateToString(newDateObj);
    document.querySelector('#MixTime' + i).value = newdate;
    // Start QPCR Time
    var startpcr = moment(d).add(52, 'm').toDate();
    newdate = dateToString(startpcr);
    document.querySelector('#StartQPCR' + i).value = newdate;
    // End QPCR Time
    var newDateObj = moment(startpcr).add(95, 'm').toDate();
    newdate = dateToString(newDateObj);
    document.querySelector('#ENDQPCR' + i).value = newdate;
    // Order Again
    var newDateObj = moment(startpcr).add(40, 'm').toDate();
    newdate = dateToString(newDateObj);
    document.querySelector('#OrderAgain' + i).value = newdate;
  } else if (numberOfPlates == 2) {
    //Start Time
    document.querySelector('#startTime' + i).value = newdate;
    // Mix Time 
    var newDateObj = moment(d).add(40, 'm').toDate();
    var newdate = dateToString(newDateObj);
    document.querySelector('#MixTime' + i).value = newdate;
    // Start QPCR Time
    var startpcr = moment(d).add(72, 'm').toDate();
    newdate = dateToString(startpcr);
    document.querySelector('#StartQPCR' + i).value = newdate;
    // End QPCR Time
    var newDateObj = moment(startpcr).add(95, 'm').toDate();
    newdate = dateToString(newDateObj);
    document.querySelector('#ENDQPCR' + i).value = newdate;
    // Order Again
    var newDateObj = moment(startpcr).add(25, 'm').toDate();
    newdate = dateToString(newDateObj);
    document.querySelector('#OrderAgain' + i).value = newdate;
  }
}


for (var i = 1; i <= 8; i++) {
  document.querySelector('#plateID' + i).addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        var lastdigit = this.id;
        pcrID=lastdigit.slice(-1);
        document.getElementById('imgpcr'+pcrID).src = 'running.png';
          const index = alreadyInserted.indexOf(pcrID);
          if (index > -1) {
            finishArray.splice(index, 1);
            removeImage(createFinishString(pcrID))
            document.getElementById("OrderAgain" + pcrID).className = "form-control-plaintext"
          }
          if (pcrID > 0 && pcrID <= 4)
            setDates(pcrID, 2);
          else if (pcrID > 4 && pcrID <= 8)
            setDates(pcrID, 1);
        }
      });
  };

  function createFinishString(index) {
    return "imgpcr" + index;
  }

  function displayFinishString() {
    for (i = 0; i < finishArray.length; i++) {
      document.getElementById(finishArray[i]).className = "displayimage";
    }
  }

  function removeImage(element) {
    document.getElementById(element).src = 'running.png';

  }