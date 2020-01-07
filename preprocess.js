const fs = require("fs");
const R = require("ramda");
const encode = x => ({
    "Iris-setosa": [1, 0, 0],
    "Iris-versicolor": [0, 1, 0],
    "Iris-virginica": [0, 0, 1]
})[x]
let preliminaryData = R.pipe(
    R.split("\n"),
    R.map(R.pipe(
        R.split(","),
        R.splitAt(4),
        R.adjust(0, R.map(Number)),
        R.adjust(1, encode)
    ))
)(fs.readFileSync("iris.txt").toString());
preliminaryData.sort(() => Math.random() - 0.5)
const train = preliminaryData.slice(0, Math.floor(preliminaryData.length * 0.8));
const test = preliminaryData.slice(Math.floor(preliminaryData.length * 0.8));
module.exports = {
    train,
    test
}