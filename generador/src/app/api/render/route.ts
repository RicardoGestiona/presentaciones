import { NextRequest, NextResponse } from 'next/server';
import { renderDeck } from '@/lib/render';
import { validateDeck } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const deck = validateDeck(body);
    const html = renderDeck(deck);

    return NextResponse.json({ html });
  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
