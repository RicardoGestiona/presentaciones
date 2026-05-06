'use client';

import { useState, useRef, useEffect } from 'react';
import { Deck, Action } from '@/lib/schema';
import { callOllama, getOllamaConfig, testOllamaConnection, type OllamaChatMessage } from '@/lib/llm/client';
import { buildSystemPrompt } from '@/lib/llm/system-prompt';
import { applyActions } from '@/lib/llm/apply-actions';

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
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const config = getOllamaConfig();
      const ok = await testOllamaConnection(config);
      setConnected(ok);
      if (!ok) {
        setError(`Ollama no disponible en ${config.url}. Configura en /settings.`);
      }
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

      const response = await callOllama(config, ollamaMessages, systemPrompt);

      // Apply actions to deck
      const updatedDeck = applyActions(deck, response.actions);
      onDeckUpdate(updatedDeck);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reasoning || 'Cambios aplicados',
        actions: response.actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
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
          <div style={{ color: '#0066cc', fontSize: '14px' }}>
            Procesando...
          </div>
        )}
        {error && (
          <div style={{ color: '#d32f2f', fontSize: '14px', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>
            {error}
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
