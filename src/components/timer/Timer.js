/*global chrome*/
import React from "react";
import Bulma from "reactbulma";
import "./timer.css";

export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentMin: 2,
			currentSec: 60,
			timerActive: false,
			timeSeperator: ":",
			motivationalMessage: "",
			disabled: "" //This sets the Start Timer button to be disabled
		};
		this.startTimer = this.startTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
		this.motivate = this.motivate.bind(this);
		this.refreshDisplay = this.refreshDisplay.bind(this);
		this.bgpage = chrome.extension.getBackgroundPage();
	}
	startTimer() {
		const currentComponent = this;
		this.origSec = this.state.currentSec; //The orignal amount of seconds, before the timer started
		this.origMin = this.state.currentMin; //The original amount of minutes, before the timer started
		this.setState({
			timerActive: true
		});
		this.bgpage.startTimer(
			this.state.currentSec,
			this.state.currentMin,
			this.state.timeSeperator
		);
		this.refreshDisplay();
		this.motivate();
	}
	resetTimer() {
		clearInterval(this.timer);
		this.setState({
			timerActive: false,
			currentMin: this.origMin,
			currentSec: this.origSec,
			timeSeperator: ":"
		});
		this.setState({ motivationalMessage: "" });
	}
	motivate() {
		const keepWorking = [
			"Keep working, you can do it!",
			"Almost there!",
			"Just..a bit..longer.."
		];
		const takeBreak = ["Take a break, you've earned it!", "Time to relax!"];
		if (this.state.currentMin === 0 && this.state.currentSec === 0) {
			this.setState({
				motivationalMessage:
					takeBreak[Math.floor(Math.random() * takeBreak.length)]
			});
		} else {
			this.setState({
				motivationalMessage:
					keepWorking[Math.floor(Math.random() * keepWorking.length)]
			});
		}
	}
	refreshDisplay() {
		let localTimer = setInterval(() => {
			let min = this.bgpage.getMinutes();
			let sec = this.bgpage.getSeconds();
			let timeSeperator = this.bgpage.getTimeSeperator();
			console.log(min + timeSeperator + sec);
			this.setState({
				currentMin: min,
				currentSec: sec,
				timeSeperator: timeSeperator
			});
		}, 1000);
	}
	render() {
		return (
			<div className="timer">
				<h2 className="is-centered">
					{this.state.currentMin}
					{this.state.timeSeperator}
					{this.state.currentSec === 60
						? "00"
						: this.state.currentSec}
				</h2>
				<div className="buttons is-centered">
					<button
						className="is-expanded button is-success start_timer"
						onClick={this.startTimer}
						disabled={this.state.timerActive}>
						Start timer
					</button>
					<button
						className="is-expanded button is-danger reset_timer"
						onClick={this.resetTimer}>
						Reset timer
					</button>
					<h5 className="timer_status">
						{this.state.motivationalMessage}
					</h5>
				</div>
			</div>
		);
	}
}
