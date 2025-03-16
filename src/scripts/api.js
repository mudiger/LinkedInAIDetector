chrome.runtime.onInstalled.addListener(() => {
    console.log("LinkedIn AI Detector Extension Installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchAIAnalysis") {
        fetch("https://linkedin-ai-detector.vercel.app/api/detect-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message.text })
        })
        .then(response => response.json())
        .then(data => sendResponse({ result: data }))
        .catch(error => sendResponse({ error: "API Request Failed" }));

        return true; // Keeps sendResponse open for async response
    }
});






