'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Deck, BRANDS } from '@/lib/schema';
import { renderDeck } from '@/lib/render';
import { ChatPanel } from '@/components/ChatPanel';

const emptyDeck: Deck = {
  name: 'nueva-presentacion',
  title: 'Mi Presentación',
  brand: 'gestiona',
  slides: [
    {
      type: 'title',
      h1: 'Bienvenido',
      subtitle: 'Usa el chat para editar',
    },
  ],
};

export default function EditorV2() {
  const [deck, setDeck] = useState<Deck>(emptyDeck);

  const htmlPreview = renderDeck(deck);

  const handleDownload = () => {
    try {
      const html = renderDeck(deck);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.name}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <main style={{ gap: 0 }}>
      <div className="panel" style={{ width: '350px', background: 'white', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header">
          <Link href="/" style={{ marginBottom: '10px', display: 'inline-block' }}>
            <button style={{ background: '#666', padding: '6px 12px', fontSize: '12px' }}>← Home</button>
          </Link>
          <h2 style={{ marginTop: '10px' }}>v2: Chat</h2>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <p style={{ margin: '5px 0' }}>{deck.name}</p>
            <p style={{ margin: '5px 0' }}>Marca: {deck.brand}</p>
            <p style={{ margin: '5px 0' }}>Slides: {deck.slides.length}</p>
          </div>
        </div>

        <ChatPanel deck={deck} onDeckUpdate={setDeck} />

        <div style={{ borderTop: '1px solid #ddd', padding: '15px', background: '#fafafa' }}>
          <button onClick={handleDownload} style={{ width: '100%' }}>
            ⬇️ Descargar
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
        <div className="panel-header">
          <h3>Preview (50%)</h3>
        </div>
        <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.5)', transformOrigin: '0 0', background: 'white', borderRadius: '4px' }}>
            <iframe
              srcDoc={htmlPreview}
              style={{
                width: '1280px',
                height: '720px',
                border: 'none',
                display: 'block',
              }}
              title="Preview"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
