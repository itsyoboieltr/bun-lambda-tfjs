import { type Serve } from 'bun';
import { model } from './model';
import { tensor, enableProdMode } from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

enableProdMode();

export default {
  async fetch() {
    const result = model.predict(tensor([Math.random()]));
    if (Array.isArray(result)) throw new Error('Expected a single tensor');
    const prediction = await result.data();
    return new Response(prediction.toString());
  },
} satisfies Serve;
