app.post("/api/detect-ai", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: "You are an AI text detector. Given a piece of text, return only a percentage score of how likely it is AI-generated. Format your response as: 'x% AI'. Do NOT provide explanations, thoughts, or any additional text." },
                    { role: "user", content: `Analyze this text: ${text}` }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const aiPercentageText = data.choices[0].message.content.trim();
            
            // Extract only the percentage (e.g., "80% AI" → 80)
            const percentageMatch = aiPercentageText.match(/(\d+)%/);
            const aiPercentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;

            return res.json({ text: `${aiPercentage}% AI`, percentage: aiPercentage });
        }

        res.status(500).json({ error: "Invalid response from AI detector" });
    } catch (error) {
        console.error("API Request Failed:", error);
        res.status(500).json({ error: "API request failed." });
    }
});
