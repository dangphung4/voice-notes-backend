const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

const saveTranscriptionToDB  = (transcription, summary) => {
    const params = {
        TableName: 'Transcriptions',  // Make sure the table name matches what you've set in DynamoDB
        Item: {
          id: Date.now().toString(), // unique identifier, using timestamp for simplicity
          transcription: transcription
        }
      };

    docClient.put(params, (err, data) => {
        if (err) {
            console.error("Error saving to DynamoDB", JSON.stringify(err, null, 2));
        } else {
            console.log("Saved successfully:", JSON.stringify(data, null, 2));
        }
    });
};

module.exports = { saveTranscriptionToDB  };
