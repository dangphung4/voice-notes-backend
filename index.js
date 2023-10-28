const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const io = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const websocket = io(server);

const transcriptionRoutes = require('./routes/transcription');
const notesRoutes = require('./routes/notes');

app.use(express.json());
app.use(cors());

app.use('/transcription', transcriptionRoutes);
// app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
