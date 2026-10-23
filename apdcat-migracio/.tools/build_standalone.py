"""
build_standalone.py — versión autocontenida (un único .html, funciona offline)
de apdcat-migracio/index.html.

Incrusta:
  · ../assets/css/corporate.css y ../assets/js/navigation.js (inline).
  · Roboto 400/500/700 (Google Fonts, subconjuntos latin + latin-ext) como woff2 base64.
  · Font Awesome 6.5.1 (CSS + webfonts solid/regular) como woff2 base64.

Salida: apdcat-migracio/index-standalone.html

Uso: apdcat/.tools/.venv/bin/python -I apdcat-migracio/.tools/build_standalone.py
"""
from __future__ import annotations

import base64
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT       = Path(__file__).resolve().parent.parent
ASSETS     = ROOT.parent / "assets"
INDEX      = ROOT / "index.html"
OUT_HTML   = ROOT / "index-standalone.html"

GOOGLE_FONTS_URL = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
FA_VERSION       = "6.5.1"
FA_BASE          = f"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{FA_VERSION}"
FA_CSS_URL       = f"{FA_BASE}/css/all.min.css"
# Navegador moderno → Google Fonts sirve woff2.
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
KEEP_FONT_SUBSETS = {"latin", "latin-ext"}


def log(event: str, **fields) -> None:
    print(json.dumps({"event": event, **fields}, ensure_ascii=False), file=sys.stderr)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    log("fetch", url=url, bytes=len(data))
    return data


def data_uri(payload: bytes, mime: str) -> str:
    return f"data:{mime};base64,{base64.b64encode(payload).decode('ascii')}"


def roboto_css() -> str:
    """Google Fonts CSS con solo latin/latin-ext y las woff2 incrustadas."""
    css = fetch(GOOGLE_FONTS_URL).decode("utf-8")
    # Cada bloque viene precedido de un comentario /* subset */.
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*{[^}]*})", css)
    kept, payloads = [], {}
    for subset, block in blocks:
        if subset not in KEEP_FONT_SUBSETS:
            continue
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)
        # Roboto es variable y el mismo woff2 sirve los tres pesos, pero se mantiene un
        # @font-face por peso: un rango 400-700 pintaría el 600 real en vez del 700 del original.
        if url not in payloads:
            payloads[url] = data_uri(fetch(url), "font/woff2")
        kept.append(block.replace(url, payloads[url]))
    if not kept:
        raise RuntimeError("Google Fonts CSS without latin subsets")
    return "\n".join(kept)


def font_awesome_css() -> str:
    """Font Awesome con las webfonts solid/regular incrustadas; brands y v4 fuera."""
    css = fetch(FA_CSS_URL).decode("utf-8")
    fonts = {}
    for name in ("fa-solid-900", "fa-regular-400"):
        fonts[name] = data_uri(fetch(f"{FA_BASE}/webfonts/{name}.woff2"), "font/woff2")

    def rewrite_src(match: re.Match) -> str:
        src = match.group(0)
        for name, uri in fonts.items():
            if f"{name}.woff2" in src:
                return f'src:url({uri}) format("woff2")'
        return "src:local('none')"  # brands / v4compat: no se usan en el deck

    return re.sub(r"src:url\([^;}]*", rewrite_src, css)


def build() -> None:
    html = INDEX.read_text(encoding="utf-8")
    corporate = (ASSETS / "css" / "corporate.css").read_text(encoding="utf-8")
    navigation = (ASSETS / "js" / "navigation.js").read_text(encoding="utf-8")

    replacements = [
        (r'\s*<link rel="preconnect"[^>]*>', ""),
        (r'<link href="https://fonts\.googleapis\.com/[^"]*" rel="stylesheet">',
         f"<style>\n{roboto_css()}\n</style>"),
        (r'<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/[^"]*">',
         f"<style>\n{font_awesome_css()}\n</style>"),
        (r'<link rel="stylesheet" href="\.\./assets/css/corporate\.css">',
         f"<style>\n{corporate}\n</style>"),
        (r'<script src="\.\./assets/js/navigation\.js"></script>',
         f"<script>\n{navigation}\n</script>"),
    ]
    for pattern, repl in replacements:
        html, n = re.subn(pattern, lambda _m, r=repl: r, html)
        if n == 0:
            raise RuntimeError(f"pattern not found in index.html: {pattern}")

    leftovers = re.findall(r'(?:href|src)="(?:\.\./|https?://)[^"]*"', html)
    if leftovers:
        raise RuntimeError(f"external references left: {leftovers}")

    OUT_HTML.write_text(html, encoding="utf-8")
    log("done", output=OUT_HTML.name, kb=OUT_HTML.stat().st_size // 1024)


if __name__ == "__main__":
    build()
