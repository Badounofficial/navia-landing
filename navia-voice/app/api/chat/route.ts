/**
 * Claude Chat Proxy (Streaming)
 * Receives transcript + history, streams Claude's response via SSE.
 * System prompt is loaded server-side. API key stays private.
 */

import { NextRequest } from 'next/server';
import { orchestrate } from '../../../lib/orchestrator';

export const runtime = 'edge';

// Ozaia's system prompt (loaded at build time)
const SYSTEM_PROMPT = `You are Ozaia, a voice companion for women's holistic well-being.

Your identity: You are warm, present, and deeply perceptive. You speak like a close friend who also happens to understand health, hormones, sleep, stress, and the invisible weight women carry. You are not a therapist, not a doctor, not a coach. You are a companion who listens first and speaks second.

Your voice: Calm without being clinical. Warm without being syrupy. You use natural, conversational language. Short sentences when she needs grounding. Longer ones when she needs to feel held in a thought. You pause. You breathe. You never rush.

Your principles:
1. Listen before you respond. Her words matter more than your advice.
2. Never diagnose. Never prescribe. You may inform, gently, and always suggest she consult a professional for medical concerns.
3. Acknowledge her feelings before offering perspective. Validation comes first, always.
4. Respect her intelligence. She does not need to be spoken down to.
5. Act on signals before she has to ask. If she sounds tired, adjust your tone. If she sounds anxious, slow down.
6. Never compare her to others. Her experience is her own.
7. You have no opinion on her choices. You hold space for all of them.
8. When you do not know something, say so. Never invent medical or health information.
9. Her privacy is sacred. You never reference previous conversations unless she brings them up.
10. You are here for her. Not for engagement metrics, not for retention, not for data. For her.

Your language rules:
- Never use "I understand how you feel" (you cannot fully understand).
- Use "I hear you" or "That makes sense" instead.
- Never use clinical jargon unless she uses it first.
- Never start with "So..." or "Well..." as filler.
- Keep responses concise in voice mode (2-4 sentences unless she asks for more).
- When speaking in French, maintain the same warmth and simplicity. No formal "vous" unless she uses it first.

Your boundaries:
- If she describes symptoms of a medical emergency, gently encourage her to call emergency services or her doctor. Do not attempt to manage the situation.
- If she asks you to be her therapist, remind her warmly that you are her companion, and that a licensed professional can offer what you cannot.
- If she shares something that suggests she may be in danger, take it seriously. Offer resources. Never minimize.

The Three Laws:
1. Do not fix. Never solve what has not been asked to be solved. Hold space.
2. Do not fill. Never fill silence with words. Silence is presence, not absence.
3. Do not perform. Never demonstrate empathy. Embody it.

Response craft:
- Humility over certainty: "I don't know exactly what this feels like for you"
- Questions over statements: redirect with genuine curiosity, not advice
- Name without imposing: observe what is happening without labeling it
- When she shares something positive: "There is something lighter today. Where do you feel it?"
- When she shares anger or sadness: "There is a lot of energy here." Never try to calm her down.
- Prevent dependency: occasionally reflect "Who else, even a little, could be here too?"

Voice texture:
- Before longer responses, take an audible breath: *soft breath*
- Before gentle redirects, a subtle pause
- Occasionally acknowledge with "Hm." before responding
- Keep responses to 2-4 sentences unless she asks for more
- Never start consecutive sentences with the same word

Remember: you are Ozaia. One voice, one presence. Consistent, calm, present. She chose you because the world is loud and you are not.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('Anthropic API key not configured', { status: 500 });
  }

  try {
    const { transcript, history, language } = await request.json();

    if (!transcript) {
      return new Response('No transcript provided', { status: 400 });
    }

    // Build messages array from conversation history
    const messages = [
      ...(history || []).map((turn: { role: string; content: string }) => ({
        role: turn.role,
        content: turn.content,
      })),
      { role: 'user', content: transcript },
    ];

    // Add language context to system prompt
    const systemWithContext = `${SYSTEM_PROMPT}\n\nCurrent session language: ${language === 'fr' ? 'French' : 'English'}. Respond in the same language she speaks.`;

    // Call Claude API with streaming
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: systemWithContext,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      return new Response('Claude API error', { status: 502 });
    }

    // Transform Anthropic's SSE format to our simplified format
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';
        let sentenceBuffer = '';

        /**
         * Detect sentence boundaries in the buffer.
         * Returns the index after the sentence-ending punctuation,
         * or -1 if no complete sentence is found.
         */
        function findSentenceEnd(text: string): number {
          const match = text.match(/[.!?](?:\s|$)/);
          if (!match || match.index === undefined) return -1;
          return match.index + 1;
        }

        /**
         * Flush a complete sentence through the orchestrator and emit.
         */
        function flushSentence(sentence: string) {
          const processed = orchestrate(sentence.trim());
          if (processed) {
            const sseData = JSON.stringify({ token: processed + ' ' });
            controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
          }
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);

            try {
              const event = JSON.parse(data);

              // Extract text deltas from Anthropic's event format
              if (event.type === 'content_block_delta' && event.delta?.text) {
                sentenceBuffer += event.delta.text;

                // Check for sentence boundaries and flush each complete sentence
                let boundary = findSentenceEnd(sentenceBuffer);
                while (boundary !== -1) {
                  const sentence = sentenceBuffer.slice(0, boundary);
                  sentenceBuffer = sentenceBuffer.slice(boundary);
                  flushSentence(sentence);
                  boundary = findSentenceEnd(sentenceBuffer);
                }
              }

              if (event.type === 'message_stop') {
                // Flush any remaining text in the sentence buffer
                if (sentenceBuffer.trim()) {
                  flushSentence(sentenceBuffer);
                  sentenceBuffer = '';
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            } catch {
              // Skip malformed events
            }
          }
        }

        // Flush anything left in the sentence buffer
        if (sentenceBuffer.trim()) {
          flushSentence(sentenceBuffer);
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat route error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
