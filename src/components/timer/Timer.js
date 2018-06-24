/*global chrome*/
import React from "react";
import Bulma from "reactbulma";
import "./timer.css";

export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentMin: 0,
			currentSec: 10,
			timerActive: false,
			timeSeperator: ":",
			motivationalMessage: "",
			disabled: "" //This sets the Start Timer button to be disabled
		};
		this.startTimer = this.startTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
		this.motivate = this.motivate.bind(this);
		this.updateTimer = this.updateTimer.bind(this);
		this.updateTime;
	}
	componentWillMount() {
		const bgpage = chrome.extension.getBackgroundPage();
		if (bgpage.getSeconds() > -1) {
			this.updateTimer();
		}
	}
	startTimer() {
		const currentComponent = this;
		this.setState({
			timerActive: true
		});
		const bgpage = chrome.extension.getBackgroundPage();
		let sec = this.state.currentSec;
		let min = this.state.currentMin;
		let timeSeperator = ":";
		bgpage.startTimer(sec, min, timeSeperator);
		this.updateTimer();

		this.motivate();
	}
	resetTimer() {
		let bgpage = chrome.extension.getBackgroundPage();
		bgpage.clearTimer();
		clearInterval(this.updateTime);
		bgpage.resetGlobals();
		this.setState({
			timerActive: false,
			currentMin: bgpage.getOrigMinutes(),
			currentSec: bgpage.getOrigSeconds(),
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
	updateTimer() {
		const bgpage = chrome.extension.getBackgroundPage();
		this.updateTime = setInterval(() => {
			console.log(
				bgpage.getMinutes() +
					bgpage.getTimeSeperator() +
					bgpage.getSeconds()
			);
			let time =
				bgpage.getMinutes() +
				bgpage.getTimeSeperator() +
				bgpage.getSeconds();
			this.setState({
				currentMin: bgpage.getMinutes(),
				currentSec: bgpage.getSeconds(),
				timeSeperator: bgpage.getTimeSeperator()
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
