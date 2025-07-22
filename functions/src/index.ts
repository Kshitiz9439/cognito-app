import * as functions from 'firebase-functions';
import { initializeGenkit } from '@genkit-ai/core/server/firebase';
import genkitConfig from '../../genkit.config';
import '../../src/ai/flows/dev';     // assuming your Genkit flows are here
import '../../src/ai/flows/genkit';  // adjust if needed

initializeGenkit(genkitConfig);

export const genkit = functions.https.onRequest(async (req, res) => {
  const { handler } = await import('@genkit-ai/core/server');
  return handler(req, res);
});
