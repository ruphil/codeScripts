const admin = require("firebase-admin");
const fs = require("fs");
const serviceAccount = require("../../firetest-68ddc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firetest-68ddc.firebaseio.com"
});

const db = admin.firestore();

let csvPath = "D:/jData/IOC.BO.csv";
let csvData = fs.readFileSync(csvPath, "utf-8");
// console.log(csvData);

let csvRows = csvData.split('\n');
for (let i = 0; i < csvRows.length; i++){
    let eachRow = csvRows[i];
    let dataParts = eachRow.split(',');

    let date = dataParts[0];

    let obj = {
        'open': dataParts[1],
        'high': dataParts[2],
        'low': dataParts[3],
        'close': dataParts[4],
        'adjclose': dataParts[5],
        'volume': dataParts[6]
    }
    
    console.log(date);
    const tFireSubDoc = db.collection('tFire').doc('IOC.BO').collection(date).doc(date);
    tFireSubDoc.set(obj);
}

// const docRef = db.collection('users').doc('alovelace');

// docRef.set({
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815
// });