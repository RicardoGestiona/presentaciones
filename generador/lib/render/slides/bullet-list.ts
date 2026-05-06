import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderBulletListSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);
  const gold = slide.gold ?? false;
  const progressive = slide.progressive ?? false;

  const bulletsHtml = slide.bullets
    .map(
      (bullet: any, idx: number) => {
        const phaseAttr = progressive ? ` data-phase="${idx + 1}"` : '';
        const phaseClass = progressive ? ' phase' : '';
        return `<li class="bullet${phaseClass}"${phaseAttr}>
                    <i class="fa-solid fa-${escape(bullet.icon)}" aria-hidden="true"></i>
                    <span>${escape(bullet.text)}</span>
                </li>`;
      }
    )
    .join('\n');

  const listClass = `bullet-list${gold ? ' bullet-list--gold' : ''}`;

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title${gold ? ' slide-title--gold' : ''}">${title}</h2>
        <div class="content-area">
            <ul class="${listClass}">
${bulletsHtml}
            </ul>
        </div>
    </section>`;
}
