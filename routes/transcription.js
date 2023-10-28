const express = require('express');
const router = express.Router();
const multerUpload = require('../middleware/upload');
const { transcribeAudio } = require('../utils/watson');
const audioMetadata = require('audio-metadata');




router.post('/upload', multerUpload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const metadata = audioMetadata.parseBlob(req.file.buffer);
    if (metadata.duration > 120) {
        return res.status(400).send('Audio is too long. Please upload a shorter clip.');
    }

    const transcription = await transcribeAudio(req.file.buffer);
    if (transcription) {
        res.send(transcription);
    } else {
        res.status(500).send('Error during transcription.');
    }
});

module.exports = router;
