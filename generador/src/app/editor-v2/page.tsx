'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Deck, DeckSchema, ImageAsset, Slide } from '@/lib/schema';
import { renderDeck } from '@/lib/render';
import { ChatPanel } from '@/components/ChatPanel';

const STORAGE_KEY = 'currentDeck:v2';
const MAX_IMAGES = 10;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = /^image\/(png|jpeg|jpg|webp|gif|svg\+xml)$/;

function slideSummary(slide: Slide): string {
  if (slide.type === 'title') return slide.h1;
  if (slide.type === 'section' || slide.type === 'closing') return slide.h2;
  return slide.title ?? slide.type;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

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
  images: [],
};

export default function EditorV2() {
  const [deck, setDeck] = useState<Deck>(emptyDeck);
  const [imageError, setImageError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = DeckSchema.parse(JSON.parse(saved));
        setDeck(parsed);
      }
    } catch {
      // Corrupt or stale data — keep emptyDeck
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
    } catch {
      // Quota exceeded — ignore silently for now
    }
  }, [deck, hydrated]);

  const htmlPreview = renderDeck(deck);

  const handleAddImage = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageError(null);

    const remaining = MAX_IMAGES - (deck.images?.length ?? 0);
    if (remaining <= 0) {
      setImageError(`Máximo ${MAX_IMAGES} imágenes por presentación`);
      return;
    }

    const incoming: ImageAsset[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!ALLOWED_MIME.test(file.type)) {
        setImageError(`Tipo no permitido: ${file.name} (${file.type || 'desconocido'})`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setImageError(`${file.name} supera 5MB`);
        continue;
      }
      try {
        const dataUrl = await readFileAsDataURL(file);
        incoming.push({
          id: crypto.randomUUID(),
          filename: file.name,
          dataUrl,
        });
      } catch {
        setImageError(`No se pudo leer ${file.name}`);
      }
    }

    if (incoming.length > 0) {
      setDeck({ ...deck, images: [...(deck.images ?? []), ...incoming] });
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setDeck({ ...deck, images: (deck.images ?? []).filter((img) => img.id !== id) });
  };

  const handleRemoveSlide = (idx: number) => {
    if (deck.slides.length <= 1) return;
    setDeck({ ...deck, slides: deck.slides.filter((_, i) => i !== idx) });
  };

  const handleNewDeck = () => {
    if (!confirm('¿Descartar la presentación actual y empezar de cero?')) return;
    setDeck(emptyDeck);
    setImageError(null);
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    setImageError(null);
    try {
      let json: string;
      if (file.name.toLowerCase().endsWith('.zip')) {
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(file);
        const entry = zip.file(/(^|\/)deck\.json$/i)[0];
        if (!entry) throw new Error('ZIP no contiene deck.json');
        json = await entry.async('string');
      } else {
        json = await file.text();
      }
      const parsed = DeckSchema.parse(JSON.parse(json));
      setDeck(parsed);
    } catch (err) {
      setImageError(`Importación falló: ${err instanceof Error ? err.message : 'desconocido'}`);
    } finally {
      if (importInput.current) importInput.current.value = '';
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deck),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(`ZIP ${res.status}: ${detail.slice(0, 200)}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Error descargando');
    } finally {
      setDownloading(false);
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
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={handleNewDeck}
              style={{ flex: 1, padding: '4px 8px', fontSize: '11px', background: '#666' }}
            >
              + Nueva
            </button>
            <button
              type="button"
              onClick={() => importInput.current?.click()}
              style={{ flex: 1, padding: '4px 8px', fontSize: '11px', background: '#666' }}
            >
              📂 Cargar
            </button>
            <input
              ref={importInput}
              type="file"
              accept=".json,.zip,application/json,application/zip"
              onChange={(e) => handleImport(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
          </div>
          <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', maxHeight: '160px', overflowY: 'auto', borderTop: '1px solid #eee' }}>
            {deck.slides.map((slide, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  padding: '4px 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span style={{ color: '#999', width: '20px', textAlign: 'right' }}>{idx + 1}.</span>
                <span style={{ color: '#666', minWidth: '60px' }}>{slide.type}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {slideSummary(slide)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlide(idx)}
                  disabled={deck.slides.length <= 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: deck.slides.length <= 1 ? '#ccc' : '#d32f2f',
                    cursor: deck.slides.length <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    padding: 0,
                  }}
                  aria-label={`Eliminar slide ${idx + 1}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ChatPanel deck={deck} onDeckUpdate={setDeck} />

        <div style={{ borderTop: '1px solid #ddd', padding: '12px', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '12px', color: '#666' }}>
              Imágenes ({deck.images?.length ?? 0}/{MAX_IMAGES})
            </strong>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={(deck.images?.length ?? 0) >= MAX_IMAGES}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              + Añadir
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              multiple
              onChange={(e) => handleAddImage(e.target.files)}
              style={{ display: 'none' }}
            />
          </div>
          {deck.images && deck.images.length > 0 && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: '120px', overflowY: 'auto' }}>
              {deck.images.map((img) => (
                <li
                  key={img.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    padding: '4px 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <img
                    src={img.dataUrl}
                    alt={img.filename}
                    style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.filename}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                    aria-label={`Eliminar ${img.filename}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          {imageError && (
            <p style={{ color: '#d32f2f', fontSize: '11px', margin: '6px 0 0' }}>{imageError}</p>
          )}
        </div>

        <div style={{ borderTop: '1px solid #ddd', padding: '15px', background: '#fafafa' }}>
          <button onClick={handleDownload} disabled={downloading} style={{ width: '100%' }}>
            {downloading ? '⏳ Generando ZIP...' : '⬇️ Descargar ZIP'}
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
