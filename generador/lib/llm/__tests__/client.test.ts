import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callOllama, OllamaError } from '../client';

const config = { url: 'http://localhost:11434', model: 'test' };
const messages = [{ role: 'user' as const, content: 'hi' }];
const sysPrompt = 'sys';

function nonStreamResponse(content: string, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    body: null,
    json: async () => ({ message: { role: 'assistant', content } }),
    text: async () => '',
  } as unknown as Response;
}

function streamResponse(lines: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line + '\n'));
      }
      controller.close();
    },
  });
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    body: stream,
  } as unknown as Response;
}

describe('callOllama', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, 'fetch') as ReturnType<typeof vi.spyOn>;
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('non-stream happy path returns parsed OllamaResponse', async () => {
    const validJson = JSON.stringify({
      actions: [{ type: 'change_brand', brand: 'esfirma' }],
      reasoning: 'ok',
    });
    fetchMock.mockResolvedValue(nonStreamResponse(validJson));

    const result = await callOllama(config, messages, sysPrompt);

    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'change_brand', brand: 'esfirma' });
    expect(result.reasoning).toBe('ok');
  });

  it('stream path accumulates tokens via callback', async () => {
    const chunks = [
      JSON.stringify({ message: { content: '{"actio' }, done: false }),
      JSON.stringify({ message: { content: 'ns":[{"type":"change_brand","brand":"esfirma"}]}' }, done: false }),
      JSON.stringify({ message: { content: '' }, done: true }),
    ];
    fetchMock.mockResolvedValue(streamResponse(chunks));

    const tokens: string[] = [];
    const accumulated: string[] = [];
    const result = await callOllama(config, messages, sysPrompt, (tok, acc) => {
      tokens.push(tok);
      accumulated.push(acc);
    });

    expect(tokens).toEqual(['{"actio', 'ns":[{"type":"change_brand","brand":"esfirma"}]}']);
    expect(accumulated.at(-1)).toBe('{"actions":[{"type":"change_brand","brand":"esfirma"}]}');
    expect(result.actions[0]).toEqual({ type: 'change_brand', brand: 'esfirma' });
  });

  it('throws OllamaError kind=http on non-200', async () => {
    fetchMock.mockResolvedValue(nonStreamResponse('', false, 503));

    await expect(callOllama(config, messages, sysPrompt)).rejects.toMatchObject({
      kind: 'http',
    });
  });

  it('throws OllamaError kind=network on fetch reject', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(callOllama(config, messages, sysPrompt)).rejects.toMatchObject({
      kind: 'network',
    });
  });

  it('throws OllamaError kind=parse when content is not JSON', async () => {
    fetchMock.mockResolvedValue(nonStreamResponse('not json at all'));

    const err = await callOllama(config, messages, sysPrompt).catch((e) => e);
    expect(err).toBeInstanceOf(OllamaError);
    expect(err.kind).toBe('parse');
  });

  it('throws OllamaError kind=schema when JSON breaks the contract', async () => {
    const wrongShape = JSON.stringify({ actions: [{ type: 'unknown_action' }] });
    fetchMock.mockResolvedValue(nonStreamResponse(wrongShape));

    const err = await callOllama(config, messages, sysPrompt).catch((e) => e);
    expect(err).toBeInstanceOf(OllamaError);
    expect(err.kind).toBe('schema');
  });

  it('throws OllamaError kind=timeout when fetch aborts', async () => {
    fetchMock.mockImplementation((_url, init) => {
      return new Promise((_, reject) => {
        const signal = (init as RequestInit).signal!;
        signal.addEventListener('abort', () => {
          const err = new DOMException('aborted', 'AbortError');
          reject(err);
        });
      });
    });

    const err = await callOllama(config, messages, sysPrompt, undefined, 50).catch((e) => e);
    expect(err).toBeInstanceOf(OllamaError);
    expect(err.kind).toBe('timeout');
  });
});
