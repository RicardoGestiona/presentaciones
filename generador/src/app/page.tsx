'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="panel" style={{ width: '100%' }}>
        <div className="panel-header">
          <h1>Generador esPublico</h1>
        </div>
        <div className="panel-content">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#006d85' }}>Bienvenido</h2>
            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              Crea presentaciones corporativas esPublico sin editar HTML. Rellena un formulario,
              obtén el index.html generado, y refina con un asistente conversacional.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/editor">
                <button>Crear nueva presentación</button>
              </Link>
              <Link href="/settings">
                <button style={{ background: '#666' }}>Configuración</button>
              </Link>
            </div>

            <hr style={{ margin: '40px 0', borderColor: '#e0e0e0' }} />

            <h3 style={{ marginBottom: '10px' }}>Cómo funciona</h3>
            <ol style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>
                <strong>Formulario:</strong> proporciona el nombre de la presentación, marca (obligatorio)
                y slides con su contenido.
              </li>
              <li>
                <strong>Preview:</strong> visualiza el deck en tiempo real.
              </li>
              <li>
                <strong>Chat (v2):</strong> pide cambios como "haz más oscura la slide 2" y el asistente
                los aplica.
              </li>
              <li>
                <strong>Descarga:</strong> obtén un ZIP listo para descomprimir en la raíz del repo.
              </li>
            </ol>

            <hr style={{ margin: '40px 0', borderColor: '#e0e0e0' }} />

            <h3 style={{ marginBottom: '10px' }}>Requisitos</h3>
            <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>
                <strong>MVP (v1):</strong> formulario + download. Sin LLM.
              </li>
              <li>
                <strong>v2 (próximamente):</strong> chat con Ollama local para edits conversacionales.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
