const express = require('express');
const bodyParser = require('body-parser');
const { loadTemplate, loadCombinedData, loadFinalData } = require('../services/loadTemplate');
const { getResponse } = require('./handler');
const app = express();
const port = 8080;

app.use(bodyParser.json());

const responseTemplatePath = process.env.RESPONSE_TEMPLATE_PATH || './data/response.json';
const combinedDataPath = process.env.COMBINED_DATA_PATH || './data/combined_data.json';
const finalDataPath = process.env.FINAL_DATA_PATH || './data/bali_final.json';

// Load template
loadTemplate(responseTemplatePath)
  .then(template => {
    app.set('responseTemplate', template);
    console.log('Template response berhasil dimuat');
  })
  .catch(error => {
    console.error('Gagal memuat template response:', error);
  });

// Load combined data
loadCombinedData(combinedDataPath)
  .then(combinedData => {
    app.set('combinedData', combinedData);
    console.log('Combined data berhasil dimuat');
  })
  .catch(error => {
    console.error('Gagal memuat combined data:', error);
  });

// Load final data
loadFinalData(finalDataPath)
  .then(finalData => {
    app.set('finalData', finalData);
    console.log('Final data berhasil dimuat');
  })
  .catch(error => {
    console.error('Gagal memuat final data:', error);
  });

// Handler untuk chat request dengan query parameter
app.get('/api/chat', (req, res) => {
  const message = req.query.message;
  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  const template = app.get('responseTemplate');
  const combinedData = app.get('combinedData');
  const finalData = app.get('finalData');

  try {
    const result = getResponse(message, template, combinedData, finalData);
    res.send(result);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;
