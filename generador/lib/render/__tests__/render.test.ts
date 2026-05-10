import { describe, it, expect } from 'vitest';
import { renderDeck, renderSlide } from '../index';
import type { Deck, Slide } from '../../schema';

describe('renderDeck', () => {
  it('generates valid HTML with DOCTYPE', () => {
    const deck: Deck = {
      name: 'test-deck',
      title: 'Test Presentation',
      brand: 'gestiona',
      slides: [
        {
          type: 'title',
          h1: 'Hello',
          subtitle: 'World',
        },
      ],
    };

    const html = renderDeck(deck);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="es">');
    expect(html).toContain('<body data-brand="gestiona">');
    expect(html).toContain('<title>Test Presentation — esPublico</title>');
    expect(html).toContain('Hello');
    expect(html).toContain('World');
    expect(html).toContain('../assets/css/corporate.css');
    expect(html).toContain('../assets/js/navigation.js');
  });

  it('handles multiple slides', () => {
    const deck: Deck = {
      name: 'multi-slide',
      title: 'Multi Slide',
      brand: 'esfirma',
      slides: [
        { type: 'title', h1: 'Slide 1' },
        { type: 'closing', h2: 'Slide 2' },
      ],
    };

    const html = renderDeck(deck);
    expect(html).toContain('Slide 1');
    expect(html).toContain('Slide 2');
    expect(html.match(/<section class="slide-container"/g)).toHaveLength(2);
  });

  it('escapes HTML in user input', () => {
    const deck: Deck = {
      name: 'xss-test',
      title: 'XSS <script>alert("test")</script>',
      brand: 'gestiona',
      slides: [
        {
          type: 'title',
          h1: '<img src=x onerror="alert()">',
        },
      ],
    };

    const html = renderDeck(deck);
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;img');
    expect(html).toContain('&lt;script&gt;');
  });

  it('respects brand override on slide', () => {
    const deck: Deck = {
      name: 'brand-override',
      title: 'Brand Override',
      brand: 'gestiona',
      slides: [
        {
          type: 'title',
          h1: 'Main',
          brandOverride: 'esfirma',
        },
      ],
    };

    const html = renderDeck(deck);
    expect(html).toContain('data-brand="esfirma"');
  });
});

describe('renderSlide', () => {
  it('renders title slide', () => {
    const slide: Slide = {
      type: 'title',
      h1: 'Welcome',
      subtitle: 'to the show',
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('title-layout');
    expect(html).toContain('Welcome');
    expect(html).toContain('to the show');
    expect(html).toContain('aria-label="Portada"');
  });

  it('renders section slide', () => {
    const slide: Slide = {
      type: 'section',
      h2: 'New Section',
      subtitle: 'Details here',
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('section-title-layout');
    expect(html).toContain('New Section');
    expect(html).toContain('Details here');
    expect(html).toContain('<hr>');
  });

  it('renders tiled slide', () => {
    const slide: Slide = {
      type: 'tiled',
      title: 'Features',
      tiles: [
        {
          icon: 'star',
          title: 'Tile 1',
          text: 'Description 1',
        },
        {
          icon: 'heart',
          title: 'Tile 2',
          text: 'Description 2',
          gold: true,
        },
      ],
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('tiled-content');
    expect(html).toContain('Features');
    expect(html).toContain('Tile 1');
    expect(html).toContain('Tile 2');
    expect(html).toContain('fa-star');
    expect(html).toContain('fa-heart');
    expect(html).toContain('tile--gold');
  });

  it('renders bullet-list with progressive reveal', () => {
    const slide: Slide = {
      type: 'bullet-list',
      title: 'Points',
      bullets: [
        { icon: 'check', text: 'Point 1' },
        { icon: 'check', text: 'Point 2' },
      ],
      progressive: true,
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('bullet-list');
    expect(html).toContain('Point 1');
    expect(html).toContain('Point 2');
    expect(html).toContain('data-phase="1"');
    expect(html).toContain('data-phase="2"');
  });

  it('renders feature-cards', () => {
    const slide: Slide = {
      type: 'feature-cards',
      title: 'Features',
      cards: [
        { icon: 'rocket', title: 'Fast', text: 'Lightning speed' },
      ],
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('feature-cards');
    expect(html).toContain('feature-card');
    expect(html).toContain('fa-rocket');
    expect(html).toContain('Fast');
  });

  it('renders table', () => {
    const slide: Slide = {
      type: 'table',
      title: 'Data',
      headers: ['Col 1', 'Col 2'],
      rows: [
        ['A', 'B'],
        ['C', 'D'],
      ],
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('table-layout');
    expect(html).toContain('<table');
    expect(html).toContain('Col 1');
    expect(html).toContain('Col 2');
    expect(html).toContain('<td>A</td>');
  });

  it('renders bar-chart', () => {
    const slide: Slide = {
      type: 'bar-chart',
      title: 'Stats',
      bars: [
        { label: 'Item 1', value: 50, tone: 'mid' },
        { label: 'Item 2', value: 80, tone: 'high' },
      ],
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('bar-chart');
    expect(html).toContain('Item 1');
    expect(html).toContain('Item 2');
    expect(html).toContain('bar--mid');
    expect(html).toContain('bar--high');
  });

  it('renders closing slide', () => {
    const slide: Slide = {
      type: 'closing',
      h2: 'Thank you',
      subtitle: 'Questions?',
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('title-layout');
    expect(html).toContain('Thank you');
    expect(html).toContain('Questions?');
  });

  it('renders two-column slide with bullets + html blocks', () => {
    const slide: Slide = {
      type: 'two-column',
      title: 'Compare',
      left: { type: 'bullets', content: 'Pro 1\nPro 2' },
      right: { type: 'html', content: '<p class="custom">Raw</p>' },
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('two-column');
    expect(html).toContain('Compare');
    expect(html).toContain('<li>Pro 1</li>');
    expect(html).toContain('<li>Pro 2</li>');
    expect(html).toContain('<p class="custom">Raw</p>');
  });

  it('renders title slide with image reference', () => {
    const slide: Slide = {
      type: 'title',
      h1: 'Bienvenido',
      image: { src: 'logo.png', alt: 'Logo corporativo' },
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('class="title-image"');
    expect(html).toContain('src="./img/logo.png"');
    expect(html).toContain('alt="Logo corporativo"');
  });

  it('falls back to src as alt when alt missing', () => {
    const slide: Slide = {
      type: 'title',
      h1: 'X',
      image: { src: 'hero.jpg' },
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('alt="hero.jpg"');
  });

  it('renders two-column with image block', () => {
    const slide: Slide = {
      type: 'two-column',
      title: 'Compare',
      left: { type: 'bullets', content: 'Pro 1\nPro 2' },
      right: { type: 'image', src: 'chart.png', alt: 'Q1 chart' },
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('two-column');
    expect(html).toContain('<li>Pro 1</li>');
    expect(html).toContain('class="column-image"');
    expect(html).toContain('src="./img/chart.png"');
    expect(html).toContain('alt="Q1 chart"');
  });

  it('renders step-cards with numbered steps and gold variant', () => {
    const slide: Slide = {
      type: 'step-cards',
      title: 'Process',
      gold: true,
      steps: [
        { title: 'Step A', text: 'first' },
        { title: 'Step B', text: 'second' },
      ],
    };

    const html = renderSlide(slide, 'gestiona');
    expect(html).toContain('step-cards');
    expect(html).toContain('step-card--gold');
    expect(html).toContain('slide-title--gold');
    expect(html).toContain('>1</div>');
    expect(html).toContain('>2</div>');
    expect(html).toContain('Step A');
    expect(html).toContain('Step B');
  });
});

describe('parity vs showcase canonical classes', () => {
  const allLayoutsDeck: Deck = {
    name: 'parity',
    title: 'Parity',
    brand: 'gestiona',
    slides: [
      { type: 'title', h1: 'T' },
      { type: 'section', h2: 'S' },
      {
        type: 'tiled',
        title: 'X',
        tiles: [{ icon: 'fa-bolt', title: 'A', text: 'a' }],
      },
      {
        type: 'two-column',
        title: 'X',
        left: { type: 'text', content: 'L' },
        right: { type: 'text', content: 'R' },
      },
      {
        type: 'feature-cards',
        title: 'X',
        cards: [{ icon: 'fa-bolt', title: 'A', text: 'a' }],
      },
      {
        type: 'bullet-list',
        title: 'X',
        bullets: [
          { icon: 'fa-bolt', text: 'a' },
          { icon: 'fa-bolt', text: 'b' },
        ],
      },
      {
        type: 'step-cards',
        title: 'X',
        steps: [{ title: 'A', text: 'a' }],
      },
      {
        type: 'table',
        title: 'X',
        headers: ['H'],
        rows: [['v']],
      },
      {
        type: 'bar-chart',
        title: 'X',
        bars: [{ label: 'A', value: 50, tone: 'mid' }],
      },
      { type: 'closing', h2: 'End' },
    ],
  };

  it('emits every canonical layout class', () => {
    const html = renderDeck(allLayoutsDeck);
    const canonicalClasses = [
      'slide-container',
      'title-layout',
      'section-title-layout',
      'two-column',
      'step-cards',
      'bar-chart',
    ];
    for (const cls of canonicalClasses) {
      expect(html, `missing class: ${cls}`).toContain(cls);
    }
  });

  it('imports corporate.css and navigation.js with correct relative path', () => {
    const html = renderDeck(allLayoutsDeck);
    expect(html).toContain('href="../assets/css/corporate.css"');
    expect(html).toContain('src="../assets/js/navigation.js"');
  });

  it('applies data-brand at body and slide-container level', () => {
    const html = renderDeck(allLayoutsDeck);
    expect(html).toContain('<body data-brand="gestiona">');
    expect(html.match(/data-brand="gestiona"/g)?.length ?? 0).toBeGreaterThan(1);
  });
});
