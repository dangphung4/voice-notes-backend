const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


const transcriptionRoutes = require('./routes/transcription');
const chatGptRoutes = require('./utils/chatgpt');


app.use(express.json());
app.use(cors());
app.use(express.static('public'));


app.use('/transcription', transcriptionRoutes);
app.use('/chatgpt', chatGptRoutes);


app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
