const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const franc = require('franc-min');


const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API_KEY,
    }),
    serviceUrl: process.env.WATSON_SERVICE_URL,
});

console.log(process.env.WATSON_API_KEY);

const transcribeAudio = async (audioBuffer) => {
    try {
        // First, get a snippet transcription for language detection
        const snippetResponse = await speechToText.recognize({
            audio: audioBuffer.slice(0, 50000), // only first 50 KB for speed
            contentType: 'audio/mp4',
        });

        const snippetTranscription = snippetResponse.result.results[0]?.alternatives[0]?.transcript || '';
        const detectedLanguage = franc(snippetTranscription);

        // Use this detected language for better transcription accuracy (if applicable)
        const langModel = detectedLanguage === 'eng' ? 'en-US_BroadbandModel' : 'YOUR_DEFAULT_MODEL_HERE';

        // Actual transcription
        const response = await speechToText.recognize({
            audio: audioBuffer,
            contentType: 'audio/mp4',
            model: langModel,
        });

        return response.result.results[0].alternatives[0].transcript;
    } catch (error) {
        console.error("Error during IBM Watson transcription:", error);
        return null;
    }
};

module.exports = { transcribeAudio };
