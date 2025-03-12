// window.checkWithChatGPT = async function (text) {
//     try {
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer xxx"
//             },
//             body: JSON.stringify({
//                 model: "llama3-70b-8192",
//                 messages: [
//                     { role: "system", content: "You are an AI text detector. Given a piece of text, return only a percentage score of how likely it is AI-generated. Format your response as: 'x% AI' where x is the likelihood of AI generation. Do not provide explanations or any additional text." },
//                     { role: "user", content: `Analyze this text: ${text}` }
//                 ]
//             })
//         });

//         const data = await response.json();

//         // Extract AI probability and ensure no duplication
//         if (data.choices && data.choices.length > 0) {
//             const aiPercentageText = data.choices[0].message.content.trim();
            
//             // Extract percentage (e.g., "80% AI" -> 80)
//             const percentageMatch = aiPercentageText.match(/(\d+)%/);
//             const aiPercentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;
            
//             return { text: aiPercentageText, percentage: aiPercentage };
//         }

//         return "Error: No valid response.";

//     } catch (error) {
//         // console.error("🚨 API Request Failed:", error);
//         return "Error: API request failed.";
//     }
// };

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





