const { storeMessage } = require('../services/storeData');
const fetch = require('node-fetch');
const tf = require('@tensorflow/tfjs-node');
const dotenv = require('dotenv');

dotenv.config();

async function handleChatRequest(req, res) {
  console.log('handleChatRequest called');
  try {
    const { input, userId } = req.body;
    console.log(`Input: ${input}, UserID: ${userId}`);
    const model = req.app.get('model');
    const templateUrl = process.env.RESPONSE_TEMPLATE_PATH;

    await storeMessage(userId, input);
    console.log('Message stored');

    const inputTensor = tf.tensor2d([input]);
    const prediction = await model.predict(inputTensor).array();
    console.log('Prediction:', prediction);

    const responseTemplate = await fetch(templateUrl);
    const templateData = await responseTemplate.json();
    console.log('Template Data:', templateData);

    const response = templateData[prediction[0][0]];

    res.json({
      intent: prediction[0][0],
      entities: prediction[0].slice(1),
      response: response,
    });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleSocketChat(message, app) {
  console.log('handleSocketChat called');
  try {
    // Assuming message is plain text, split to get userId and input
    const parts = message.split(':');
    const userId = parts[0];
    const input = parts.slice(1).join(':').trim();
    console.log(`Input: ${input}, UserID: ${userId}`);

    const model = app.get('model');
    const templateUrl = process.env.RESPONSE_TEMPLATE_PATH;

    await storeMessage(userId, input);
    console.log('Message stored');

    const inputTensor = tf.tensor2d([input]);
    const prediction = await model.predict(inputTensor).array();
    console.log('Prediction:', prediction);

    const responseTemplate = await fetch(templateUrl);
    const templateData = await responseTemplate.json();
    console.log('Template Data:', templateData);

    const response = templateData[prediction[0][0]];

    return {
      intent: prediction[0][0],
      entities: prediction[0].slice(1),
      response: response,
    };
  } catch (error) {
    console.error('Error handling chat request:', error);
    return { error: 'Internal server error' };
  }
}

module.exports = {
  handleChatRequest,
  handleSocketChat,
};
