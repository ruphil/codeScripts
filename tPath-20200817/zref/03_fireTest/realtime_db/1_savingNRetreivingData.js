const admin = require("firebase-admin");
const serviceAccount = require("../../../realtimedb-14128.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://realtimedb-14128.firebaseio.com"
});

const db = admin.database();

let ref = db.ref("raji");

ref.set({
    "husband": "rukmangadans"
})
.then(function (){
    process.exit();
});

// let ref = db.ref("/");

// ref.set(2)
// .then(function (){
//     process.exit();
// });

// ref.remove()
// .then(function (){
//     process.exit();
// });
