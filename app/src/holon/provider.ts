// app/src/holon/provider.ts
// The provider interface. Agent code talks only to these types, so a second provider (for example a server using
// the widely supported OpenAI-compatible chat format, which many open-source model servers speak) can be added
// without changing agent code. Provider-specific features, such as prompt caching, stay inside each provider.

export interface ToolSpec {
  name: string;
  description: string;
  /** JSON Schema for the tool's input */
  inputSchema: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResult {
  callId: string;
  content: string;
  isError?: boolean;
}

export type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'tool-results'; results: ToolResult[] }
  /** `replay` is the provider's own record of the turn, passed back unchanged on the next request (it may hold
   * reasoning blocks the provider requires to be returned as they were). Other providers ignore it. */
  | { role: 'assistant'; text: string; toolCalls: ToolCall[]; replay?: unknown };

export interface ChatRequest {
  model: string;
  /** Stable instructions and map: providers may cache this */
  system: string;
  messages: ChatMessage[];
  tools: ToolSpec[];
  maxTokens: number;
  effort?: 'low' | 'medium' | 'high';
}

export type StopReason = 'end' | 'tool-use' | 'max-tokens' | 'refusal' | 'other';

export interface Usage {
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
}

export interface ChatResponse {
  text: string;
  toolCalls: ToolCall[];
  stop: StopReason;
  usage: Usage;
  /** The model that actually served the request (may differ after a provider-side fallback) */
  model: string;
  replay?: unknown;
}

export interface ChatProvider {
  readonly id: string;
  complete(req: ChatRequest): Promise<ChatResponse>;
}
