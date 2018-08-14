function saveSettings() {
	chrome.storage.sync.set({
		workTimeMins: document.getElementById("workTimeMins").value,
		workTimeSecs: document.getElementById("workTimeSecs").value,
		breakTimeMins: document.getElementById("breakTimeMins").value,
		breakTimeSecs: document.getElementById("breakTimeSecs").value
	}, function () {
		console.log(document.getElementById("workTime").value);
	});
}
document.getElementById("save").onclick = saveSettings;
