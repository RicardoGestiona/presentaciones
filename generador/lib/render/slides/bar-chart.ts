import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderBarChartSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);

  const barsHtml = slide.bars
    .map(
      (bar: any) => `
            <div class="bar-group">
                <div class="bar-container">
                    <div class="bar bar--${bar.tone}" style="width: ${Math.max(bar.value, 5)}%;"></div>
                </div>
                <span class="bar-label">${escape(bar.label)}</span>
                <span class="bar-value">${bar.value}%</span>
            </div>`
    )
    .join('\n');

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title">${title}</h2>
        <div class="bar-chart">
${barsHtml}
        </div>
    </section>`;
}
