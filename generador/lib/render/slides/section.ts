import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderSectionSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.h2);
  const subtitle = slide.subtitle ? escape(slide.subtitle) : null;
  const isDark = slide.dark ?? false;

  const layoutClass = isDark ? 'section-title-layout' : 'section-title-layout';

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <div class="${layoutClass}">
            <h2>${title}</h2>
            <hr>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
    </section>`;
}
