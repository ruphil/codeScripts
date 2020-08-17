const admin = require("firebase-admin");
const serviceAccount = require("../../firetest-68ddc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firetest-68ddc.firebaseio.com"
});

const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');

docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
});

// const aTuringRef = db.collection('users').doc('aturing');

// aTuringRef.set({
//   'first': 'Alan',
//   'middle': 'Mathison',
//   'last': 'Turing',
//   'born': 1912
// });

// const citiesRef = db.collection('cities');

// citiesRef.doc('SF').set({
//   name: 'San Francisco', state: 'CA', country: 'USA',
//   capital: false, population: 860000
// });
// citiesRef.doc('LA').set({
//   name: 'Los Angeles', state: 'CA', country: 'USA',
//   capital: false, population: 3900000
// });
// citiesRef.doc('DC').set({
//   name: 'Washington, D.C.', state: null, country: 'USA',
//   capital: true, population: 680000
// });
// citiesRef.doc('TOK').set({
//   name: 'Tokyo', state: null, country: 'Japan',
//   capital: true, population: 9000000
// });
// citiesRef.doc('BJ').set({
//   name: 'Beijing', state: null, country: 'China',
//   capital: true, population: 21500000
// });
