import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderStepCardsSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);
  const gold = slide.gold ?? false;

  const stepsHtml = slide.steps
    .map(
      (step: any, idx: number) => `
            <div class="step-card${gold ? ' step-card--gold' : ''}">
                <div class="step-number">${idx + 1}</div>
                <h3>${escape(step.title)}</h3>
                <p>${escape(step.text)}</p>
            </div>`
    )
    .join('\n');

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title${gold ? ' slide-title--gold' : ''}">${title}</h2>
        <div class="step-cards">
${stepsHtml}
        </div>
    </section>`;
}
