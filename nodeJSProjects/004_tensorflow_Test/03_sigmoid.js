const tf = require('@tensorflow/tfjs');

const w = tf.tensor1d([0.7, -0.3]);
const i = tf.tensor1d([0.1, 0.8]);
const b = tf.scalar(2.1);

const myAnswer = tf.tidy( function() {
    const myDot = tf.outerProduct(w, i)
    const myAdd = tf.add(myDot, b)
    const mySig = tf.sigmoid(myAdd)
    return mySig
});

myAnswer.print('verbose');

// myAnswer.data().then((data)=> {
//     console.log(data);
// });

// const myDot = tf.outerProduct(w, i);
// // console.log(myDot.flatten().shape);
// const myDot2 = tf.outerProduct(myDot.flatten(), i);
// myDot2.data().then((data)=> {
//     console.log(data);
// });