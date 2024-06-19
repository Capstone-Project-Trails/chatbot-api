const tf = require('@tensorflow/tfjs-node');
const fetch = require('node-fetch');
const { SlicingOpLambda } = require('./customLayers'); // Impor custom layer

async function loadModel(modelUrl) {
  try {
    const model = await tf.loadLayersModel(modelUrl);
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

module.exports = {
  loadModel,
};
