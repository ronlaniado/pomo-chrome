function saveSettings() {
	chrome.storage.sync.set({
		workTimeMins: document.getElementById("workTimeMins").value,
		workTimeSecs: document.getElementById("workTimeSecs").value,
		breakTime: document.getElementById("breakTime").value
	}, function() {
		console.log(document.getElementById("workTime").value);
	});
}
document.getElementById("save").onclick = saveSettings;
