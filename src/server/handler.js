const { getResponse } = require('../services/loadTemplate');

function handleChatRequest(req, res) {
  console.log('handleChatRequest called');
  try {
    const { message } = req.body;
    console.log(`Message: ${message}`);

    if (!message) {
      throw new Error('Missing required field: message');
    }

    const template = req.app.get('responseTemplate');
    const combinedData = req.app.get('combinedData');
    const finalData = req.app.get('finalData');
    if (!combinedData) {
      throw new Error('Combined data not found');
    }
    if (!finalData) {
      throw new Error('Final data not found');
    }

    const response = getResponse(message, template, combinedData, finalData);

    res.json(response);
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  handleChatRequest,
  getResponse
};
