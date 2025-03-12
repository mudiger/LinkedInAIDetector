const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// ✅ Enable CORS for Chrome Extensions
app.use(cors({
    origin: "*", // Allows all origins
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

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
                    { role: "system", content: "You are an AI text detector. Given a piece of text, return only a percentage score of how likely it is AI-generated. Format your response as: 'x% AI' where x is the likelihood of AI generation. Do not provide explanations or any additional text." },
                    { role: "user", content: `Analyze this text: ${text}` }
                ]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const aiPercentageText = data.choices[0].message.content.trim();
            const percentageMatch = aiPercentageText.match(/(\d+)%/);
            const aiPercentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;

            return res.json({ text: aiPercentageText, percentage: aiPercentage });
        }

        res.status(500).json({ error: "Invalid response from AI detector" });
    } catch (error) {
        console.error("API Request Failed:", error);
        res.status(500).json({ error: "API request failed." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
