const express = require('express');
const bodyParser = require('body-parser');
const { loadTemplate, loadCombinedData, loadFinalData } = require('../services/loadTemplate');
const { handleChatRequest } = require('./handler');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const responseTemplatePath = process.env.RESPONSE_TEMPLATE_PATH || './data/response.json';
const combinedDataPath = process.env.COMBINED_DATA_PATH || './data/combined_data.json';
const finalDataPath = process.env.FINAL_DATA_PATH || './data/bali_final.json';

loadTemplate(responseTemplatePath)
  .then(template => {
    app.set('responseTemplate', template);
    console.log('Template response successfully loaded');
  })
  .catch(error => {
    console.error('Failed to load response template:', error);
  });

loadCombinedData(combinedDataPath)
  .then(combinedData => {
    app.set('combinedData', combinedData);
    console.log('Combined data successfully loaded');
  })
  .catch(error => {
    console.error('Failed to load combined data:', error);
  });

loadFinalData(finalDataPath)
  .then(finalData => {
    app.set('finalData', finalData);
    console.log('Final data successfully loaded');
  })
  .catch(error => {
    console.error('Failed to load final data:', error);
  });

app.post('/api/chat', handleChatRequest);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
