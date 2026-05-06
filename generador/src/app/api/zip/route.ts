import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { renderDeck } from '@/lib/render';
import { validateDeck } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const deck = validateDeck(body);

    // Generate HTML
    const html = renderDeck(deck);

    // Create ZIP
    const zip = new JSZip();
    const deckFolder = zip.folder(deck.name);
    if (!deckFolder) {
      throw new Error('Failed to create folder in ZIP');
    }

    // Add index.html
    deckFolder.file('index.html', html);

    // Add images if any
    if (deck.images && deck.images.length > 0) {
      const imgFolder = deckFolder.folder('img');
      if (imgFolder) {
        for (const img of deck.images) {
          // Remove data URL prefix and add as binary
          const base64 = img.dataUrl.split(',')[1];
          if (base64) {
            imgFolder.file(img.filename, base64, { base64: true });
          }
        }
      }
    }

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${deck.name}.zip"`,
      },
    });
  } catch (error) {
    console.error('ZIP generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
