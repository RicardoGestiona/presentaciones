"""
build_pdf.py — PDF fiel al render HTML de apdcat/index.html.

Captura cada .slide-container como PNG (viewport 1280x720, fases .phase
reveladas) desplazando `main` vía transform (igual que goToSlide en
navigation.js) y compone un PDF multipágina con Pillow.
"""
from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright
from PIL import Image

ROOT     = Path(__file__).resolve().parent.parent
INDEX    = ROOT / "index.html"
OUT_PDF  = ROOT / "apdcat.pdf"
SHOTS    = Path(__file__).resolve().parent / "shots_pdf"

W_CSS, H_CSS = 1280, 720
SCALE = 2  # supersample para nitidez en PDF

JS_REVEAL_PHASES = r"""
() => { document.querySelectorAll('.phase').forEach(el => el.classList.add('visible')); }
"""

JS_GOTO = r"""
(index) => {
    const main = document.querySelector('main[role="presentation"]');
    main.style.transition = 'none';
    main.style.transform = 'translateX(-' + (index * 1280) + 'px)';

    const total = document.querySelectorAll('.slide-container').length;
    document.querySelectorAll('.slide-dot').forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
    });
    const numberEl = document.querySelector('.slide-number');
    if (numberEl) numberEl.textContent = index === 0 ? '' : (index + 1) + '/' + total;
}
"""


def build():
    SHOTS.mkdir(exist_ok=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": W_CSS, "height": H_CSS},
            device_scale_factor=SCALE,
        )
        page = ctx.new_page()
        page.goto(INDEX.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.evaluate(JS_REVEAL_PHASES)
        page.wait_for_timeout(400)

        n = page.locator(".slide-container").count()
        print(f"[info] {n} slides", file=sys.stderr)

        paths = []
        for i in range(n):
            page.evaluate(JS_GOTO, i)
            page.wait_for_timeout(150)
            out = SHOTS / f"slide_{i+1:02d}.png"
            page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": W_CSS, "height": H_CSS})
            paths.append(out)
            print(f"[shot] {out.name}", file=sys.stderr)

        browser.close()

    images = [Image.open(p).convert("RGB") for p in paths]
    images[0].save(OUT_PDF, save_all=True, append_images=images[1:])
    print(f"[done] {OUT_PDF.name} ({OUT_PDF.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    build()
