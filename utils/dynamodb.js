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
        TableName: 'Transcriptions',  
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

const updateTranscriptionInDB = async (id, updatedTranscription) => {
    const params = {
        TableName: "Transcriptions",
        Key: {
            "id": id
        },
        UpdateExpression: "set transcription = :t",
        ExpressionAttributeValues: {
            ":t": updatedTranscription
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await docClient.update(params).promise();
    } catch (err) {
        console.error("Unable to update item. Error:", JSON.stringify(err, null, 2));
        throw err;
    }
};

module.exports = { saveTranscriptionToDB , updateTranscriptionInDB, docClient };
