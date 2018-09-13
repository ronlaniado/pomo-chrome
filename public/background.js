let currentSec;
let currentMin;
let currentTimeSeperator;
let origSec;
let origMin;
let timerStatus = false;
let timer;
let timeStatus;
function startTimer(sec, min, timeSeperator, status) {
	//The below if statement is the reason that the timer start with one second less. This should be fixed in the future. Its purpose is to make the timer have less of a delay.
	/*if (sec > 0) {
		sec--;
	} else {
		min--;
		sec = 59;
	}*/
	timerStatus = status;
	origMin = min;
	origSec = sec;
	timer = setInterval(() => {
		timerStatus = true;
		updateGlobals(sec, min, timeSeperator);
		console.log('background.js: ' + currentMin + timeSeperator + currentSec);
		if (currentMin === 0 && currentSec === 60) {
			console.log('The timer will end now...');
			notificationType(status);
			notifyBreak();
			sec = -1;
			min = -1;
			timerStatus = false;
			clearInterval(timer);
		} else if (sec >= 0 && sec != 60) {
			if (sec < 11) {
				if (sec <= 1) {
					sec = 60;
				} else {
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
		} else {
			clearInterval(timer);
			timerStatus = false;
		}
	}, 1000);
}

function notifyBreak() {
}



function notificationType(status) {
	let time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	let hour = time[1] % 12 || 12; // The prettyprinted hour.
	let period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
	if (status === 'WORK TIME') {
		let audio = new Audio('riff1.wav');
		audio.play();
		new Notification(hour + time[2] + ' ' + period, {	//Uses the built-in notification's API
		icon: 'pomo.png',
		body: "It's time to take a break! You did it!"
		});
	} else if (status === 'BREAK TIME') {
		let audio = new Audio('riff2.wav');
		audio.play();
		new Notification(hour + time[2] + ' ' + period, {	//Uses the built-in notification's API
		icon: 'pomo.png',
		body: "Your Break is over, start working again!"
		});	
	}
}

/*chrome.runtime.onInstalled.addListener(function () {
	chrome.runtime.openOptionsPage();
});
*/

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
	currentTimeSeperator = ':';
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
	if (timerStatus) {
		console.log(timer);
		return true;
	} else {
		return false;
	}
}
function isActiveFalse() {
	timerStatus = false;
}
function isActiveTrue() {
	timerStatus = true;
}
