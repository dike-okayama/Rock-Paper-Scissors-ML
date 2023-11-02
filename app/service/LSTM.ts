import * as tf from "@tensorflow/tfjs";

const LOOK_BACK = 3;
const OUTPUT_LENGTH = 3; // [rock_probability, scissors_probability, paper_probability]

const model = tf.sequential({
  layers: [
    tf.layers.lstm({
      units: 10,
      inputShape: [1, LOOK_BACK],
      returnSequences: false,
    }),
    tf.layers.dense({ units: OUTPUT_LENGTH, activation: "softmax" }),
  ],
});

model.compile({
  loss: "categoricalCrossentropy",
  optimizer: "adam",
  metrics: ["accuracy"],
});

const preprocessData = (data: number[][]) => {
  const xs = [];
  const ys = [];
  for (let i = LOOK_BACK; i < data.length; i++) {
    const xSlice = data.slice(i - LOOK_BACK, i).map((d) => d[0]);
    const y = data[i][1];
    xs.push([xSlice]);
    ys.push(y);
  }
  const xsTensor = tf.tensor3d(xs, [xs.length, 1, LOOK_BACK]);
  const ysTensor = tf.oneHot(tf.tensor1d(ys, "int32"), OUTPUT_LENGTH);

  return { xsTensor, ysTensor };
};

const train = ({
  xsTensor,
  ysTensor,
}: {
  xsTensor: tf.Tensor3D;
  ysTensor: tf.Tensor<tf.Rank>;
}) => {
  model.fit(xsTensor, ysTensor, { epochs: 3 }).then((info) => {
    console.log("Final accuracy", info.history.acc);
  });
};

const predictNextHand = (inputs: number[]) => {
  const inputData = tf.tensor3d([[inputs]], [1, 1, LOOK_BACK]);
  const output = model.predict(inputData) as tf.Tensor1D;
  console.log(output);
  return output.argMax().dataSync()[0];
};

export { preprocessData, train, predictNextHand };
