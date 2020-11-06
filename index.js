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
  if ((elapsed < duration) && flag != 0)
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
  var currentTime = document.getElementById('clock').innerHTML = new Date().toLocaleTimeString();
  if (currentTime.endsWith('00')) {
    checkTimer();
  }
  setTimeout(startTime, 1000);
}

//Compare the central clock with the table cells clock
function checkTimer() {
  //compare only hour and minutes
  var centerTime = document.getElementById('clock').innerHTML.slice(0, -3);
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
      document.getElementById("imgpcr" + i).src = 'flag.png';
      toggle(element, 2, elapsed);
      element.className = "form-control-plaintext"
      highlightClock(elapsed)
    }
  }
}

//if the number is one-digit - zero wil be added.
function fixDigitsFormat(i) {
  if (i < 10) {
    i = "0" + i
  };
  return i;
}
startTime();

//Parsing the short hour string format.
function dateToString(d) {
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  m = fixDigitsFormat(m);
  s = fixDigitsFormat(s);
  var time = h + ":" + m;
  return time;
}



function setDates(i, numberOfPlates) {
  alreadyInserted.push(i);
  var d = new Date(); // for now
  var newdate = dateToString(d);
  // For One Plate QPCRs
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
    // For Two Plates QPCRs
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


//Create listener for each one table.
for (var i = 1; i <= 8; i++) {
  //Listening on Enter Key press
  document.querySelector('#plateID' + i).addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      //get the number of the table
      var lastdigit = this.id;
      pcrID = lastdigit.slice(-1);
      //change the image logo to 'running' status
      document.getElementById('imgpcr' + pcrID).src = 'running.png';
      //check if there were already an item in this table
      //if yes - reseting the green color of the cell and the image
      const index = alreadyInserted.indexOf(pcrID);
      if (index > -1) {
        document.getElementById("imgpcr" + pcrID).src = 'running.png';
        document.getElementById("OrderAgain" + pcrID).className = "form-control-plaintext"
        toggle(document.getElementById("MixTime" + pcrID), 0, 0);
        document.getElementById("MixTime" + pcrID).className = "form-control-plaintext"
      }
      //Different times for QPCR 1-4 (Two plates) and QPCR 4-8 (One Plate)
      if (pcrID > 0 && pcrID <= 4)
        setDates(pcrID, 2);
      else if (pcrID > 4 && pcrID <= 8)
        setDates(pcrID, 1);
    }
  });
};