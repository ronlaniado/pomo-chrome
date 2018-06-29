function saveSettings() {
	chrome.storage.sync.set({
		workTime: document.getElementById("workTime").value,
		breakTime: document.getElementById("breakTime").value
	}, function() {
		console.log(document.getElementById("workTime").value);
	});
}
document.getElementById("save").onclick = saveSettings;
