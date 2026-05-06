import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderTiledSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);
  const variant = slide.variant ?? '2x2';
  const gridClass = variant === '3-col' ? 'tiled-content tile-triple' : 'tiled-content';

  const tilesHtml = slide.tiles
    .map(
      (tile: any) => `
            <div class="tile${tile.gold ? ' tile--gold' : ''}">
                <div class="icon-circle${tile.gold ? ' icon-circle--gold' : ''}">
                    <i class="fa-solid fa-${escape(tile.icon)}"></i>
                </div>
                <h3>${escape(tile.title)}</h3>
                <p>${escape(tile.text)}</p>
            </div>`
    )
    .join('\n');

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title">${title}</h2>
        <div class="${gridClass}">
${tilesHtml}
        </div>
    </section>`;
}
