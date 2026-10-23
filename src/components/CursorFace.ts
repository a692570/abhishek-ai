const ATLAS = `${import.meta.env.BASE_URL}profile/abhishek-directions.webp`;
const CELLS = [
  [100, 50], [100, 100], [50, 100], [0, 100],
  [0, 50], [0, 0], [50, 0], [100, 0],
];
const WEDGE = Math.PI / 4;

export function initFace() {
  const portrait = document.getElementById("avatar-wrap");
  if (!portrait) return;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const atlas = new Image();
  let loading: Promise<void> | undefined;
  let ready = false;
  let current: number | null = null;

  function show(sector: number | null) {
    current = sector;
    const [x, y] = sector === null ? [50, 50] : CELLS[sector];
    portrait!.style.backgroundPosition = `${x}% ${y}%`;
  }

  function allowed() {
    return finePointer.matches && !reducedMotion.matches;
  }

  async function updatePreference() {
    show(null);
    if (!allowed()) {
      portrait!.classList.remove("is-tracking");
      return;
    }
    if (!loading) {
      atlas.src = ATLAS;
      loading = atlas.decode();
    }
    try {
      await loading;
      ready = true;
      if (allowed()) {
        portrait!.style.backgroundImage = `url("${ATLAS}")`;
        portrait!.classList.add("is-tracking");
      }
    } catch {
      // The real center portrait remains visible if the atlas cannot load.
      ready = false;
    }
  }

  document.addEventListener("pointermove", (event) => {
    if (!ready || !allowed() || event.pointerType === "touch") return;
    const bounds = portrait.getBoundingClientRect();
    const dx = event.clientX - bounds.left - bounds.width / 2;
    const dy = event.clientY - bounds.top - bounds.height / 2;
    if (Math.hypot(dx, dy) < bounds.width / 2) {
      show(null);
      return;
    }
    const angle = Math.atan2(dy, dx);
    if (current !== null) {
      const distance = Math.abs(Math.atan2(
        Math.sin(angle - current * WEDGE),
        Math.cos(angle - current * WEDGE),
      ));
      // A small overlap keeps the head still near a direction boundary.
      if (distance < WEDGE / 2 + 0.08) return;
    }
    const sector = (Math.round(angle / WEDGE) + 8) % 8;
    if (sector !== current) show(sector);
  });
  document.documentElement.addEventListener("pointerleave", () => show(null));
  window.addEventListener("blur", () => show(null));
  finePointer.addEventListener("change", updatePreference);
  reducedMotion.addEventListener("change", updatePreference);
  void updatePreference();
}
