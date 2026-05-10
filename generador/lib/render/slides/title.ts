import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderTitleSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.h1);
  const highlight = slide.highlight ? escape(slide.highlight) : null;
  const subtitle = slide.subtitle ? escape(slide.subtitle) : null;
  const image = slide.image
    ? `<img class="title-image" src="./img/${escape(slide.image.src)}" alt="${escape(slide.image.alt ?? slide.image.src)}">`
    : '';

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Portada">
        <div class="title-layout">
            ${image}
            <h1>${highlight ? `${title}<br><span>${highlight}</span>` : title}</h1>
            ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
        </div>
    </section>`;
}
