import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderFeatureCardsSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);

  const cardsHtml = slide.cards
    .map(
      (card: any) => `
            <div class="feature-card">
                <div class="icon-circle icon-circle--lg">
                    <i class="fa-solid fa-${escape(card.icon)}"></i>
                </div>
                <h3>${escape(card.title)}</h3>
                <p>${escape(card.text)}</p>
            </div>`
    )
    .join('\n');

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title">${title}</h2>
        <div class="feature-cards">
${cardsHtml}
        </div>
    </section>`;
}
