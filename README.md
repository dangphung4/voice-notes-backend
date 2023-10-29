
---

# Transcriptify Backend

The Transcriptify backend provides the necessary endpoints and services to power the frontend transcription application. Built using Node.js and Express, it integrates with IBM Watson for transcription, DynamoDB for data storage, FFmpeg for media processing, and OpenAI for content elaboration.

## Features

- **Transcription Service**: Uses IBM Watson to convert uploaded audio and video files into text.
- **Database**: Storing user data and transcriptions with DynamoDB.
- **Media Processing**: Utilizes FFmpeg for efficient audio and video processing.
- **Content Elaboration**: Leverages the power of OpenAI to summarize or elaborate on transcriptions.

## Prerequisites

- Node.js and npm (Ensure they're installed on your machine)
- `.env` file with necessary environment variables for the various services used.

## Getting Started

To get the backend up and running locally, follow these steps:

1. **Navigate to the server directory**:

   ```bash
   cd server
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Server**:

   ```bash
   node index.js
   ```
   or
   ```bash
   node .
   ```

Your backend server should now be running. Ensure you have the `.env` file set up in the server directory with all the required keys for IBM Watson, DynamoDB, FFmpeg, and OpenAI.

## Built With

- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
- [IBM Watson](https://www.ibm.com/watson) - AI-driven services to transcribe audio and video.
- [DynamoDB](https://aws.amazon.com/dynamodb/) - A fully managed proprietary NoSQL database service.
- [FFmpeg](https://ffmpeg.org/) - A solution to record, convert, and stream audio and video.
- [OpenAI](https://www.openai.com/) - AI-driven content elaboration and manipulation.

## Environment Variables

Ensure your `.env` file contains the following keys:

```
WATSON_API_KEY=YOUR_KEY
WATSON_SERVICE_URL=YOUR_URL
PORT=YOUR_PORT
AWS_ACCESS_KEY_ID=YOUR_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_REGION=YOUR_REGION
ORGANIZATION_KEY=org-YOUR_OPEN_AI_KEY
OPENAI_API_KEY=sk-YOUR_OPEN_AI_KEY
```
