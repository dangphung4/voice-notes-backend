const express = require('express');
const { saveTranscriptionToDB , docClient} = require('./dynamodb');
const router = express.Router();
const {  OpenAI} = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
  });

// Helper function to communicate with the OpenAI API
const getResponseFromOpenAI = async (messages) => {
    try {
        const response = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });
        console.log("OpenAI API Response:", response); // Add this line

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
};

const getSummary = async (text) => {
    const messages = [
        { role: "system", content: "You are a helpful assistant, and a smart teacher." },
        { role: "user", content: `Summarize the following text(make sure to keep keypoints): ${text}` }
    ];
    return await getResponseFromOpenAI(messages);
};

const getElaboration = async (text) => {
    const messages = [
        { role: "system", content: "You are a helpful assistant, and a smart teacher." },
        { role: "user", content: `Elaborate on the following text(include more descriptors and key points): ${text}` }
    ];
    return await getResponseFromOpenAI(messages);

};

const fetchTranscription = async (id) => {
    const params = {
        TableName: "Transcriptions",
        Key: {
            "id": id
        }
    };

    try {
        const data = await docClient.get(params).promise();
        return data.Item.transcription;
    } catch (err) {
        console.error("Unable to fetch item. Error:", JSON.stringify(err, null, 2));
        throw err;
    }
};

router.post('/summarize', async (req, res) => {
    const id = req.headers.id // Get transcription ID from request
    console.log("ID being used:", id);

    try {
        const transcription = await fetchTranscription(id);
        const summary = await getSummary(transcription);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: "Error summarizing the transcription" });
    }
});

router.post('/elaborate', async (req, res) => {
    const id = req.headers.id // Get transcription ID from request
    try {
        const transcription = await fetchTranscription(id);
        const elaboration = await getElaboration(transcription);
        res.json({ elaboration });
    } catch (error) {
        res.status(500).json({ error: "Error elaborating the transcription" });
    }
});

module.exports = router;
