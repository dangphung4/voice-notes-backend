const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { saveTranscriptionToDB } = require("./dynamodb"); // Adjust the path as per your directory structure

let franc;
import("franc-min").then((module) => {
  franc = module.default;
});

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  serviceUrl: process.env.WATSON_SERVICE_URL,
});

const convertToWav = (inputBuffer) => {
  console.log("Input buffer length:", inputBuffer.length);

  return new Promise((resolve, reject) => {
    let bufferStream = new require("stream").PassThrough();
    bufferStream.end(inputBuffer);
    let chunks = [];

    ffmpeg()
      .input(bufferStream)
      .inputFormat("mp4")
      .toFormat("wav")
      .on("data", (chunk) => chunks.push(chunk))
      .on("stderr", (stderrLine) => console.error("Stderr output:", stderrLine))
      .on("progress", (progress) => console.log(`Processing:`, progress))
      .on("end", () => {
        const wavBuffer = fs.readFileSync("output.wav");
        resolve(wavBuffer);
      })

      .on("error", (err) => reject(err))
      .save("output.wav");
  });
};

const transcribeAudio = async (audioBuffer, uid, socket) => {
  fs.writeFileSync("test_input.mp4", audioBuffer);

  try {
    const wavAudioBuffer = await convertToWav(audioBuffer);

    if (wavAudioBuffer.length > 1000000) {
      snippetResponse = await speechToText.recognize({
        audio: wavAudioBuffer,
        contentType: "audio/wav",
      });
    }

    // Default to English if language detection fails or if not English
    let langModel = "en-US_BroadbandModel";

    const response = await speechToText.recognize({
      audio: wavAudioBuffer,
      contentType: "audio/wav",
      model: langModel,
    });

    const transcription = response.result.results
      .map((result) => result.alternatives[0].transcript)
      .join(" ");

    if (uid) {
    saveTranscriptionToDB(uid, transcription);
    }
    
    if (socket) {
      socket.emit("transcription", transcription);
    }

    return transcription;
  } catch (error) {
    console.error("Error during IBM Watson transcription:", error);
    return null;
  }
};

module.exports = { transcribeAudio };
