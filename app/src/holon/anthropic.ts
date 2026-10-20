// app/src/holon/anthropic.ts
// Anthropic provider. Uses the official SDK. Two provider-specific features stay in here: prompt caching of the
// system prompt, and server-side refusal fallback (`fallbacks: "default"`), which re-runs a request the model
// declines on a fallback model inside the same call.

import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, ChatProvider, ChatRequest, ChatResponse, StopReason } from './provider';

type Block = Anthropic.Beta.BetaContentBlock;

let client: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!client) {
    // Reads ANTHROPIC_API_KEY. A key not scoped to a workspace needs the workspace named on every request
    const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
    client = new Anthropic(workspace ? { defaultHeaders: { 'anthropic-workspace-id': workspace } } : {});
  }
  return client;
}

export function anthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function toParams(messages: ChatMessage[]): Anthropic.Beta.BetaMessageParam[] {
  return messages.map((m): Anthropic.Beta.BetaMessageParam => {
    if (m.role === 'user') return { role: 'user', content: m.text };
    if (m.role === 'tool-results') {
      return {
        role: 'user',
        content: m.results.map((r) => ({
          type: 'tool_result' as const,
          tool_use_id: r.callId,
          content: r.content,
          is_error: r.isError || undefined,
        })),
      };
    }
    // Replay the provider's own content blocks unchanged (thinking blocks must come back as they were)
    if (Array.isArray(m.replay)) return { role: 'assistant', content: m.replay as Block[] };
    return {
      role: 'assistant',
      content: [
        ...(m.text ? [{ type: 'text' as const, text: m.text }] : []),
        ...m.toolCalls.map((c) => ({ type: 'tool_use' as const, id: c.id, name: c.name, input: c.input })),
      ],
    };
  });
}

function stopOf(reason: string | null): StopReason {
  switch (reason) {
    case 'end_turn': return 'end';
    case 'tool_use': return 'tool-use';
    case 'max_tokens': return 'max-tokens';
    case 'refusal': return 'refusal';
    default: return 'other';
  }
}

export const anthropicProvider: ChatProvider = {
  id: 'anthropic',
  async complete(req: ChatRequest): Promise<ChatResponse> {
    const response = await anthropic().beta.messages.create({
      model: req.model,
      max_tokens: req.maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: req.effort ? { effort: req.effort } : undefined,
      system: [{ type: 'text', text: req.system, cache_control: { type: 'ephemeral' } }],
      tools: req.tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema as Anthropic.Beta.BetaTool.InputSchema,
      })),
      messages: toParams(req.messages),
    });

    let text = '';
    const toolCalls: ChatResponse['toolCalls'] = [];
    for (const block of response.content) {
      if (block.type === 'text') text += block.text;
      else if (block.type === 'tool_use') {
        toolCalls.push({ id: block.id, name: block.name, input: (block.input ?? {}) as Record<string, unknown> });
      }
    }
    return {
      text,
      toolCalls,
      stop: stopOf(response.stop_reason),
      usage: {
        inputTokens: response.usage.input_tokens,
        cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
        cacheWriteTokens: response.usage.cache_creation_input_tokens ?? 0,
        outputTokens: response.usage.output_tokens,
      },
      model: response.model,
      replay: response.content,
    };
  },
};

/** One registry, so agents look providers up by the id in their model settings */
export const providers: Record<string, ChatProvider> = { anthropic: anthropicProvider };
