import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface StreamOptions {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
  temperature?: number;
}

export async function* streamCompletion(
  prompt: string,
  options: StreamOptions = {}
): AsyncGenerator<string, void, unknown> {
  const {
    model = 'claude-sonnet-4-6',
    maxTokens = 2048,
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = 0.7,
  } = options;

  const stream = await client.messages.stream({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}

export async function complete(prompt: string, options: StreamOptions = {}): Promise<string> {
  let result = '';
  for await (const chunk of streamCompletion(prompt, options)) {
    result += chunk;
  }
  return result;
}

export function createStreamResponse(
  prompt: string,
  options: StreamOptions = {}
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamCompletion(prompt, options)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
