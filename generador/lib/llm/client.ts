import { OllamaResponse, OllamaResponseSchema } from '../schema';

export interface OllamaConfig {
  url: string;
  model: string;
}

export interface OllamaChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_CONFIG: OllamaConfig = {
  url: 'http://localhost:11434',
  model: 'qwen2.5:7b-instruct',
};

export function getOllamaConfig(): OllamaConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG;
  }
  const saved = localStorage.getItem('ollamaConfig');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

export async function callOllama(
  config: OllamaConfig,
  messages: OllamaChatMessage[],
  systemPrompt: string,
  onToken?: (token: string, accumulated: string) => void
): Promise<OllamaResponse> {
  const useStream = typeof onToken === 'function';
  const payload = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: useStream,
    format: 'json',
  };

  let fullContent = '';

  try {
    const response = await fetch(`${config.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}: ${response.statusText}`);
    }

    if (useStream) {
      if (!response.body) throw new Error('No response body for stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const chunk = JSON.parse(line);
          if (chunk.message?.content) {
            fullContent += chunk.message.content;
            onToken!(chunk.message.content, fullContent);
          }
          if (chunk.done) break;
        }
      }
    } else {
      const data = await response.json();
      if (!data.message || typeof data.message.content !== 'string') {
        throw new Error('Unexpected Ollama response format');
      }
      fullContent = data.message.content;
    }

    try {
      const parsed = JSON.parse(fullContent);
      return OllamaResponseSchema.parse(parsed);
    } catch (e) {
      throw new Error(`Failed to parse Ollama JSON response: ${fullContent}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ollama error: ${error.message}`);
    }
    throw error;
  }
}

export async function testOllamaConnection(config: OllamaConfig): Promise<boolean> {
  try {
    const response = await fetch(`${config.url}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
