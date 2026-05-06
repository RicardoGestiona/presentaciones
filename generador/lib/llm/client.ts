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
  model: 'llama3.1:8b',
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
  systemPrompt: string
): Promise<OllamaResponse> {
  const payload = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: false,
    format: 'json',
  };

  try {
    const response = await fetch(`${config.url}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Ollama returns { model, created_at, message: { role, content }, done }
    // We need to parse the content as JSON
    if (data.message && typeof data.message.content === 'string') {
      try {
        const parsed = JSON.parse(data.message.content);
        return OllamaResponseSchema.parse(parsed);
      } catch (e) {
        throw new Error(`Failed to parse Ollama JSON response: ${data.message.content}`);
      }
    }

    throw new Error('Unexpected Ollama response format');
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
