// chrome.storage.local.get("aiDetectionEnabled", (data) => {
//     if (data.aiDetectionEnabled === false) {
//         // console.log("🚫 AI detection is turned OFF.");
//         return;
//     }

//     // console.log("✅ AI detection is enabled.");
    
//     const observer = new MutationObserver(() => {
//         let detectedPosts = 0;
//         document.querySelectorAll('.feed-shared-update-v2').forEach(async postContainer => {
//             if (postContainer.dataset.aiProcessed === "true") {
//                 return;
//             }

//             postContainer.dataset.aiProcessed = "true";
//             detectedPosts++;

//             const timestampElement = postContainer.querySelector('.update-components-actor__sub-description');
//             if (!timestampElement) return;

//             const postTextElement = postContainer.querySelector('.break-words');
//             if (!postTextElement) return;

//             const textContent = postTextElement.innerText.trim();
//             if (!textContent) return;

//             // console.log('🚀 Checking AI content for:', textContent);

//             if (typeof window.checkWithChatGPT === 'function') {
//                 try {
//                     const result = await window.checkWithChatGPT(textContent);
//                     // console.log('🎯 AI detection result:', result);

//                     const aiBadge = document.createElement('span');
//                     aiBadge.classList.add('ai-detection-result', 'ai-detection-result-added');
//                     aiBadge.innerText = `${result.text}`;
//                     aiBadge.style.fontWeight = 'bold';
//                     aiBadge.style.marginLeft = '4px';
//                     aiBadge.style.padding = '0px 8px';
//                     aiBadge.style.borderRadius = '10px';
//                     aiBadge.style.color = 'white';
//                     aiBadge.style.backgroundColor = getColor(result.percentage);

//                     timestampElement.appendChild(aiBadge);
//                     // console.log('✅ AI badge added!');

//                     chrome.storage.local.get("postCount", (data) => {
//                         const updatedCount = (data.postCount || 0) + 1;
//                         chrome.storage.local.set({ postCount: updatedCount });
//                     });
//                 } catch (err) {
//                     console.error('Error calling checkWithChatGPT:', err);
//                 }
//             } else {
//                 console.error('🚨 checkWithChatGPT function is missing!');
//             }
//         });
//     });

//     observer.observe(document.body, { subtree: true, childList: true });

//     function getColor(percentage) {
//         const red = Math.min(255, Math.floor((percentage / 100) * 255));
//         const green = Math.min(255, Math.floor((1 - percentage / 100) * 255));
//         return `rgb(${red}, ${green}, 0)`;
//     }
// });


import { checkWithChatGPT } from "./api.js";

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

            try {
                const result = await checkWithChatGPT(textContent);

                const aiBadge = document.createElement('span');
                aiBadge.classList.add('ai-detection-result');
                aiBadge.innerText = `${result.text}`;
                aiBadge.style.backgroundColor = getColor(result.percentage);

                timestampElement.appendChild(aiBadge);

                chrome.storage.local.get("postCount", (data) => {
                    chrome.storage.local.set({ postCount: (data.postCount || 0) + 1 });
                });
            } catch (err) {
                console.error('Error calling AI API:', err);
            }
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });

    function getColor(percentage) {
        const red = Math.min(255, Math.floor((percentage / 100) * 255));
        const green = Math.min(255, Math.floor((1 - percentage / 100) * 255));
        return `rgb(${red}, ${green}, 0)`;
    }
});
