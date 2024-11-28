const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({databaseId: "mlgc"});
 
async function storeData(id, data) {
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}

function modelData(doc) {
	return {
		id: doc.id,
		history: {
			result: doc.data().result,
			createdAt: doc.data().createdAt,
			suggestion: doc.data().suggestion,
			id: doc.id,
		},
	};
}

async function getHistories(id = null) {
	const predictCollection = db.collection('prediction');
	if (id) {
		const doc = await predictCollection.doc(id).get();
		if (!doc.exists) return null;
		return modelData(doc);
	} else {
		const snapshot = await predictCollection.get();
		const allData = [];
		snapshot.forEach(doc => allData.push(modelData(doc)));
		return allData;
	}
}
module.exports = { storeData, getHistories };