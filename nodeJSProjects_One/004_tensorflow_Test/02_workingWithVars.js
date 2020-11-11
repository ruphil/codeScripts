const tf = require('@tensorflow/tfjs');

let var1 = tf.variable(tf.randomNormal([1]));

const k1 = tf.scalar(2);

let expression = k1 * var1;

console.log(2);

k1.data().then((data)=> {
    console.log(data);
});

console.log(3);