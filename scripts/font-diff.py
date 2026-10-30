#!/usr/bin/env python3
"""Pixel-diff two font-capture directories (same screenshot names).
Exact-pixel compare, plus a tolerance pass (<=2/255 per channel) to classify
sub-perceptual rounding. Prints one row per pair and saves diff visualizations
for any mismatch. The probe's weight-700 diagnostic row is expected to differ
(axis clamped to 400-600); it is labeled as such, not a site regression.
Usage: python3 scripts/font-diff.py /tmp/fonts-baseline /tmp/fonts-after
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops

BEFORE, AFTER = Path(sys.argv[1]), Path(sys.argv[2])
OUT = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("font-diff-out")
OUT.mkdir(exist_ok=True)

DIAG_OK = "-probe.png"  # probe pages may differ on the w700 diagnostic line only

names = sorted(p.name for p in BEFORE.glob("*.png") if (AFTER / p.name).exists())
fails = 0
print(f"{'screenshot':42s} {'size':12s} {'exact-diff px':>14s} {'tol-diff px':>12s}  verdict")
for name in names:
    a, b = Image.open(BEFORE / name).convert("RGB"), Image.open(AFTER / name).convert("RGB")
    if a.size != b.size:
        print(f"{name:42s} {str(a.size)+' vs '+str(b.size):12s} {'-':>14s} {'-':>12s}  SIZE MISMATCH (regression)")
        fails += 1
        continue
    diff = ImageChops.difference(a, b)
    bbox = diff.getbbox()
    exact = 0
    tol = 0
    if bbox:
        hist = diff.convert("L").histogram()
        exact = sum(hist[1:])
        tol = sum(hist[1:3])  # pixels with 0 < diff <= 2 (sub-perceptual rounding)
    if not bbox:
        verdict = "IDENTICAL"
    elif tol == exact:
        verdict = "SUB-PIXEL ROUNDING (all diffs <=2/255)"
    else:
        verdict = f"PERCEPTIBLE? ({exact - tol} px with diff >2)"
    if bbox and name.endswith(DIAG_OK):
        verdict += " [probe diagnostic page]"
    if bbox:
        fails += 0 if "expected" in verdict else 1
        (ImageChops.difference(a, b).point(lambda v: min(255, v * 8))).save(OUT / f"diff-{name}")
        (Image.new("RGB", a.size, (255, 255, 255))).paste(a).paste(b, (0, 0)) if False else None
    print(f"{name:42s} {str(a.size):12s} {exact:14d} {tol:12d}  {verdict}")
print("pairs:", len(names), "| unexplained mismatches:", fails)
sys.exit(1 if fails else 0)
