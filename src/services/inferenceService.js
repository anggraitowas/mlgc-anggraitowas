const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
         
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
 
   
        let result = { confidenceScore, label:cancelAnimationFrame, suggestion: "Segera periksa ke dokter!"};
 
        if(confidenceScore < 1 ) {
            result.label = "Non-cancer";
            result.suggestion = "Penyakit kanker tidak terdeteksi.";    
        }
 
        return result;
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
 
module.exports = predictClassification;
