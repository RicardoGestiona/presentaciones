'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Settings() {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.1:8b');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('ollamaConfig');
    if (saved) {
      const { url, model } = JSON.parse(saved);
      setOllamaUrl(url);
      setOllamaModel(model);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      'ollamaConfig',
      JSON.stringify({ url: ollamaUrl, model: ollamaModel })
    );
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleTest = async () => {
    setStatus('testing');
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <main>
      <div className="panel" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div className="panel-header">
          <Link href="/">
            <button style={{ background: '#666', marginBottom: '10px' }}>← Atrás</button>
          </Link>
          <h2>Configuración</h2>
        </div>
        <div className="panel-content">
          <h3 style={{ marginBottom: '20px' }}>Ollama (v2 — próximamente)</h3>
          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            Cuando esté disponible el chat (v2), necesitaremos conectar a tu Ollama local para edits
            conversacionales.
          </p>

          <div className="form-group">
            <label>URL de Ollama</label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
            />
          </div>

          <div className="form-group">
            <label>Modelo (p.ej. qwen2.5-coder:7b, llama3.1:8b)</label>
            <input
              type="text"
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              placeholder="llama3.1:8b"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave}>Guardar</button>
            <button onClick={handleTest} style={{ background: '#666' }}>
              Probar conexión
            </button>
          </div>

          {status === 'success' && (
            <div className="success">✓ Configuración guardada / Conexión OK</div>
          )}
          {status === 'error' && (
            <div className="error">✗ Error de conexión. Verifica URL y que Ollama esté corriendo</div>
          )}
          {status === 'testing' && <div style={{ color: '#0066cc' }}>Probando...</div>}

          <hr style={{ margin: '40px 0', borderColor: '#e0e0e0' }} />

          <h3 style={{ marginBottom: '20px' }}>Información</h3>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
            <strong>CORS:</strong> Ollama debe estar configurado con{' '}
            <code
              style={{
                background: '#f0f0f0',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
              }}
            >
              OLLAMA_ORIGINS=*
            </code>
            .
            <br />
            <strong>Comandos:</strong>
            <br />
            <code
              style={{
                background: '#f0f0f0',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                display: 'block',
                marginTop: '5px',
                wordBreak: 'break-all',
              }}
            >
              OLLAMA_ORIGINS=* ollama serve
            </code>
            <code
              style={{
                background: '#f0f0f0',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                display: 'block',
                marginTop: '5px',
                wordBreak: 'break-all',
              }}
            >
              ollama pull qwen2.5-coder:7b
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}
