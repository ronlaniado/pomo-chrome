window.onload = syncSliders;
document.getElementById("save").onclick = saveSettings;

var workSlider = document.getElementById("workSlider");
var breakSlider = document.getElementById("breakSlider");
var workOutput = document.getElementById("workSliderValue")
var breakOutput = document.getElementById("breakSliderValue");
workOutput.innerHTML = workSlider.value;
breakOutput.innerHTML = breakSlider.value;

workSlider.oninput = function() {
  workOutput.innerHTML = this.value;
}
breakSlider.oninput = function () {
  breakOutput.innerHTML = this.value;
}




function saveSettings() {
	chrome.storage.sync.set({
    workTimeMins: document.getElementById("workSlider").value,
    breakTimeMins: document.getElementById("breakSlider").value,
    breakTimeSecs: 0,
    workTimeSecs: 0
  }, function () {
    console.log(document.getElementById("workSlider").value);
	});
}
function syncSliders() {
  //Matches the values of the sliders to the values in the user's saved profile
  chrome.storage.sync.get(['workTimeMins', 'workTimeSecs', 'breakTimeMins', 'breakTimeSecs'], function (result) {
    document.getElementById("workSlider").value = result.workTimeMins,
    document.getElementById("breakSlider").value = result.breakTimeMins,
    workOutput.innerHTML = result.workTimeMins,
    breakOutput.innerHTML = result.breakTimeMins  
  });
}
