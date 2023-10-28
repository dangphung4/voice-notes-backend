const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator, IamTokenManager } = require('ibm-watson/auth');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const WebSocket = require('ws'); // You will need to install this: npm install ws
const { getSystemErrorMap } = require('util');




let franc;
import('franc-min').then(module => {
    franc = module.default;
});


const tokenManager = new IamTokenManager({
    apikey: process.env.WATSON_API_KEY
});

const getWatsonToken = async () => {
    try {
        const accessToken = await tokenManager.getToken();
        return accessToken;
    } catch (err) {
        console.error('Error fetching the token:', err);
        throw err;
    }
};



const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API_KEY,
    }),
    serviceUrl: process.env.WATSON_SERVICE_URL,
});

const convertToWav = (inputBuffer) => {
    console.log('Input buffer length:', inputBuffer.length);
    
    return new Promise((resolve, reject) => {
        let bufferStream = new require('stream').PassThrough();
        bufferStream.end(inputBuffer);
        
        let chunks = [];

        ffmpeg()
            .input(bufferStream)
            .inputFormat('mp4')
            .toFormat('wav')
            .on('data', chunk => chunks.push(chunk))
            .on('end', () => {
                resolve(Buffer.concat(chunks));  // return the combined chunks as a Buffer
            })
            .on('stderr', stderrLine => console.error('Stderr output:', stderrLine))
            .on('progress', progress => console.log('Processing:', progress))
            .on('error', err => reject(err))
            .pipe(bufferStream, { end: true });
    });
};


const transcribeAudio = async (audioBuffer, socket) => {
    const langModel = 'en-US_BroadbandModel';
    const contentType = 'audio/wav'; // Since you're converting to WAV
    
    // Convert the audio buffer to WAV format
    const wavAudio = await convertToWav(audioBuffer);
    
    // Parameters for recognizeUsingWebSocket
    const params = {
        audio: wavAudio,
        contentType: contentType,
        model: langModel,
        objectMode: true // This makes sure we get objects in response instead of strings
    };

    // Initialize the recognize stream
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);

    recognizeStream.on('data', function(event) {
        if (event.results) {
            const transcriptionPiece = event.results[0].alternatives[0].transcript;
            socket.emit('transcription', transcriptionPiece); // Send transcription to frontend
        }
    });
    
    recognizeStream.on('error', function(err) {
        console.error("Error during WebSocket transcription:", err);
    });

    recognizeStream.on('close', function(event) {
        console.log('WebSocket connection closed');
    });
};



module.exports = { transcribeAudio };