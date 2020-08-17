const tf = require('@tensorflow/tfjs');

const a = tf.variable(tf.scalar(Math.random(),'float32'));
const b = tf.variable(tf.scalar(Math.random(),'float32'));
const c = tf.variable(tf.scalar(Math.random(),'float32'));
                                                                                       
const learningRate = 0.05;
const optimizer = tf.train.sgd(learningRate);

function predict(xInput){
    const x = tf.scalar(xInput, 'float32');
    const ax2 = a.mul(x.square());
    const bx = b.mul(x);
    const y = ax2.add(bx).add(c);
    return y;
}

function loss(prediction, yOutput) {
    const error = tf.scalar(yOutput).sub(prediction).square();
    return error.asScalar();
}

var xs = [0, 1, 2];
var ys = [1, 2, 3];

for (let i = 0; i < 10000; i++){
    let k = i % xs.length;
    optimizer.minimize(function(){
        const pred = predict(xs[k]);
        const predLoss = loss(pred, ys[k]);
        console.log("Loss:", predLoss.dataSync().toString(), "a:", a.dataSync().toString(), b.dataSync().toString(), c.dataSync().toString());
        return predLoss;
    });
}
