// font-capture.mjs — deterministic font-optimization harness for abhisheksharma.si
// Usage: node scripts/font-capture.mjs <baseUrl> <outDir>
// Captures full-page screenshots + font/resource metadata + rendered-text charset
// under {light,dark} x {desktop,mobile}, for default / career-open / bookshelf states,
// plus a synthetic probe page (code, italics, accents, arrows, CJK, combining marks).
const pw = await import(process.env.PLAYWRIGHT_PKG || "playwright");
const chromium = pw.chromium;
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:4323";
const OUT = process.argv[3] || "fonts-capture-out";
mkdirSync(OUT, { recursive: true });

// Probe page: identical bytes for every run; exercises glyph classes we must not regress.
const PROBE_CSS_LINK = process.env.PROBE_CSS_LINK || "";
const PROBE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Font Probe</title>
${PROBE_CSS_LINK ? `<link rel="stylesheet" href="${PROBE_CSS_LINK}">` : `<style>@font-face { font-family: "Geist Mono"; src: url("/fonts/GeistMono-Variable.ttf") format("truetype"); font-weight: 100 900; font-style: normal; }</style>`}
<style>
html { font-family: "Geist Mono", ui-monospace, monospace; font-size:16px; line-height:1.65; background:#f8f6ef; color:#292921; padding:2rem; max-width:900px; margin:auto; }
h1 { font-weight:400; font-size:2rem; letter-spacing:-.04em; }
.sec { margin: 1.6rem 0; }
.sec h2 { font-size:1.1rem; font-weight:400; }
code, pre { font-family: "Geist Mono", ui-monospace, monospace; }
em { font-style: italic; }
em strong, strong em { font-weight: 700; font-style: italic; }
.w500 { font-weight: 500; } .w520 { font-weight: 520; } .w560 { font-weight: 560; } .w600 { font-weight: 600; }
.w700-diag { font-weight: 700; }
.accents { font-size: 1.2rem; }
</style></head><body>
<h1>Font Probe — abhisheksharma.si</h1>
<div class="sec"><h2>Code (ASCII + brackets + braces)</h2>
<pre>const shelf = books.filter(b => b.rating === 5);
if (needs.rerun) { build(); }</pre></div>
<div class="sec"><h2>Italics and bold inside italics</h2>
<p>Plain text. <em>Italic sentence with words.</em> <strong>Bold words</strong> and <em>italic <strong>bold inside italics</strong></em>.</p></div>
<div class="sec"><h2>Weight instances (canvas parity)</h2>
<p class="w500">Weight 500 — wordmark weight.</p>
<p class="w520">Weight 520 — cover-art quote weight.</p>
<p class="w560">Weight 560 — cover-art title weight.</p>
<p class="w600">Weight 600 — cover-art imprint weight.</p>
<p class="w700-diag">Weight 700 — diagnostic only: site never uses 700; axis clamps here.</p></div>
<div class="sec"><h2>Accented characters (real site content)</h2>
<p class="accents">á â ö Ø ø ł ō ş ū · À Ö — from titles: “Keigo Higashino”, “William Zinsser”</p>
<p class="accents">Punctuation: ‘single’ “double” – en — em … ellipsis − minus −5 +5</p></div>
<div class="sec"><h2>Arrows</h2>
<p class="accents">← ↑ → ↓ ↗ ↖ ↘ ↙</p></div>
<div class="sec"><h2>CJK (system fallback expected)</h2>
<p class="accents">中文测试、です。日本語 — must render identically before and after (system font).</p></div>
<div class="sec"><h2>Combining marks</h2>
<p class="accents">e&#76; = e + U+0301 combining acute; n&#771; = n + tilde — marks must not regress.</p></div>
</body></html>`;

const servedDir = process.argv[4]; // write probe into served root
if (servedDir) writeFileSync(join(servedDir, "font-probe.html"), PROBE);

const VPS = [["desktop", 1440, 900], ["mobile", 390, 844]];
const THEMES = ["light", "dark"];
const browser = await chromium.launch();
const meta = { base: BASE, captures: {}, fonts: {}, resources: {}, text: {} };

async function collectMeta(page, key) {
  const fonts = await page.evaluate(() => {
    const out = [];
    document.fonts.forEach((f) => out.push({ family: f.family, weight: f.weight, style: f.style, status: f.status }));
    return out;
  });
  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource")
      .filter((r) => /\.(ttf|woff2?|otf)$/i.test(r.name))
      .map((r) => ({ name: r.name.split("/").pop(), transfer: r.transferSize, decoded: r.decodedBodySize }))
  );
  const text = await page.evaluate(() => {
    const parts = [document.body.innerText];
    document.querySelectorAll("*").forEach((el) => {
      const a = el.getAttribute && (el.getAttribute("aria-label") || el.getAttribute("title"));
      if (a) parts.push(a);
    });
    return parts.join("\n");
  });
  meta.fonts[key] = fonts;
  meta.resources[key] = resources;
  meta.text[key] = text;
}

for (const [vpName, w, h] of VPS) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const key = `${vpName}-${theme}`;

    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // reload with fonts in the HTTP cache: removes fallback-first-paint swap timing
    // artifacts so captures compare rendering, not load timing (a first-visit capture
    // can legitimately show fallback glyphs mid-swap for BOTH the old and new fonts)
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // the 3D bookshelf hydrates + renders async; wait for it so captures are deterministic
    await page.locator(".shelf-canvas").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await page.screenshot({ path: join(OUT, `${key}-default.png`), fullPage: true });
    await collectMeta(page, `${key}-default`);

    // open career accordion
    const career = page.locator(".career-section > summary");
    if (await career.count()) {
      await career.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: join(OUT, `${key}-career-open.png`), fullPage: true });
      await collectMeta(page, `${key}-career-open`);
    }

    // open bookshelf, wait for WebGL canvas + textures
    const shelf = page.locator("#bookshelf > summary");
    if (await shelf.count()) {
      await shelf.click();
      await page.locator(".shelf-canvas").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(2500);
      await page.screenshot({ path: join(OUT, `${key}-bookshelf.png`), fullPage: true });
      await collectMeta(page, `${key}-bookshelf`);
    }

    // probe page
    await page.goto(BASE + "/font-probe.html", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(OUT, `${key}-probe.png`), fullPage: true });
    await collectMeta(page, `${key}-probe`);

    await ctx.close();
  }
}
await browser.close();

// charset actually rendered
const chars = new Set();
for (const t of Object.values(meta.text)) for (const c of t) if (!c.match(/\s/)) chars.add(c);
chars.add(" ");
meta.renderedCharset = Array.from(chars).sort();
writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 2));
console.log("captures written to", OUT, "| distinct rendered chars:", chars.size);
