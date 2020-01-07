const { train, test } = require("./preprocess");
const R = require("ramda");
const tf = require("@tensorflow/tfjs-node");
const data = tf.tensor(train.map(x => x[0]));
const labels = tf.tensor(train.map(x => x[1]));
const testData = tf.tensor(train.map(x => x[0]));
const testLabels = tf.tensor(train.map(x => x[1]));
const model = tf.sequential({
    layers: [
        tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: "relu" }),
        tf.layers.dense({ units: 3, activation: "softmax" })
    ]
});
model.compile({
    optimizer: "adam",
    loss: 'meanSquaredError',
    metrics: "accuracy"
})
const acc = predictions => Number(tf.metrics.binaryAccuracy(testLabels, predictions).mean().toString().replace(/[^\d\.]/g, "")).toFixed(3)
model.fit(data, labels, {
    epochs: 100,
    batchSize: 32,
    callbacks: {
        onBatchEnd(batch, logs) {
            const predictions = model.predict(testData);
            console.log(`Accuracy: ${acc(predictions)}%`)
        }
    }
}).then(info => {
    const predictions = model.predict(testData);
    console.log(`Final accuracy: ${acc(predictions)}`);
})