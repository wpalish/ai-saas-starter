import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStreamResponse } from '@/lib/claude';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.prompt || typeof body.prompt !== 'string') {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const { prompt, systemPrompt, model, maxTokens } = body as {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
  };

  const stream = createStreamResponse(prompt, {
    model,
    maxTokens,
    systemPrompt: systemPrompt ?? 'You are a helpful AI assistant.',
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
