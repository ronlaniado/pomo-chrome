let currentSec;
let currentMin;
let currentTimeSeperator;
let origSec;
let origMin;
let timer = false;

function startTimer(sec, min, timeSeperator) {
	// chrome.storage.sync.get(['workTime'], function(result){
	// 	origMin = Number(result.workTime);
	// 	console.log(origMin);
	// 	origSec = sec;
	// 	min = origMin;
	// });
	origMin = min;
	origSec = sec;
	timer = setInterval(() => {
		console.log(origMin - 1);
		updateGlobals(sec, min, timeSeperator);
		console.log("background.js: " + currentMin + timeSeperator + currentSec);
		if (sec >= 0) {
			if (sec < 11) {
				if (sec === 1) {
					sec = 60;
					timeSeperator = ":";
				} else {
					timeSeperator = ":0";
					sec--;
				}
			} else {
				if (sec === 60) {
					min--;
				}
				sec--;
			}
		} else if (min > 0) {
			min--;
			sec = 59;
			timeSeperator = ":";
		}
		if (min === 0 && sec < 0) {
			clearInterval(timer);
			timer = false;
			notifyBreak();
			audioBreak();
		}
	}, 1000);
}

function notifyBreak() {
	let time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	let hour = time[1] % 12 || 12; // The prettyprinted hour.
	let period = time[1] < 12 ? "a.m." : "p.m."; // The period of the day.
	new Notification(hour + time[2] + " " + period, {
		icon: "pomo.png",
		body: "It's time to take a break! You did it!"
	});
}

function getMinutes() {
	return currentMin;
}
function getSeconds() {
	return currentSec;
}
function getTimeSeperator() {
	return currentTimeSeperator;
}
function updateGlobals(sec, min, timeSeperator) {
	currentSec = sec;
	currentMin = min;
	currentTimeSeperator = timeSeperator;
}
function resetGlobals() {
	currentSec = origSec;
	currentMin = origMin;
	currentTimeSeperator = ":";
}
function clearTimer() {
	clearInterval(timer);
}
function getOrigMinutes() {
	return origMin;
}
function getOrigSeconds() {
	return origSec;
}

function isActive() {
	if (timer) {
		console.log(timer);
		return true;
	} else {
		return false;
	}
}
function isActiveFalse() {
	timer = false;
}
function audioBreak() {
	let audio = new Audio("timerDone.wav");
	audio.play();
}
