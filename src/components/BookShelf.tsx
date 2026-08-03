import { useEffect, useRef, useState } from "react";
import { catalog } from "./shelf/catalog";
import { ShelfEngine, type ShelfMode } from "./shelf/ShelfEngine";

export default function BookShelf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ShelfEngine | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<ShelfMode>("browse");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("assembling volumes");

  const activeBook = catalog[activeIndex];
  const selectedBook = selectedIndex !== null ? catalog[selectedIndex] : null;
  const isFocused = mode !== "browse";

  useEffect(() => {
    let cancelled = false;
    let engine: ShelfEngine | null = null;
    async function start() {
      if (!canvasRef.current) return;
      await document.fonts.ready;
      if (cancelled || !canvasRef.current) return;
      engine = new ShelfEngine(canvasRef.current, catalog, {
        onActiveIndex: setActiveIndex,
        onMode: (m, i) => { setMode(m); setSelectedIndex(i); },
        onStatus: setStatus,
        onReady: () => setReady(true),
      });
      engineRef.current = engine;
    }
    void start();
    return () => { cancelled = true; engine?.dispose(); engineRef.current = null; };
  }, []);

  function focusBook(i: number) { engineRef.current?.focusBook(i); }
  function nextBook() { engineRef.current?.browseBy(1); }
  function prevBook() { engineRef.current?.browseBy(-1); }
  function backToShelf() { engineRef.current?.returnToShelf(); }

  return (
    <div className={"shelf-experience" + (ready ? " is-ready" : "") + (isFocused ? " is-focused" : " is-browsing")}>
      <canvas
        ref={canvasRef}
        className="shelf-canvas"
        tabIndex={0}
        aria-label="Interactive 3D shelf of books. Drag to browse."
      />
      <div className="shelf-caption">
        <p className="shelf-pos">{activeIndex + 1} / {catalog.length}</p>
        <p className="shelf-title">{activeBook?.shortTitle}</p>
        <p className="shelf-author">{activeBook?.author}</p>
        {!isFocused && (
          <button className="shelf-inspect" onClick={() => focusBook(activeIndex)}>
            Inspect
          </button>
        )}
      </div>
      {!isFocused && (
        <>
          <button className="shelf-arrow shelf-arrow--left" onClick={prevBook} aria-label="Previous">
            {"<"}
          </button>
          <button className="shelf-arrow shelf-arrow--right" onClick={nextBook} aria-label="Next">
            {">"}
          </button>
        </>
      )}
      {isFocused && selectedBook && (
        <aside className="shelf-details">
          <button className="shelf-back" onClick={backToShelf}>Back to shelf</button>
          <p className="shelf-details-title">{selectedBook.title}</p>
          <p className="shelf-details-author">{selectedBook.author}</p>
          <p className="shelf-details-desc">{selectedBook.description}</p>
          <p className="shelf-details-quote">"{selectedBook.quote}"</p>
          <p className="shelf-details-quoteby">- {selectedBook.quoteBy}</p>
          <a className="shelf-details-link" href={selectedBook.url} target="_blank" rel="noopener">{selectedBook.linkLabel || "View book"}</a>
          <p className="shelf-details-hint">drag to orbit - scroll to zoom - esc to close</p>
        </aside>
      )}
      {!ready && <div className="shelf-loading"><span>{status}...</span></div>}
    </div>
  );
}
