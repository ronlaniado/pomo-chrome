function startTimer(sec, min, timeSeperator) {
	const timer = setInterval(() => {
		console.log(
			"The background.js page says that the time is: " +
				min +
				timeSeperator +
				sec
		);
		if (sec > 0) {
			if (sec < 11) {
				timeSeperator = ":0";
				sec--;
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
		if (min === 0 && sec === 0) {
			clearInterval(timer);
		}
	}, 1000);
}

function show() {
	let time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	let hour = time[1] % 12 || 12; // The prettyprinted hour.
	let period = time[1] < 12 ? "a.m." : "p.m."; // The period of the day.
	new Notification(hour + time[2] + " " + period, {
		icon: "pomo.png",
		body: "It's time to take a break! You did it!"
	});
}

function getMinutes() {
	return min;
}
function getSeconds() {
	return sec;
}
function getTimeSeperator() {
	return timeSeperator;
}
