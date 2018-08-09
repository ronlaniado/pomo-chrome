/*global chrome*/
import React from "react";
import Bulma from "reactbulma";
import "./timer.css";

export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			origMin: 0,
			origSec: 0,
			currentMin: 10,
			currentSec: 60,
			timerActive: false,
			timeSeperator: ":",
			motivationalMessage: "",
			disabled: "" //This sets the Start Timer button to be disabled
		};
		this.startTimer = this.startTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
		this.motivateBreak = this.motivateBreak.bind(this);
		this.motivateWork = this.motivateWork.bind(this);
		this.updateTimer = this.updateTimer.bind(this);
		this.updateTime;
	}
	componentWillMount() {
		const bgpage = chrome.extension.getBackgroundPage();
		const prostheticThis = this;
		this.updateTimer();
		if (bgpage.isActive()) {
			console.log("The background page is currently active");
			this.motivateWork();
			this.setState({ timerActive: true });
		} else {
			//Uses Chrome's Storage API to get the timer options inputting by the users
			chrome.storage.sync.get(['workTimeMins', 'workTimeSecs'], function (result) {
				//Checks if users put in any values. If they didn't, it uses default values. 
				if (result.workTimeMins === undefined || result.workTimeSecs === undefined) {
					console.log(result.workTimeMins);
					prostheticThis.setState({
						origMin: 52,
						origSec: 60,
						currentMin: prostheticThis.state.origMin,
						currentSec: prostheticThis.state.origSec
					});
				} else {
					prostheticThis.setState({
						origMin: Number(result.workTimeMins),
						origSec: Number(result.workTimeSecs),
						currentMin: Number(result.workTimeMins),
						currentSec: Number(result.workTimeSecs)
					});
				}
			});
			this.setState({timerActive: false});
		}
	}
	startTimer() {
		const bgpage = chrome.extension.getBackgroundPage();
 		//Starts the timer function in the background.js file, and inputs all current values as variables.
		bgpage.startTimer(this.state.origSec, this.state.origMin, this.state.timeSeperator);
		bgpage.isActiveTrue();
		this.updateTimer();
		this.motivateWork();
	}
	resetTimer() {
		let bgpage = chrome.extension.getBackgroundPage();
		bgpage.clearTimer();
		clearInterval(this.updateTime);
		bgpage.isActiveFalse();
		bgpage.resetGlobals();
		this.setState({
			timerActive: false,
			currentMin: this.state.origMin,
			currentSec: this.state.origSec,
			timeSeperator: ":",
			motivationalMessage: ""
		});
	}
	motivateWork() {
		const keepWorking = [
			"Keep working, you can do it!", "Almost there!", "Just..a bit..longer.."];
		this.setState({motivationalMessage:keepWorking[Math.floor(Math.random() * keepWorking.length)]});
	}
	motivateBreak() {
		const takeBreak = ["Take a break, you've earned it!", "Time to relax!"];
		this.setState({motivationalMessage:takeBreak[Math.floor(Math.random() * takeBreak.length)]});
	}
	updateTimer() {
		const bgpage = chrome.extension.getBackgroundPage();
		if (bgpage.isActive()) {
			this.updateTime = setInterval(() => {
				if (bgpage.getSeconds() >= 1) {
					if (bgpage.getSeconds() === 1) {
						clearInterval(this.updateTime);
						this.setState({
							currentMin: 0,
							currentSec: 1
						});
						setTimeout(() => {
							this.setState({currentSec: 0});
							this.motivateBreak();
						}, 1000);
						setTimeout(() => {this.resetTimer()}, 5000);
					} else {
						console.log(bgpage.getMinutes() + bgpage.getTimeSeperator() + bgpage.getSeconds());
						this.setState({
							currentMin: bgpage.getMinutes(),
							currentSec: bgpage.getSeconds(),
							timeSeperator: bgpage.getTimeSeperator()
						});
					}
				}
			}, 1000);
		}
	}
	render() {
		let seconds;
		//Determines proper formatting for time in seconds
		if (this.state.currentSec === 60) {
			seconds = '00';
		} else if (this.state.currentSec < 10) {
			seconds = '0' + this.state.currentSec;
		} else {
			seconds = this.state.currentSec;
		}
		return (
			<div className="timer">
				<h2 className="is-centered">
					{this.state.currentMin}
					{this.state.timeSeperator}
					{seconds}
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