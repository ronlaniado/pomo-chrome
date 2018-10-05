let origWorkMin;
let origWorkSec;
let origBreakMin;
let origBreakSec;
let origTimeArray = {};
let currentMin;
let currentSec;
let timerStatus;
let timerActive = false;
let timer;
let distance;

function startWorkTimer(workMins, breakMins, status) {
	updateOriginals(workMins, breakMins);
	timerStatus = status;
	let workCountDown = new Date(Date.now() + origWorkMin * 60000); //Set to 61000 instead of 60000 to account for the loss of 1 second
	timer = setInterval(() => {
		console.log(distance);
		if (distance <= 1000) {
			clearInterval(timer);
			timerStatus = "BREAK TIME";
			notificationType("BREAK TIME");
			distance = 2000;
			startBreakTimer();
		} else {
			let timeNow = Date.now();
			distance = workCountDown - timeNow;
		}
	}, 1000);
}
function startBreakTimer() {
	let breakCountDown = new Date(Date.now() + origBreakMin * 60000); //Set to 61000 instead of 60000 to account for the loss of 1 second
	timer = setInterval(() => {
		if (distance <= 1000) {
			clearInterval(timer);
			timerStatus = "WORK TIME";
			notificationType("WORK TIME");
			startWorkTimer(origWorkMin, origBreakMin, "WORK TIME");
		} else {
			let timeNow = Date.now();
			distance = breakCountDown - timeNow;
		}
	});
}

function notificationType(status) {
	let time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	let hour = time[1] % 12 || 12; // The prettyprinted hour.
	let period = time[1] < 12 ? "a.m." : "p.m."; // The period of the day.
	if (timerStatus === "BREAK TIME") {
		let audio = new Audio("riff1.wav");
		audio.play();
		new Notification(hour + time[2] + " " + period, {
			//Uses the built-in notification's API
			icon: "pomo.png",
			body: "It's time to take a break! You did it!",
		});
	} else if (timerStatus === "WORK TIME") {
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
function getDistance() {
	return distance;
}
function getStatus() {
	return timerStatus;
}
function updateOriginals(workMins, breakMins) {
	origWorkMin = workMins;
	origBreakMin = breakMins;
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
