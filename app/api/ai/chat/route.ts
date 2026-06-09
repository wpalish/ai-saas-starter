import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/prisma';
import { checkUserCredits, deductCredits } from '@/lib/credits';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages, systemPrompt } = await req.json();

    // Check user has enough credits
    const hasCredits = await checkUserCredits(userId, 1);
    if (!hasCredits) {
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: systemPrompt || 'You are a helpful AI assistant.',
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Deduct credits after successful request
    await deductCredits(userId, 1);

    // Log conversation to DB
    await db.conversation.create({
      data: {
        userId,
        messages: JSON.stringify(messages),
        tokensUsed: 0, // Updated on stream end
      },
    });

    return new Response(stream.toReadableStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[AI_CHAT_ERROR]', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
