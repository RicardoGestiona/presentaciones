import { escape } from '../escape';
import type { Brand } from '../../schema';

function renderBlock(block: any): string {
  if (block.type === 'bullets') {
    const bullets = block.content
      .split('\n')
      .filter((b: string) => b.trim())
      .map((b: string) => `<li>${escape(b)}</li>`)
      .join('\n');
    return `<ul class="bullet-list">\n${bullets}\n</ul>`;
  }
  if (block.type === 'html') {
    return block.content;
  }
  return `<p>${escape(block.content)}</p>`;
}

export function renderTwoColumnSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);
  const leftHtml = renderBlock(slide.left);
  const rightHtml = renderBlock(slide.right);

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title">${title}</h2>
        <div class="two-column">
            <div class="column">
${leftHtml}
            </div>
            <div class="column">
${rightHtml}
            </div>
        </div>
    </section>`;
}
