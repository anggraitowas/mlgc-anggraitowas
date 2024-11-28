const predictClassification = require('../services/inferenceService');
const { storeData, getHistories } = require('../services/firestore');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  }
  await storeData(id, data);
  const response = h.response({
    status: 'success',
    message: confidenceScore > 0 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}

async function getPredictHandler(request, h){
  const {id} = request.params;

  const data = await getHistories(id);

  if(!data){
    const response = h.response({
      status: fail,
      message: "Prediction not found",

    });
    response.code(404);
    return response;
  }
}
 
module.exports = {postPredictHandler, getPredictHandler};
