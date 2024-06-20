const fs = require('fs').promises;

async function loadTemplate(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load template:', error);
    throw error;
  }
}

async function loadCombinedData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load combined data:', error);
    throw error;
  }
}

async function loadFinalData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load final data:', error);
    throw error;
  }
}

const intentTypeMapping = {
  'FindHotel': 'lodging',
  'FindRestaurant': 'restaurant',
  'FindTouristAttraction': 'tourist_attraction',
  'FindCafe': 'cafe',
  'FindBar': 'bar',
  'FindStore': 'store',
  'FindHospital': 'hospital'
};

function getSuggestions(type, region, finalData) {
  const suggestions = finalData.filter(item =>
    item.place && item.place.types && item.place.types.includes(type) &&
    ((item.place.region && item.place.region.toLowerCase() === region.toLowerCase()) ||
    (item.place.vicinity && item.place.vicinity.toLowerCase().includes(region.toLowerCase())))
  ).sort((a, b) => b.place.rating - a.place.rating)
    .slice(0, 5)
    .map(item => item.place);

  console.log(`Type: ${type}, Region: ${region}`);
  console.log(`Suggestions found: ${suggestions.length}`, suggestions);
  
  return suggestions;
}

function getResponse(message, template, combinedData, finalData) {
  let intent = 'default';
  let location = 'LOCATION';
  let response = '';

  // Proses sesuai dengan data yang ada di combinedData
  for (const item of combinedData) {
    if (message.toLowerCase().includes(item.text.toLowerCase())) {
      intent = item.intent;
      location = item.entities.LOCATION;
      break;
    }
  }

  const responses = template[intent];
  if (responses) {
    response = responses[Math.floor(Math.random() * responses.length)].replace('{LOCATION}', location);
  } else {
    response = "Sorry, I didn't understand that. Can you please rephrase?";
  }

  const type = intentTypeMapping[intent] || 'establishment';
  const suggestions = getSuggestions(type, location, finalData);

  return {
    intent: intent,
    entities: [location],
    response: response,
    suggestions: suggestions // Mengembalikan 5 saran teratas berdasarkan rating
  };
}

module.exports = {
  loadTemplate,
  loadCombinedData,
  loadFinalData,
  getResponse,
};
