import { z } from 'zod';
import { OllamaResponse, OllamaResponseSchema } from '../schema';

export interface OllamaConfig {
  url: string;
  model: string;
}

export interface OllamaChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type OllamaErrorKind = 'network' | 'timeout' | 'http' | 'parse' | 'schema' | 'unknown';

export class OllamaError extends Error {
  constructor(
    public kind: OllamaErrorKind,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'OllamaError';
  }
}

const DEFAULT_CONFIG: OllamaConfig = {
  url: 'http://localhost:11434',
  model: 'qwen2.5:7b-instruct',
};

const DEFAULT_TIMEOUT_MS = 180_000;

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
  onToken?: (token: string, accumulated: string) => void,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${config.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new OllamaError('timeout', `Ollama no respondió en ${timeoutMs / 1000}s`);
    }
    const msg = err instanceof Error ? err.message : 'fetch failed';
    throw new OllamaError('network', `No se pudo conectar a ${config.url}`, msg);
  }

  if (!response.ok) {
    clearTimeout(timer);
    const body = await response.text().catch(() => '');
    throw new OllamaError(
      'http',
      `Ollama devolvió ${response.status} ${response.statusText}`,
      body.slice(0, 500)
    );
  }

  try {
    if (useStream) {
      if (!response.body) {
        throw new OllamaError('network', 'Ollama no devolvió cuerpo de respuesta para stream');
      }
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
          let chunk: { message?: { content?: string }; done?: boolean };
          try {
            chunk = JSON.parse(line);
          } catch {
            throw new OllamaError('parse', 'Línea de stream NDJSON inválida', line.slice(0, 200));
          }
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
        throw new OllamaError('parse', 'Formato de respuesta Ollama inesperado');
      }
      fullContent = data.message.content;
    }
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof OllamaError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new OllamaError('timeout', `Stream interrumpido tras ${timeoutMs / 1000}s`);
    }
    const msg = err instanceof Error ? err.message : String(err);
    throw new OllamaError('network', 'Error leyendo respuesta de Ollama', msg);
  } finally {
    clearTimeout(timer);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(fullContent);
  } catch {
    throw new OllamaError(
      'parse',
      'Modelo no devolvió JSON válido',
      fullContent.slice(0, 500)
    );
  }

  try {
    return OllamaResponseSchema.parse(parsedJson);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new OllamaError(
        'schema',
        'JSON no cumple el contrato de actions',
        JSON.stringify(err.issues, null, 2).slice(0, 500)
      );
    }
    throw new OllamaError('unknown', 'Error de validación inesperado', String(err));
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
