document.addEventListener("DOMContentLoaded", () => {
    const postCountElement = document.getElementById("post-count");
    const toggleDetection = document.getElementById("toggle-detection");
    const toggleStatus = document.getElementById("toggle-status");

    // Load the stored post count
    chrome.storage.local.get(["postCount", "aiDetectionEnabled"], (data) => {
        postCountElement.innerText = `Total Posts Detected: ${data.postCount || 0}`;
        const isEnabled = data.aiDetectionEnabled !== false; // Default to true
        toggleDetection.checked = isEnabled;
        toggleStatus.innerText = isEnabled ? "ON" : "OFF";
    });

    // Handle toggle switch
    toggleDetection.addEventListener("change", () => {
        const isEnabled = toggleDetection.checked;
        chrome.storage.local.set({ aiDetectionEnabled: isEnabled }, () => {
            toggleStatus.innerText = isEnabled ? "ON" : "OFF";
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    });
});
