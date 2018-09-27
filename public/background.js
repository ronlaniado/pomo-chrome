let origWorkMin;
let origWorkSec;
let origBreakMin;
let origBreakSec;
let origTimeArray = {};
let currentWorkMins;
let currentWorkSecs;
let currentBreakMins;
let currentBreakSecs;
let currentStatus;
let currentMin;
let currentSec;
let timerActive = false;
let timer;

//Code in ability to save original values. The make the timer reset button get those original values

function startTimer(workMins, workSecs, breakMins, breakSecs, status) {
	currentWorkMins = workMins;
	currentWorkSecs = workSecs;
	currentBreakMins = breakMins;
	currentBreakSecs = breakSecs;
	updateOriginals(
		currentWorkMins,
		currentWorkSecs,
		currentBreakMins,
		currentBreakSecs
	);
	//The below if statement is the reason that the timer start with one second less. This should be fixed in the future. Its purpose is to make the timer have less of a delay.
	if (currentWorkSecs > 0) {
		currentWorkSecs--;
	} else {
		currentWorkMins--;
		currentWorkSecs = 59;
	}
	timer = setInterval(() => {
		timerActive = true;
		if (status === "WORK TIME") {
			updateCurrents(currentWorkMins, currentBreakSecs, "WORK TIME");
			console.log(
				"background.js: " + currentWorkMins + ":" + currentWorkSecs
			);
			if (currentWorkMins === 0 && currentWorkSecs === 60) {
				console.log("The timer will end now...");
				notificationType(status);
				notifyBreak();
				clearInterval(timer);
				startTimer(
					origWorkMin,
					origWorkSec,
					origBreakMin,
					origBreakSec,
					"BREAK TIME"
				);
				//MAKE TIMER KEEP GOING HERE
			} else if (currentWorkSecs >= 0 && currentWorkSecs != 60) {
				if (currentWorkSecs < 11) {
					if (currentWorkSecs <= 1) {
						currentWorkSecs = 60;
					} else {
						currentWorkSecs--;
					}
				} else {
					if (currentWorkSecs === 60) {
						currentWorkMins--;
					}
					currentWorkSecs--;
				}
			} else if (currentWorkMins > 0) {
				currentWorkMins--;
				currentWorkSecs = 59;
			} else {
				clearInterval(timer);
				startTimer(
					origWorkMin,
					origWorkSec,
					origBreakMin,
					origBreakSec,
					"BREAK TIME"
				);
			}
		} else if (status === "BREAK TIME") {
			updateCurrents(currentBreakMins, currentBreakSecs, "BREAK TIME");
			console.log(
				"background.js: " + currentBreakMins + ":" + currentBreakSecs
			);
			if (currentBreakMins === 0 && currentBreakSecs === 60) {
				console.log("The timer will end now...");
				notificationType(status);
				notifyBreak();
				clearInterval(timer);
				startTimer(
					origWorkMin,
					origWorkSec,
					origBreakMin,
					origBreakSec,
					"WORK TIME"
				);
				//MAKE TIMER KEEP GOING HERE
			} else if (currentBreakSecs >= 0 && currentBreakSecs != 60) {
				if (currentBreakSecs < 11) {
					if (currentBreakSecs <= 1) {
						currentBreakSecs = 60;
					} else {
						currentBreakSecs--;
					}
				} else {
					if (currentBreakSecs === 60) {
						currentBreakMins--;
					}
					currentBreakSecs--;
				}
			} else if (currentBreakMins > 0) {
				currentBreakMins--;
				currentBreakSecs = 59;
			} else {
				clearInterval(timer);
				startTimer(
					origWorkMin,
					origWorkSec,
					origBreakMin,
					origBreakSec,
					"WORK TIME"
				);
			}
		} else {
			//If the status is messed up for some reason, the timer stops and logs an error
			console.log("Error: status is " + status);
			clearInterval(timer);
		}
	}, 1000);
}

function notificationType(status) {
	let time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	let hour = time[1] % 12 || 12; // The prettyprinted hour.
	let period = time[1] < 12 ? "a.m." : "p.m."; // The period of the day.
	if (status === "WORK TIME") {
		let audio = new Audio("riff1.wav");
		audio.play();
		new Notification(hour + time[2] + " " + period, {
			//Uses the built-in notification's API
			icon: "pomo.png",
			body: "It's time to take a break! You did it!",
		});
	} else if (status === "BREAK TIME") {
		let audio = new Audio("riff2.wav");
		audio.play();
		new Notification(hour + time[2] + " " + period, {
			//Uses the built-in notification's API
			icon: "pomo.png",
			body: "Your Break is over, start working again!",
		});
	}
}

chrome.runtime.onInstalled.addListener(function() {
	chrome.runtime.openOptionsPage();
});

function getMinutes() {
	return currentMin;
}
function getSeconds() {
	return currentSec;
}
function getStatus() {
	return currentStatus;
}

function updateCurrents(localSec, localMin, localStatus) {
	currentSec = localSec;
	currentMin = localMin;
	currentStatus = localStatus;
}
function updateOriginals(workMins, workSecs, breakMins, breakSecs) {
	origWorkMin = workMins;
	origWorkSec = workSecs;
	origBreakMin = breakMins;
	origBreakSec = breakSecs;
}
function getOriginals() {
	origTimeArray = {
		workMins: origWorkMin,
		workSecs: origWorkSec,
		breakMins: origBreakMin,
		breakSecs: origBreakSec,
	};
}
function resetGlobals() {
	currentWorkMins = origWorkMin;
	currentWorkSecs = origWorkSec;
	currentBreakMins = origBreakMin;
	currentBreakSecs = origBreakSec;
}
function clearTimer() {
	clearInterval(timer);
}

function isActive() {
	if (timerActive) {
		console.log(timer);
		return true;
	} else {
		return false;
	}
}
function isActiveFalse() {
	timerActive = false;
}
function isActiveTrue() {
	timerActive = true;
}
function getCurrentWorkMins() {
	return currentWorkMins;
}
function getCurrentWorkSecs() {
	return currentWorkSecs;
}
function getCurrentBreakMins() {
	return currentBreakMins;
}
function getCurrentBreakSec() {
	return currentBreakSecs;
}