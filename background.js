var blocking= false;
var voice= [ "You could use a break", "Hey, there is a park close by, maybe you should go for a walk", "It is 50 degrees and sunny"]
var rand= voice[Math.floor(Math.random()*voice.length)];

chrome.idle.setDetectionInterval(600);


function createAlarm() {
    console.log('creating alarm');
    chrome.alarms.create("startState", {delayInMinutes:1});
}

function talk(){
  chrome.tts.speak(rand, {
  lang:'en-US',
  gender:'female'});
console.log("hello")
}

function clearAlarm() {
    console.log('clearing alarm');
    chrome.alarms.clear("startState");
}

function activeAlarmWentOff() {

    //add speaking and geolocation code
    startBlocking();
    talk();

    chrome.alarms.create("endState", {delayInMinutes:5});
}

function startBlocking() {
    blocking = true;
}

function stopBlocking() {
    blocking = false;
}

function blockingTimeoutAlarmWentOff() {
    stopBlocking();
}

chrome.alarms.onAlarm.addListener(function(alarm){
    console.log("alarm went off, named:",alarm.name);
    if (alarm.name === "startState") {
      activeAlarmWentOff();
    }
    else {
      blockingTimeoutAlarmWentOff();
    }
});

chrome.idle.onStateChanged.addListener(
    function (state) {
        console.log('state changed to:',state);

        if (state === "active") {
            console.log("hello");
            createAlarm();
        } else {
            clearAlarm();
        }
    }
);



function callback(details) {
  var method = details.method;
  var type = details.type;
  var url = details.url;
 //console.log(method, type, url);


  if(blocking) {
    return { cancel: true };
  }

}

var filter = {
  urls: ['<all_urls>']
};

var extraInfo = ['blocking'];

chrome.webRequest.onBeforeRequest.addListener(
  callback, filter, extraInfo);

