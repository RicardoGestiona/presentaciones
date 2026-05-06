import { escape } from '../escape';
import type { Brand } from '../../schema';

export function renderTableSlide(
  slide: any,
  brand: Brand
): string {
  const title = escape(slide.title);

  const headersHtml = slide.headers
    .map((h: string) => `<th>${escape(h)}</th>`)
    .join('\n');

  const rowsHtml = slide.rows
    .map(
      (row: string[]) => `
            <tr>
${row.map((cell) => `<td>${escape(cell)}</td>`).join('\n')}
            </tr>`
    )
    .join('\n');

  return `    <section class="slide-container" data-brand="${escape(brand)}" aria-label="Sección: ${title}">
        <h2 class="slide-title">${title}</h2>
        <div class="table-wrapper">
            <table class="table-layout">
                <thead>
                    <tr>
${headersHtml}
                    </tr>
                </thead>
                <tbody>
${rowsHtml}
                </tbody>
            </table>
        </div>
    </section>`;
}
