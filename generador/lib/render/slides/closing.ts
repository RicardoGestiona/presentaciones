import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderClosingSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.h2);
  const subtitle = slide.subtitle ? escape(slide.subtitle) : null;

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Cierre">
        <div class="title-layout">
            <h2>${title}</h2>
            ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
        </div>
    </section>`;
}
