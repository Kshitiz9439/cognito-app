import { NextRequest, NextResponse } from 'next/server';
import { initializeGenkit } from '@genkit-ai/core/server';
import genkitConfig from '../../../../genkit.config';  // ✅ Correct relative path

// Import flows
import '../../../../src/ai/flows/dev';
import '../../../../src/ai/flows/genkit';

initializeGenkit(genkitConfig);

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { handler } = await import('@genkit-ai/core/server');
    return handler(req, {
      json: async () => body,
      headers: Object.fromEntries(req.headers),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
