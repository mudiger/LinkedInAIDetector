chrome.storage.local.get("aiDetectionEnabled", (data) => {
    if (data.aiDetectionEnabled === false) return;

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.feed-shared-update-v2').forEach(async postContainer => {
            if (postContainer.dataset.aiProcessed === "true") return;
            postContainer.dataset.aiProcessed = "true";

            const timestampElement = postContainer.querySelector('.update-components-actor__sub-description');
            if (!timestampElement) return;

            const postTextElement = postContainer.querySelector('.break-words');
            if (!postTextElement) return;

            const textContent = postTextElement.innerText.trim();
            if (!textContent) return;

            // Send text content to background script for AI analysis
            chrome.runtime.sendMessage({ action: "fetchAIAnalysis", text: textContent }, (response) => {
                if (response?.result) {
                    const aiBadge = document.createElement('span');
                    aiBadge.classList.add('ai-detection-result');
                    aiBadge.innerText = `${response.result.text}`;
                    aiBadge.style.fontWeight = 'bold';
                    aiBadge.style.marginLeft = '4px';
                    aiBadge.style.padding = '0px 8px';
                    aiBadge.style.borderRadius = '10px';
                    aiBadge.style.color = 'white';
                    aiBadge.style.backgroundColor = getColor(response.result.percentage);

                    timestampElement.appendChild(aiBadge);

                    chrome.storage.local.get("postCount", (data) => {
                        chrome.storage.local.set({ postCount: (data.postCount || 0) + 1 });
                    });
                }
            });
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });

    function getColor(percentage) {
        const red = Math.min(255, Math.floor((percentage / 100) * 255));
        const green = Math.min(255, Math.floor((1 - percentage / 100) * 255));
        return `rgb(${red}, ${green}, 0)`;
    }
});
