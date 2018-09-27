/* global chrome */
import React from "react";
import Bulma from "reactbulma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "./timer.css";

/*
	---I need to refactor the componentDidMount function and the updateTimer function to dynamically support the break timers---
*/
export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "",
			currentWorkMins: 0,
			currentWorkSecs: 0,
			currentBreakMins: 0,
			currentBreakSecs: 0,
			timerActive: false,
			disabled: "", // This sets the Start/Reset Timer button to be disabled when the other is enabled
		};
		this.workStyle = {
			fontSize: "12px",
			color: "#e20c0c",
		};
		this.breakStyle = {
			fontSize: "12px",
			color: "#63d824",
		};
		this.startTimer = this.startTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
		this.updateTimer = this.updateTimer.bind(this);
		this.openSettings = this.openSettings.bind(this);
		this.updateTime;
	}
	componentDidMount() {
		const bgpage = chrome.extension.getBackgroundPage();
		// ProstheticThis serves as a way to specify the meaning of `this` inside of the chrome.storage.sync function
		const prostheticThis = this;
		if (bgpage.isActive()) {
			// Updates the current timer so that the popup is always up-to-date with the background script
			console.log("The background page is currently active");
			this.updateTimer();
			this.setState({ timerActive: true });
		} else {
			console.log("The timer is currently inactive.");
			// Uses Chrome's Storage API to get the timer options inputting by the users
			chrome.storage.sync.get(
				[
					"workTimeMins",
					"workTimeSecs",
					"breakTimeMins",
					"breakTimeSecs",
				],
				function(result) {
					// Checks if users put in any values. If they didn't, it uses default values.
					if (
						result.workTimeMins === undefined ||
						result.workTimeSecs === undefined
					) {
						// Uses default values in case the options page has nothing inputted
						console.log(result.workTimeMins);
						prostheticThis.setState({
							currentWorkMins: 52,
							currentWorkSecs: 0,
							currentBreakMins: 17,
							currentBreakSecs: 0,
						});
					} else {
						const bgpage = chrome.extension.getBackgroundPage();
						// Gets the options that the user inputted into the state of the timer
						prostheticThis.setState({
							currentWorkMins: Number(result.workTimeMins),
							currentWorkSecs: Number(result.workTimeSecs),
							currentBreakMins: Number(result.breakTimeMins),
							currentBreakSecs: Number(result.breakTimeSecs),
						});
						console.log(
							prostheticThis.state.currentBreakMins +
								":" +
								prostheticThis.state.currentBreakSecs
						);
					}
				}
			);
			this.setState({ timerActive: false });
		}
	}
	startTimer() {
		const bgpage = chrome.extension.getBackgroundPage();
		// Starts the timer function in the background.js file, and inputs all current values as variables.
		bgpage.startTimer(
			this.state.currentWorkMins,
			this.state.currentWorkSecs,
			this.state.currentBreakMins,
			this.state.currentBreakSecs,
			"WORK TIME"
		);
		bgpage.isActiveTrue();
		this.updateTimer();
		this.setState({ status: "WORK TIME", timerActive: true });
	}

	updateTimer() {
		// This function refreshes the popup, and updates the display every second to display the time counted in the background script
		const bgpage = chrome.extension.getBackgroundPage();
		this.updateTime = setInterval(() => {
			if (bgpage.isActive()) {
				if (bgpage.getStatus() === "WORK TIME") {
					this.setState({
						currentWorkMins: bgpage.getCurrentWorkMins(),
						currentWorkSecs: bgpage.getCurrentWorkSecs(),
						status: bgpage.getStatus(),
					});
					console.log(
						bgpage.getCurrentWorkMins() +
							":" +
							bgpage.getCurrentWorkSecs() +
							"     =>" +
							bgpage.getStatus()
					);
				} else if (bgpage.getStatus() === "BREAK TIME") {
					this.setState({
						currentBreakMins: bgpage.getCurrentBreakMins(),
						currentBreakSecs: bgpage.getCurrentBreakSecs(),
						status: bgpage.getStatus(),
					});
					console.log(
						bgpage.getCurrentBreakMins() +
							":" +
							bgpage.getCurrentBreakSecs() +
							"     =>" +
							bgpage.getStatus()
					);
				}
			} else {
				clearInterval(this.updateTime);
			}
		}, 1000);
	}

	resetTimer() {
		console.log("Timer has been reset");
		let bgpage = chrome.extension.getBackgroundPage();
		bgpage.clearTimer();
		clearInterval(this.updateTime);
		bgpage.isActiveFalse();
		bgpage.resetGlobals();
		let originals = bgpage.getOriginals();
		this.setState({
			timerActive: false,
			currentWorkMins: originals.workMins,
			currentWorkSecs: originals.workSecs,
			currentBreakMins: originals.BreakMins,
			currentBreakSecs: originals.BreakSecs,
			status: "",
		});
	}
	openSettings() {
		window.open("/options/options.html");
	}
	render() {
		let workSeconds;
		// Determines proper formatting for time in seconds
		if (this.state.currentWorkSecs === 60) {
			workSeconds = "00";
		} else if (this.state.currentWorkSecs < 10) {
			workSeconds = "0" + this.state.currentWorkSecs;
		} else {
			workSeconds = this.state.currentWorkSecs;
		}
		let breakSeconds;
		if (this.state.currentBreakSecs === 60) {
			breakSeconds = "00";
		} else if (this.state.currentBreakSecs < 10) {
			breakSeconds = "0" + this.state.currentBreakSecs;
		} else {
			breakSeconds = this.state.currentBreakSecs;
		}
		return (
			<div className="timer">
				<React.StrictMode>
					<h2 className="is-centered">
						<p
							className="is=successs title"
							style={
								this.state.status === `WORK TIME`
									? this.workStyle
									: this.breakStyle
							}
						>
							{this.state.status}
						</p>
						{this.state.currentWorkMins}:
						{chrome.extension.getBackgroundPage().getStatus() ===
						"WORK TIMER"
							? workSeconds
							: breakSeconds}
					</h2>
					<div className="buttons is-centered is-marginless">
						<button
							className="is-expanded button is-success start_timer"
							onClick={this.startTimer}
							disabled={this.state.timerActive}
						>
							Start timer
						</button>
						<button
							className="is-expanded button is-danger reset_timer"
							onClick={this.resetTimer}
							disabled={!this.state.timerActive}
						>
							Reset timer
						</button>
					</div>
					<div className="breakTime is-centered">
						{"Break Time: " +
							this.state.currentBreakMins +
							":" +
							breakSeconds +
							" mins"}
					</div>
					<FontAwesomeIcon
						className="settings"
						icon={faCog}
						onClick={this.openSettings}
					/>
				</React.StrictMode>
			</div>
		);
	}
}
