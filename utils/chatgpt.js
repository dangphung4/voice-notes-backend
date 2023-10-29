const express = require("express");
const {
  saveTranscriptionToDB,
  updateTranscriptionInDB,
  docClient,
} = require("./dynamodb");
const router = express.Router();
const { OpenAI } = require("openai");

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
    {
      role: "system",
      content: "You are a helpful assistant, and a smart teacher. You are also the best not taker ever. I want you to write notes for the user. Do not give me any other responses except for the notes itself. I do not want to hear what you have to say, only what you have to offer.",
    },
    {
      role: "user",
      content: `Summarize the following text(make sure to keep keypoints) Please remember that I only want the notes. i do not want headers, or anything like that. make sure that HTML can read this properly:: ${text}`,
    },
  ];
  return await getResponseFromOpenAI(messages);
};

const getElaboration = async (text) => {
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant, and a smart teacher. You are also the best note taker ever. I want you to write the best notes for the user. Do not give my any responses except for the notes itself. I do not want to hear what you have to say, only what you have to offer.",
    },
    {
      role: "user",
      content: `Elaborate on the following text(include more descriptors and key points) Please remember that I only want the notes. i do not want headers, or anything like that. make sure that HTML can read this properly: ${text}`,
    },
  ];
  return await getResponseFromOpenAI(messages);
};

const fetchTranscription = async (id) => {
  const params = {
    TableName: "Transcriptions",
    Key: {
      id: id,
    },
  };

  try {
    const data = await docClient.get(params).promise();
    return data.Item.transcription;
  } catch (err) {
    console.error("Unable to fetch item. Error:", JSON.stringify(err, null, 2));
    throw err;
  }
};

router.post("/summarize", async (req, res) => {
  const id = req.headers.id; // Get transcription ID from request
  console.log("ID being used:", id);

  try {
    const transcription = await fetchTranscription(id);
    const summary = await getSummary(transcription);

    // Update the transcription in the database with the summary
    await updateTranscriptionInDB(id, summary);

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: "Error summarizing the transcription" });
  }
});

router.post("/elaborate", async (req, res) => {
  const id = req.headers.id; // Get transcription ID from request
  console.log("ID being used:", id);

  try {
    const transcription = await fetchTranscription(id);
    const elaboration = await getElaboration(transcription);

    // Update the transcription in the database with the elaboration
    await updateTranscriptionInDB(id, elaboration);

    res.json({ elaboration });
  } catch (error) {
    res.status(500).json({ error: "Error elaborating the transcription" });
  }
});

module.exports = router;
