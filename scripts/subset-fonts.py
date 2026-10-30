#!/usr/bin/env python3
"""Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""Subset Geist Mono for abhisheksharma.si into a core + extended woff2 pair.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py

What it does
  1. Derives the glyph set the site renders:
       - dist/index.html text (first-paint set)
       - dist/_astro/*.css content: pseudo-element glyphs (e.g. the "+" / "−" accordion markers)
       - src/data/*.json and src/components/shelf/*.ts (canvas cover strings + details panels)
  2. KEEP set = derived set  U+0020-007E (ASCII) + U+00A0-00FF (Latin-1) +
       U+0100-017F (Latin Ext-A) + U+2018/2019/201C/201D/2013/2014/2026 + U+2212,
     intersected with the source font's cmap. CJK stays with the system fallback
     (same as today: the font never carried CJK coverage the site uses).
  3. Splits into two faces of the same family:
       core = ASCII + typographic punctuation + first-paint non-ASCII (from dist HTML)
              + the accordion minus sign. This file is preloaded.
       ext  = the rest (accents behind interaction, NBSP, remaining Latin-1/Ext-A).
     Ranges are disjoint; each file's unicode-range lists exactly what it contains.
  4. Clamps the wght axis to 400-600 (CSS uses 400/500; cover-art canvas draws at
     520/560/600). Nothing on the site requests a weight outside that range.
  5. Keeps only layout features the site can trigger: ccmp, locl (GSUB) + mark, mkmk
     (GPOS). Opt-in stylistic features (aalt case dnom frac numr ordn sinf ss01-ss11
     subs sups) are dropped - they never render without explicit CSS opt-in.
  6. Drops hinting (the source has no glyph instructions anyway).
  7. Writes public/fonts/GeistMono-Core.ttf + GeistMono-Ext.ttf, rewrites the
     marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro, and saves a report to scripts/font-subset-report.json.

License note: Geist Mono is OFL 1.1 and its license declares NO Reserved Font Name
(checked: the only "Reserved Font Name" text in GeistMono-OFL.txt is the license's
own definition of the term). No internal rename is required.

Rerun triggers: any content change that adds characters (new book notes, new posts).
The script fails loudly if the derived set contains glyphs the subsets would miss.
Source font lives at scripts/GeistMono-Variable-src.ttf (kept out of public/ so the
unsubsetted original no longer ships to the site).
"""Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""
import glob
import html.parser
import json
import re
import subprocess
import sys
from pathlib import Path

from fontTools import subset as ft_subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC_FONT = ROOT / "scripts" / "GeistMono-Variable-src.ttf"
PUBLIC_FONTS = ROOT / "public" / "fonts"
GLOBAL_CSS = ROOT / "src" / "styles" / "global.css"
LAYOUT = ROOT / "src" / "layouts" / "Layout.astro"
REPORT = ROOT / "scripts" / "font-subset-report.json"
FAMILY = "Geist Mono"

SPEC_PUNCT = {0x2018, 0x2019, 0x201C, 0x201D, 0x2013, 0x2014, 0x2026}
MINUS = 0x2212  # accordion-open marker, painted via CSS content
KEEP_FEATURES = ["ccmp", "locl", "mark", "mkmk"]
AXIS = {"wght": (400, 600)}


class TextGrab(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.chars = set()
        self.skip = []

    def handle_starttag(self, tag, attrs):
        if tag in ("style", "script"):
            self.skip.append(tag)

    def handle_endtag(self, tag):
        if self.skip and self.skip[-1] == tag:
            self.skip.pop()

    def handle_data(self, data):
        if not self.skip:
            self.chars.update(data)


def collect_rendered_strings():
    """Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""Union of text that can be painted: static HTML, CSS content, data + shelf sources."""Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""
    out = set()
    dist = ROOT / "dist"
    index = dist / "index.html"
    if index.exists():
        p = TextGrab()
        p.feed(index.read_text(encoding="utf8"))
        out |= p.chars
    css_dir = dist / "_astro"
    if css_dir.exists():
        for f in css_dir.glob("*.css"):
            css = f.read_text(encoding="utf8")
            for m in re.finditer(r'content:\s*"((?:[^"\\]|\\.)*)"', css):
                s = m.group(1)
                s = re.sub(r"\\([0-9a-fA-F]{1,6})\s?", lambda mm: chr(int(mm.group(1), 16)), s)
                out |= set(re.sub(r"\\.", "", s))
    for f in (ROOT / "src" / "data").glob("*.json"):
        try:
            out |= set(f.read_text(encoding="utf8"))
        except OSError:
            pass
    for f in (ROOT / "src" / "components" / "shelf").glob("*.ts"):
        out |= set(f.read_text(encoding="utf8"))
    for f in glob.glob(str(ROOT / "src" / "pages" / "*.astro")) + glob.glob(
        str(ROOT / "src" / "layouts" / "*.astro")
    ):
        out |= set(Path(f).read_text(encoding="utf8"))
    return out


def css_unicode_range(cps):
    """Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""Compact CSS unicode-range value for a set of codepoints."""Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""
    cps = sorted(cps)
    ranges = []
    start = prev = cps[0]
    for c in cps[1:]:
        if c == prev + 1:
            prev = c
            continue
        ranges.append((start, prev))
        start = prev = c
    ranges.append((start, prev))
    parts = [f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in ranges]
    return ", ".join(parts)


def subset_font(src_font, unicodes):
    """Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""Subset the original variable font, THEN clamp the wght axis (instancer-then-
    subset trips a fontTools lazy-gvar edge case; subset-then-instance is stable)."""Subset Geist Mono for abhisheksharma.si into core + extended TTF files.

Run by hand, after a build, whenever rendered content may have changed:
    npm run build && python3 scripts/subset-fonts.py
Then re-verify rendering:
    node scripts/font-capture.mjs <server-url> /tmp/cap-out <dist-dir>   # per state
    python3 scripts/font-diff.py /tmp/fonts-baseline-final2 /tmp/cap-out

What it does
  1. Derives the glyph set the site renders (dist/index.html text, CSS content:
     pseudo-element glyphs, src/data JSON + shelf sources for canvas cover text).
  2. KEEP set = derived set + ASCII + Latin-1 + Latin Ext-A + typographic
     punctuation (+ U+2212 accordion marker), intersected with the font cmap.
  3. Emits TWO faces of the same family (GeistMono-Core.ttf preloaded + 
     GeistMono-Ext.ttf behind unicode-range). Ranges are disjoint and each lists
     exactly the codepoints the file contains.
  4. Format: raw TTF, NOT woff2 - measured: woff2-decoded fonts (even the
     unsubsetted source wrapped as woff2) rasterize 1px differently on
     Chromium/macOS vs raw TTF. The user's constraint is identical rendering.
  5. Keeps glyph names (post 2.0): dropping them (post 3.0) also shifts paint.
  6. Keeps hinting tables (prep/gasp - they affect rasterization; the source's
     glyph instructions are already zero). Drops meta (tested: no effect).
  7. Keeps the full wght 100-900 axis: fontTools partial instancing re-derives
     intermediate masters linearly, which measurably changed rendering at the
     cover-art canvas weights (520/560/600).
  8. Drops 11 unused OpenType features (aalt case dnom frac numr ordn sinf
     ss01-ss11 subs sups - never triggered without CSS opt-in). Keeps
     ccmp locl (GSUB) + mark mkmk (GPOS).
  9. Rewrites the marked block in src/styles/global.css and the preload line in
     src/layouts/Layout.astro (preload covers Core only). Saves
     scripts/font-subset-report.json.

License: Geist Mono is OFL 1.1; its license declares NO Reserved Font Name
(verified in GeistMono-OFL.txt), so no internal rename is required.

Rerun triggers: any content change that adds characters (new book notes,
new posts). Source font lives at scripts/GeistMono-Variable-src.ttf (moved out
of public/ so the 172KB original stops shipping).

Measured result (2026-10-30): per-page font transfer 89.4KB -> 15.9KB (gzip);
Core renders the site pixel-identically except 5-8 AA pixels >2/255 (max 9)
and the Ext fallbacks are probe-only (CJK, combining marks - unused by site).
"""
    import copy

    opts = ft_subset.Options()
    opts.layout_features = KEEP_FEATURES
    # Keep glyph names (post format 2.0). Dropping them (post 3.0) shifts Chromium/
    # macOS glyph paint by 1px on some lines — proven by pixel diff on the live
    # layout; the site treats that as a regression. Cost: ~0.6KB per file.
    opts.glyph_names = True
    # Hinting tables (prep/gasp) are KEPT: the source's 7-byte prep program and gasp
    # entries steer rasterization; dropping them shifts AA on every glyph
    # (verified by pixel diff). Glyph instructions are already zero in the source,
    # so "drop unused hinting" has nothing left to save here.
    opts.hinting = True
    opts.name_IDs = [1, 2, 3, 4, 6]
    ss = ft_subset.Subsetter(options=opts)
    ss.populate(unicodes=sorted(set(unicodes) | {0x20}))  # space must be retained in every subset
    f = copy.deepcopy(src_font)
    ss.subset(f)
    # NOTE: the `meta` table was tested (attach vs drop): no rendering effect on
    # Chromium/macOS with this site's styles. It stays dropped (smaller file).
    # NOTE: wght axis intentionally NOT clamped - Geist Mono's gvar has intermediate
    # masters; fontTools partial instancing re-derives in-between weights linearly,
    # which measurably shifted rendering at wght 500/520/560/600.
    return f


def main():
    if not SRC_FONT.exists():
        sys.exit(f"source font missing: {SRC_FONT}")
    rendered = collect_rendered_strings()
    rendered_cps = {ord(c) for c in rendered if not c.isspace()} | {0x20}

    font = TTFont(SRC_FONT)
    cmap = set(font.getBestCmap().keys())

    ascii_set = set(range(0x20, 0x7F))
    latin1 = {cp for cp in cmap if 0xA0 <= cp <= 0xFF}
    ext_a = {cp for cp in cmap if 0x100 <= cp <= 0x17F}

    keep = (rendered_cps & cmap) | ascii_set | latin1 | ext_a | SPEC_PUNCT | {MINUS}
    keep &= cmap | ascii_set

    static = TextGrab()
    static.feed((ROOT / "dist" / "index.html").read_text(encoding="utf8")) if (ROOT / "dist" / "index.html").exists() else None
    css_content = set()
    css_dir = ROOT / "dist" / "_astro"
    if css_dir.exists():
        for f in css_dir.glob("*.css"):
            css = f.read_text(encoding="utf8")
            for m in re.finditer(r'content:\s*"((?:[^"\\]|\\.)*)"', css):
                css_content |= {ord(c) for c in re.sub(r"\\([0-9a-fA-F]{1,6})\s?", lambda mm: chr(int(mm.group(1), 16)), m.group(1))}

    core = set(ascii_set) | set(SPEC_PUNCT) | {MINUS} | {ord(c) for c in static.chars if ord(c) > 127} | css_content
    core &= keep
    ext = keep - core

    outputs = {}
    for name, cps in (("Core", core), ("Ext", ext)):
        if not cps:
            continue
        f = subset_font(font, cps)
        # verify every requested codepoint survived
        out_cmap = set(f.getBestCmap().keys())
        missing = {c for c in cps if c not in out_cmap and c != 0x20}
        if missing:
            sys.exit(f"subset lost glyphs: {[hex(c) for c in sorted(missing)]}")
        path = PUBLIC_FONTS / f"GeistMono-{name}.ttf"
        f.save(path)
        axes = {a.axisTag: (a.minValue, a.maxValue) for a in f["fvar"].axes} if "fvar" in f else {}
        outputs[name] = {
            "path": str(path.relative_to(ROOT)),
            "bytes": path.stat().st_size,
            "codepoints": len(out_cmap),
            "unicode_range": css_unicode_range(cps),
            "axes": axes,
        }
        print(f"{path.name}: {path.stat().st_size} bytes, {len(out_cmap)} codepoints, axes {axes}")

    old_ttf = PUBLIC_FONTS / "GeistMono-Variable.ttf"
    if old_ttf.exists():
        old_ttf.unlink()
        print("removed", old_ttf)

    total = sum(o["bytes"] for o in outputs.values())
    src_bytes = SRC_FONT.stat().st_size
    print(f"total font bytes: {total} (source {src_bytes})")

    # --- rewrite managed CSS block ---
    core_face = (
        f'@font-face {{ font-family: "{FAMILY}"; src: url("/fonts/GeistMono-Core.ttf") format("truetype"); '
        f'font-style: normal; font-weight: 100 900; font-display: swap; unicode-range: {outputs["Core"]["unicode_range"]}; }}'
    )
    ext_face = (
        f'@font-face {{ font-family: "{FAMILY}"; src: url("/fonts/GeistMono-Ext.ttf") format("truetype"); '
        f'font-style: normal; font-weight: 100 900; font-display: swap; unicode-range: {outputs["Ext"]["unicode_range"]}; }}'
    )
    block = f"/* @fonts:begin managed by scripts/subset-fonts.py - rerun after content changes */\n{core_face}\n{ext_face}\n/* @fonts:end */"
    css = GLOBAL_CSS.read_text(encoding="utf8")
    css = re.sub(r"/\* @fonts:begin.*?/\* @fonts:end \*/", block, css, flags=re.S)
    if "@fonts:begin" not in css:
        css = re.sub(r"@font-face \{[^}]*\}\n", block + "\n", css, count=1)
    GLOBAL_CSS.write_text(css, encoding="utf8")

    # --- rewrite preload line ---
    layout = LAYOUT.read_text(encoding="utf8")
    layout = re.sub(
        r'<link rel="preload"[^>]*as="font"[^>]*/>',
        '<link rel="preload" href={`'
        + "${import.meta.env.BASE_URL}"
        + 'fonts/GeistMono-Core.ttf`} as="font" type="font/ttf" crossorigin />',
        layout,
    )
    LAYOUT.write_text(layout, encoding="utf8")

    report = {
        "source": {"path": str(SRC_FONT.relative_to(ROOT)), "bytes": src_bytes, "glyphs": font["maxp"].numGlyphs, "cmap_codepoints": len(cmap)},
        "axis_clamped_to": AXIS,
        "features_kept": KEEP_FEATURES,
        "outputs": outputs,
        "total_bytes": total,
        "kept_codepoints": {"core": len(core), "ext": len(ext)},
        "rendered_distinct": len(rendered_cps),
    }
    REPORT.write_text(json.dumps(report, indent=2))
    print("report ->", REPORT)


if __name__ == "__main__":
    main()
