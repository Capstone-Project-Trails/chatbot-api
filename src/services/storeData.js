const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('../../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://trails-capstoneproject.firebaseio.com'
  });
}

const firestore = admin.firestore();

async function storeMessage(userId, message) {
  try {
    const timestamp = admin.firestore.Timestamp.now();
    const messagesRef = firestore.collection('messages').doc(userId).collection('chats');
    
    await messagesRef.add({
      message,
      timestamp,
    });

    console.log('Message stored in Firestore');
  } catch (error) {
    console.error('Error storing message in Firestore:', error);
    throw error;
  }
}

module.exports = {
  storeMessage,
};
