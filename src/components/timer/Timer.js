/* global chrome */
import React from 'react'
import Bulma from 'reactbulma'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import './timer.css'

/*
	---I need to refactor the componentDidMount function and the updateTimer function to dynamically support the break timers---
*/
export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '',
      origWorkMins: 0,
      origWorkSecs: 0,
      origBreakMins: 0,
      origBreakSecs: 0,
      currentWorkMins: 0,
      currentWorkSecs: 0,
      currentBreakMins: 0,
      currentBreakSecs: 0,
      timerActive: false,
      timeSeperator: ':',
      disabled: '' // This sets the Start/Reset Timer button to be disabled when the other is enabled
    }
    this.workStyle = {
      fontSize: '12px',
      color: '#e20c0c'
    }
    this.breakStyle = {
      fontSize: '12px',
      color: '#63d824'
    }
    this.startWorkTimer = this.startWorkTimer.bind(this)
    this.startBreakTimer = this.startBreakTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.updateTimer = this.updateTimer.bind(this)
	this.advanceTimer = this.advanceTimer.bind(this)
	  this.openSettings = this.openSettings.bind(this);
    this.updateTime
  }
  componentDidMount () {
    const bgpage = chrome.extension.getBackgroundPage()
        // ProstheticThis serves as a way to specify the meaning of `this` inside of the chrome.storage.sync function
    const prostheticThis = this
    if (bgpage.isActive()) {
            // Updates the current timer so that the popup is always up-to-date with the background script
      console.log('The background page is currently active')
      this.setState({
        currentWorkMins: bgpage.getMinutes(),
        currentWorkSecs: bgpage.getSeconds(),
        timeSeperator: bgpage.getTimeSeperator(),
        status: `WORK TIME`
      })
      this.updateTimer()
      this.setState({ timerActive: true })
    } else {
      console.log('The timer is currently inactive.')
            // Uses Chrome's Storage API to get the timer options inputting by the users
      chrome.storage.sync.get(['workTimeMins', 'workTimeSecs', 'breakTimeMins', 'breakTimeSecs'], function (
                result
            ) {
                // Checks if users put in any values. If they didn't, it uses default values.
        if (result.workTimeMins === undefined || result.workTimeSecs === undefined) {
                    // Uses default values in case the options page has nothing inputted
          console.log(result.workTimeMins)
          prostheticThis.setState({
            origWorkMins: 52,
            origWorkSecs: 60,
            currentWorkMins: prostheticThis.state.origWorkMins,
            currentWorkSecs: prostheticThis.state.origWorkSecs
          })
        } else {
                    // Gets the options that the user inputted into the state of the timer
          prostheticThis.setState({
            origWorkMins: Number(result.workTimeMins),
            origWorkSecs: Number(result.workTimeSecs),
            currentWorkMins: Number(result.workTimeMins),
            currentWorkSecs: Number(result.workTimeSecs),
            origBreakMins: Number(result.breakTimeMins),
            origBreakSecs: Number(result.breakTimeSecs),
            currentBreakMins: Number(result.breakTimeMins),
            currentBreakSecs: Number(result.breakTimeSecs)
          })
          console.log(prostheticThis.state.currentBreakMins + ':' + prostheticThis.state.currentBreakSecs)
        }
      })
      this.setState({ timerActive: false })
    }
  }
  startWorkTimer () {
    const bgpage = chrome.extension.getBackgroundPage()
    let localSec = this.state.origWorkSecs + 1
    let localMin = this.state.origWorkMins
        // Because the updateTimer function has a 1 second delay, the timer will start a second behind. This code is to ensure that the timer is
    if (localSec > 0) {
      localSec--
    } else if (localMin > 0) {
      localMin--
      localSec = 59
    }
        // Starts the timer function in the background.js file, and inputs all current values as variables.
    bgpage.startTimer(localSec, localMin, this.state.timeSeperator, 'WORK TIME')
    bgpage.isActiveTrue()
    this.updateTimer()
    this.setState({ status: 'WORK TIME', timerActive: true })
  }
  startBreakTimer () {
    const bgpage = chrome.extension.getBackgroundPage()
    let localSec = this.state.origBreakSecs + 1
    let localMin = this.state.origBreakMins
    if (localSec > 0) {
      localSec--
    } else if (localMin > 0) {
      localMin--
      localSec = 59
    }
        // Starts the break timer in the background
    bgpage.startTimer(localSec, localMin, this.state.timeSeperator, 'BREAK TIME')
    bgpage.isActiveTrue()
    this.updateTimer()
    this.setState({ status: 'BREAK TIME', timerActive: true })
  }

  updateTimer () {
        // This function refreshes the popup, and updates the display every second to display the time counted in the background script
    const bgpage = chrome.extension.getBackgroundPage()
    if (bgpage.isActive()) {
      this.updateTime = setInterval(() => {
        if (bgpage.getSeconds() === 1 && bgpage.getMinutes() === 0) {
          clearInterval(this.updateTime)
          setTimeout(() => {
            this.setState({
              currentWorkMins: 0,
              currentWorkSecs: 1
            })
          })
          setTimeout(() => {
            this.setState({ currentWorkSecs: 0 })
          }, 1000)
          setTimeout(() => {
            this.advanceTimer()
          }, 2000)
        } else {
          console.log(bgpage.getMinutes() + bgpage.getTimeSeperator() + bgpage.getSeconds())
          this.setState({
            currentWorkMins: bgpage.getMinutes(),
            currentWorkSecs: bgpage.getSeconds(),
            timeSeperator: bgpage.getTimeSeperator()
          })
        }
      }, 1000)
    }
  }
  advanceTimer () {
    let bgpage = chrome.extension.getBackgroundPage()
    bgpage.clearTimer()
    clearInterval(this.updateTime)
    bgpage.isActiveFalse()
    bgpage.resetGlobals()
    if (this.state.status === 'WORK TIME') {
      this.startBreakTimer()
      console.log('Break timer is starting')
    } else {
      this.startWorkTimer()
      console.log('Work timer is starting')
    }
  }

  resetTimer () {
    console.log('Timer has been reset')
    let bgpage = chrome.extension.getBackgroundPage()
    bgpage.clearTimer()
    clearInterval(this.updateTime)
    bgpage.isActiveFalse()
    bgpage.resetGlobals()
    this.setState({
      timerActive: false,
      currentWorkMins: this.state.origWorkMins,
      currentWorkSecs: this.state.origWorkSecs,
      currentBreakMins: this.state.origBreakMins,
      currentBreakSecs: this.state.currentBreakSecs,
      timeSeperator: ':',
      status: ''
    })
  }
	openSettings() {
    window.open('/options/options.html');
  }
  render () {
    let workSeconds
        // Determines proper formatting for time in seconds
    if (this.state.currentWorkSecs === 60) {
      workSeconds = '00'
    } else if (this.state.currentWorkSecs < 10) {
      workSeconds = '0' + this.state.currentWorkSecs
    } else {
      workSeconds = this.state.currentWorkSecs
    }
    let breakSeconds
    if (this.state.currentBreakSecs === 60) {
      breakSeconds = '00'
    } else if (this.state.currentBreakSecs < 10) {
      breakSeconds = '0' + this.state.currentBreakSecs
    } else {
      breakSeconds = this.state.currentBreakSecs
    }
    return (
		<div className='timer'>
        <React.StrictMode>
          <h2 className='is-centered'>
            <p
              className='is=successs title'
              style={this.state.status === `WORK TIME` ? this.workStyle : this.breakStyle}
                        >
              {this.state.status}
            </p>
            {this.state.currentWorkMins}
            {this.state.timeSeperator}
            {workSeconds}
          </h2>
          <div className='buttons is-centered is-marginless'>
            <button
              className='is-expanded button is-success start_timer'
              onClick={this.startWorkTimer}
              disabled={this.state.timerActive}
                        >
                            Start timer
                        </button>
            <button
              className='is-expanded button is-danger reset_timer'
              onClick={this.resetTimer}
              disabled={!this.state.timerActive}
                        >
                            Reset timer
                        </button>
          </div>
          <div className='breakTime is-centered'>
            {'Break Time: ' + this.state.currentBreakMins + ':' + breakSeconds + ' mins'}
          </div>
          <FontAwesomeIcon className="settings" icon={faCog} onClick={this.openSettings} />
			</React.StrictMode>
      </div>
    )
  }
}
