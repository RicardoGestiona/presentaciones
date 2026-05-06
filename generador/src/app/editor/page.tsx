'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Deck, BRANDS, Slide } from '@/lib/schema';
import { renderDeck } from '@/lib/render';

const emptyDeck: Deck = {
  name: 'nueva-presentacion',
  title: 'Mi Presentación',
  brand: 'gestiona',
  slides: [
    {
      type: 'title',
      h1: 'Título',
      subtitle: 'Subtítulo',
    },
  ],
};

type SlideFormData = Slide & { [key: string]: any };

export default function Editor() {
  const [deck, setDeck] = useState<Deck>(emptyDeck);
  const [error, setError] = useState<string | null>(null);

  const updateDeck = (updates: Partial<Deck>) => {
    setDeck({ ...deck, ...updates });
    setError(null);
  };

  const updateSlide = (idx: number, updates: Partial<Slide>) => {
    const newSlides = [...deck.slides];
    newSlides[idx] = { ...newSlides[idx], ...updates } as Slide;
    setDeck({ ...deck, slides: newSlides });
  };

  const addSlide = () => {
    setDeck({
      ...deck,
      slides: [
        ...deck.slides,
        { type: 'section', h2: 'Nueva sección' },
      ],
    });
  };

  const removeSlide = (idx: number) => {
    if (deck.slides.length > 1) {
      setDeck({
        ...deck,
        slides: deck.slides.filter((_, i) => i !== idx),
      });
    }
  };

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
      setError(err instanceof Error ? err.message : 'Error al descargar');
    }
  };

  const htmlPreview = renderDeck(deck);

  return (
    <main>
      <div className="panel" style={{ width: '45%', maxWidth: '600px', overflowY: 'auto' }}>
        <div className="panel-header">
          <Link href="/" style={{ marginBottom: '10px', display: 'inline-block' }}>
            <button style={{ background: '#666' }}>← Home</button>
          </Link>
          <h2>Editor MVP</h2>
        </div>

        <div className="panel-content">
          {/* Deck meta */}
          <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Información Presentación</h3>

            <div className="form-group">
              <label>Nombre (kebab-case)</label>
              <input
                type="text"
                value={deck.name}
                onChange={(e) => updateDeck({ name: e.target.value })}
                placeholder="mi-presentacion"
              />
            </div>

            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={deck.title}
                onChange={(e) => updateDeck({ title: e.target.value })}
                placeholder="Título de la presentación"
              />
            </div>

            <div className="form-group">
              <label>
                Marca <span style={{ color: 'red' }}>*</span>
              </label>
              <select value={deck.brand} onChange={(e) => updateDeck({ brand: e.target.value as any })}>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slides */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Slides ({deck.slides.length})</h3>
              <button onClick={addSlide} style={{ padding: '4px 12px', fontSize: '12px' }}>
                + Añadir slide
              </button>
            </div>

            {deck.slides.map((slide, idx) => (
              <div key={idx} style={{ background: '#f9f9f9', padding: '12px', marginBottom: '12px', borderRadius: '4px', borderLeft: '4px solid #0066cc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
                    Slide {idx + 1}: {slide.type}
                  </label>
                  {deck.slides.length > 1 && (
                    <button onClick={() => removeSlide(idx)} style={{ background: '#d32f2f', padding: '4px 8px', fontSize: '12px' }}>
                      Borrar
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '12px' }}>
                  {slide.type === 'title' && (
                    <>
                      <input
                        type="text"
                        value={(slide as any).h1}
                        onChange={(e) => updateSlide(idx, { h1: e.target.value } as any)}
                        placeholder="Título principal"
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        value={(slide as any).highlight || ''}
                        onChange={(e) => updateSlide(idx, { highlight: e.target.value } as any)}
                        placeholder="Destacado (opcional)"
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        value={(slide as any).subtitle || ''}
                        onChange={(e) => updateSlide(idx, { subtitle: e.target.value } as any)}
                        placeholder="Subtítulo (opcional)"
                        style={{ fontSize: '12px' }}
                      />
                    </>
                  )}

                  {slide.type === 'section' && (
                    <>
                      <input
                        type="text"
                        value={(slide as any).h2}
                        onChange={(e) => updateSlide(idx, { h2: e.target.value } as any)}
                        placeholder="Título sección"
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        value={(slide as any).subtitle || ''}
                        onChange={(e) => updateSlide(idx, { subtitle: e.target.value } as any)}
                        placeholder="Subtítulo (opcional)"
                        style={{ fontSize: '12px' }}
                      />
                    </>
                  )}

                  {slide.type === 'closing' && (
                    <>
                      <input
                        type="text"
                        value={(slide as any).h2}
                        onChange={(e) => updateSlide(idx, { h2: e.target.value } as any)}
                        placeholder="Cierre"
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        value={(slide as any).subtitle || ''}
                        onChange={(e) => updateSlide(idx, { subtitle: e.target.value } as any)}
                        placeholder="Subtítulo (opcional)"
                        style={{ fontSize: '12px' }}
                      />
                    </>
                  )}

                  {!['title', 'section', 'closing'].includes(slide.type) && (
                    <div style={{ color: '#666', fontStyle: 'italic' }}>
                      [Edición de detalles en v2. Por ahora, personaliza en JSON.]
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && <div className="error">{error}</div>}

          <button onClick={handleDownload} style={{ width: '100%' }}>
            ⬇️ Descargar HTML
          </button>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
            <p>
              <strong>MVP v1:</strong> Formulario básico + preview. Edición avanzada en v2 con chat + Ollama.
            </p>
            <p>El ZIP contiene <code>&lt;nombre&gt;/index.html</code> listo para descomprimir en la raíz del repo.</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
        <div className="panel-header">
          <h3>Preview (escala 50%)</h3>
        </div>
        <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.5)', transformOrigin: '0 0', background: 'white', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
