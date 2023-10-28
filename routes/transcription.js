const multerUpload = require('../middleware/upload');
const express = require('express');
const router = express.Router();
const { transcribeAudio } = require('../utils/watson.js');




router.post('/upload', multerUpload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('File received.');
    console.log('File size:', req.file.size);


    console.log('Starting audio conversion...');


    try {
        const transcription = await transcribeAudio(req.file.buffer);
        if (transcription) {
            res.send(transcription);
        } else {
            res.status(500).send('Error during transcription.');
        }
    } catch (error) {
        res.status(500).send('Error during transcription: ' + error.message);
    }
    
});

module.exports = router;
