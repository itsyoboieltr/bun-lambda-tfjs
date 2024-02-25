import { sequential, layers } from '@tensorflow/tfjs-layers';

export const model = sequential({
  layers: [
    layers.dense({ units: 128, activation: 'relu', inputShape: [1] }),
    layers.dense({ units: 3 }),
    layers.softmax(),
  ],
});

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['categoricalAccuracy'],
});
