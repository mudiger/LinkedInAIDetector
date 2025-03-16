document.addEventListener("DOMContentLoaded", () => {
    const postCountElement = document.getElementById("post-count");
    const toggleDetection = document.getElementById("toggle-detection");
    const toggleStatus = document.getElementById("toggle-status");
    const logoImg = document.getElementById("logo-img");
    const coffeeImg = document.getElementById("coffee-img");

    // Set image sources
    logoImg.src = chrome.runtime.getURL("assets/icon.png");
    coffeeImg.src = chrome.runtime.getURL("assets/coffee.png");

    // Load stored values
    chrome.storage.local.get(["postCount", "aiDetectionEnabled"], (data) => {
        postCountElement.innerText = `Total Posts Detected: ${data.postCount || 0}`;
        toggleDetection.checked = data.aiDetectionEnabled !== false;
        toggleStatus.innerText = toggleDetection.checked ? "ON" : "OFF";
    });

    // Handle toggle switch
    toggleDetection.addEventListener("change", () => {
        const isEnabled = toggleDetection.checked;
        chrome.storage.local.set({ aiDetectionEnabled: isEnabled }, () => {
            toggleStatus.innerText = isEnabled ? "ON" : "OFF";

            // Reload LinkedIn tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0 && tabs[0].id !== undefined) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: () => window.location.reload()
                    });
                }
            });
        });
    });
});
