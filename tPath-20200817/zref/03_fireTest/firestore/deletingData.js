const admin = require("firebase-admin");
const serviceAccount = require("../../firetest-68ddc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firetest-68ddc.firebaseio.com"
});

const db = admin.firestore();

const snapshot = db.collection('users').get();
snapshot.then((dataSnapshot) => {
  dataSnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    db.collection('users').doc(doc.id).delete();
  });
});