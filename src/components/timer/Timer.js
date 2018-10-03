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
			currentWorkMins: 52,
			currentWorkSecs: 0,
			currentBreakMins: 17,
			currentBreakSecs: 0,
			timerActive: false,
			distance: "",
			originalDistance: "",
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
		this.getSettings = this.getSettings.bind(this);
		this.openSettings = this.openSettings.bind(this);
		this.updateTime;
	}
	componentDidMount() {
		const bgpage = chrome.extension.getBackgroundPage();
		if (bgpage.isActive()) {
			// Updates the current timer so that the popup is always up-to-date with the background script
			console.log("The background page is currently active");
			this.setState({
				distance: bgpage.getDistance(),
				status: bgpage.getStatus(),
			});
			this.updateTimer();
			this.setState({ timerActive: true });
		} else {
			console.log("The timer is currently inactive.");
			this.getSettings();
			this.setState({ timerActive: false });
		}
	}
	startTimer() {
		const bgpage = chrome.extension.getBackgroundPage();
		// Starts the timer function in the background.js file, and inputs all current values as variables.
		bgpage.startWorkTimer(
			this.state.currentWorkMins,
			this.state.currentBreakMins,
			"WORK TIME"
		);
		bgpage.isActiveTrue();
		this.updateTimer();
		this.setState({ status: "WORK TIME", timerActive: true });
	}

	updateTimer() {
		let bgpage = chrome.extension.getBackgroundPage();
		this.updateTime = setInterval(() => {
			this.setState({
				distance: bgpage.getDistance(),
				status: bgpage.getStatus(),
			});
		}, 1000);
	}
	resetTimer() {
		console.log("Timer has been reset");
		let bgpage = chrome.extension.getBackgroundPage();
		bgpage.clearTimer();
		clearInterval(this.updateTime);
		bgpage.isActiveFalse();
		this.setState({
			timerActive: false,
			status: "",
			distance: this.state.originalDistance,
		});
		this.getSettings();
	}
	getSettings() {
		// Uses Chrome's Storage API to get the timer options inputting by the users
		const prostheticThis = this; // ProstheticThis serves as a way to specify the meaning of `this` inside of the chrome.storage.sync function
		chrome.storage.sync.get(["workTimeMins", "breakTimeMins"], function(
			result
		) {
			// Checks if users put in any values. If they didn't, it uses default values.
			if (
				result.workTimeMins === undefined ||
				result.breakTimeMins === undefined
			) {
				// Uses default values in case the options page has nothing inputted
				prostheticThis.setState({
					currentWorkMins: 52,
					currentBreakMins: 17,
					distance: new Date(Date.now() + 52 * 61000) - Date.now(),
				});
			} else {
				const bgpage = chrome.extension.getBackgroundPage();
				// Gets the options that the user inputted into the state of the timer
				prostheticThis.setState({
					currentWorkMins: Number(result.workTimeMins),
					currentBreakMins: Number(result.breakTimeMins),
					distance:
						new Date(Date.now() + result.workTimeMins * 61000) -
						Date.now(),
					originalDistance:
						new Date(Date.now() + result.workTimeMins * 61000) -
						Date.now(),
				});
				console.log(
					prostheticThis.state.currentBreakMins +
						":" +
						prostheticThis.state.currentBreakSecs
				);
			}
		});
	}
	openSettings() {
		window.open("/options/options.html");
	}
	render() {
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
						{Math.round(
							(this.state.distance % (1000 * 60 * 60)) /
								(1000 * 60)
						)}
						:
						{Math.round(
							(this.state.distance % (1000 * 60)) / 1000
						) <= 9
							? "0" +
							  Math.round(
									(this.state.distance % (1000 * 60)) / 1000
							  )
							: Math.round(
									(this.state.distance % (1000 * 60)) / 1000
							  )}
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
						{"Break Time: "}
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
