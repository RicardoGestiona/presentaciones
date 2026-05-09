'use client';

import { useState, useRef, useEffect } from 'react';
import { Deck, Action } from '@/lib/schema';
import {
  callOllama,
  getOllamaConfig,
  testOllamaConnection,
  OllamaError,
  type OllamaChatMessage,
  type OllamaErrorKind,
} from '@/lib/llm/client';
import { buildSystemPrompt } from '@/lib/llm/system-prompt';
import { applyActions } from '@/lib/llm/apply-actions';

interface ChatError {
  kind: OllamaErrorKind | 'apply';
  title: string;
  body: string;
  details?: string;
}

const ERROR_HINTS: Record<ChatError['kind'], string> = {
  network: 'Verifica que Ollama esté corriendo: OLLAMA_ORIGINS=* ollama serve',
  timeout: 'Modelo demasiado lento. Prueba con uno más pequeño en /settings.',
  http: 'Ollama rechazó la petición. Revisa el modelo configurado.',
  parse: 'El modelo devolvió texto malformado. Reintenta o usa un modelo más capaz.',
  schema: 'El modelo respondió con tipos inválidos. Reintenta o ajusta el prompt.',
  apply: 'No se pudo aplicar el cambio al deck. La acción pasó schema pero rompió un invariante.',
  unknown: 'Error inesperado. Revisa la consola del navegador.',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: Action[];
}

interface Props {
  deck: Deck;
  onDeckUpdate: (deck: Deck) => void;
}

export function ChatPanel({ deck, onDeckUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [connected, setConnected] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const config = getOllamaConfig();
      const ok = await testOllamaConnection(config);
      setConnected(ok);
    };
    checkConnection();
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !connected || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setStreamingContent('');

    try {
      const config = getOllamaConfig();
      const systemPrompt = buildSystemPrompt();

      const ollamaMessages: OllamaChatMessage[] = messages
        .filter((m) => m.role !== 'assistant' || m.actions)
        .map((m) => ({
          role: m.role,
          content: m.role === 'user' ? m.content : JSON.stringify({ actions: m.actions }),
        }));
      ollamaMessages.push({ role: 'user', content: userMessage.content });

      let response;
      try {
        response = await callOllama(
          config,
          ollamaMessages,
          systemPrompt,
          (_token, accumulated) => setStreamingContent(accumulated)
        );
      } catch (err) {
        if (err instanceof OllamaError) {
          setError({
            kind: err.kind,
            title: err.message,
            body: ERROR_HINTS[err.kind],
            details: err.details,
          });
        } else {
          setError({
            kind: 'unknown',
            title: err instanceof Error ? err.message : 'Error desconocido',
            body: ERROR_HINTS.unknown,
          });
        }
        return;
      }

      try {
        const updatedDeck = applyActions(deck, response.actions);
        onDeckUpdate(updatedDeck);
      } catch (err) {
        setError({
          kind: 'apply',
          title: err instanceof Error ? err.message : 'Error aplicando acciones',
          body: ERROR_HINTS.apply,
          details: JSON.stringify(response.actions, null, 2),
        });
        return;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reasoning || 'Cambios aplicados',
        actions: response.actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
      setStreamingContent('');
    }
  };

  if (!connected) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <h3 style={{ marginBottom: '10px' }}>Ollama no conectado</h3>
        <p style={{ fontSize: '14px', marginBottom: '15px', maxWidth: '300px' }}>
          El chat está disponible en v2. Configura Ollama en la sección de ajustes.
        </p>
        <code style={{ background: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          OLLAMA_ORIGINS=* ollama serve
        </code>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#fafafa' }}>
        {messages.length === 0 && (
          <div style={{ color: '#999', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Conectado a Ollama. Describe cambios en la presentación.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '15px' }}>
            <div
              style={{
                background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderLeft: `4px solid ${msg.role === 'user' ? '#0066cc' : '#666'}`,
                padding: '10px',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <strong style={{ fontSize: '12px', color: '#666' }}>
                {msg.role === 'user' ? 'Tú' : 'Asistente'}
              </strong>
              <p style={{ margin: '5px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {msg.content}
              </p>
              {msg.actions && msg.actions.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#2e7d32' }}>
                  ✓ {msg.actions.length} cambio{msg.actions.length > 1 ? 's' : ''} aplicado{msg.actions.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ marginBottom: '15px' }}>
            <div
              style={{
                background: '#f5f5f5',
                borderLeft: '4px solid #999',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <strong style={{ fontSize: '12px', color: '#666' }}>
                Asistente {streamingContent ? '(escribiendo...)' : '(pensando...)'}
              </strong>
              <p
                style={{
                  margin: '5px 0 0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: streamingContent ? 'monospace' : 'inherit',
                  fontSize: streamingContent ? '12px' : '14px',
                  color: streamingContent ? '#444' : '#0066cc',
                }}
              >
                {streamingContent || '⏳'}
              </p>
            </div>
          </div>
        )}
        {error && (
          <div
            role="alert"
            style={{
              fontSize: '13px',
              background: '#ffebee',
              borderLeft: '4px solid #d32f2f',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '15px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <strong style={{ color: '#d32f2f' }}>
                ⚠ Error [{error.kind}]: {error.title}
              </strong>
              <button
                onClick={() => setError(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', fontSize: '16px', padding: '0 4px' }}
                aria-label="Cerrar error"
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '6px 0 0', color: '#444' }}>{error.body}</p>
            {error.details && (
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#666' }}>Detalles</summary>
                <pre
                  style={{
                    margin: '6px 0 0',
                    padding: '8px',
                    background: '#fff',
                    borderRadius: '3px',
                    fontSize: '11px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.details}
                </pre>
              </details>
            )}
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      <div style={{ borderTop: '1px solid #ddd', padding: '15px', background: 'white' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe un cambio..."
            disabled={loading || !connected}
            style={{ flex: 1, fontSize: '14px' }}
          />
          <button onClick={handleSendMessage} disabled={loading || !connected || !input.trim()} style={{ padding: '8px 16px' }}>
            {loading ? '⏳' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
}
