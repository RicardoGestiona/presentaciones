import { Deck, Slide, Brand } from '../schema';
import { escape } from './escape';
import {
  renderTitleSlide,
  renderSectionSlide,
  renderTiledSlide,
  renderTwoColumnSlide,
  renderFeatureCardsSlide,
  renderBulletListSlide,
  renderStepCardsSlide,
  renderTableSlide,
  renderBarChartSlide,
  renderClosingSlide,
} from './slides';

export function renderSlide(slide: Slide, deckBrand: Brand): string {
  const brand = slide.brandOverride || deckBrand;

  switch (slide.type) {
    case 'title':
      return renderTitleSlide(slide, brand);
    case 'section':
      return renderSectionSlide(slide, brand);
    case 'tiled':
      return renderTiledSlide(slide, brand);
    case 'two-column':
      return renderTwoColumnSlide(slide, brand);
    case 'feature-cards':
      return renderFeatureCardsSlide(slide, brand);
    case 'bullet-list':
      return renderBulletListSlide(slide, brand);
    case 'step-cards':
      return renderStepCardsSlide(slide, brand);
    case 'table':
      return renderTableSlide(slide, brand);
    case 'bar-chart':
      return renderBarChartSlide(slide, brand);
    case 'closing':
      return renderClosingSlide(slide, brand);
    default:
      const _exhaustive: never = slide;
      throw new Error(`Unknown slide type: ${_exhaustive}`);
  }
}

export function renderDeck(deck: Deck, imageMap?: Record<string, string>): string {
  const slides = deck.slides.map((slide) => renderSlide(slide, deck.brand)).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escape(deck.title)} — esPublico</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Slab:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/corporate.css">
    <meta name="generator" content="esPublico Deck Generator">
</head>
<body data-brand="${escape(deck.brand)}">
<main role="presentation">
${slides}
</main>
<script src="../assets/js/navigation.js"><\/script>
</body>
</html>`;
}

export { escape };
