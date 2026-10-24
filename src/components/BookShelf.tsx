import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { catalog } from "./shelf/catalog";
import { ShelfEngine, type ShelfMode } from "./shelf/ShelfEngine";

export default function BookShelf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ShelfEngine | null>(null);
  const pickerRef = useRef<HTMLDetailsElement>(null);
  const noteRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<ShelfMode>("browse");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Loading the bookshelf");
  const [failed, setFailed] = useState(false);

  const selectedBook = selectedIndex !== null ? catalog[selectedIndex] : null;
  const isFocused = mode !== "browse";
  const currentIndex = selectedIndex ?? activeIndex;
  const canNavigate = ready || failed;

  useEffect(() => {
    let cancelled = false;
    let engine: ShelfEngine | null = null;
    async function start() {
      if (!canvasRef.current) return;
      await document.fonts.ready;
      if (cancelled || !canvasRef.current) return;
      try {
        engine = new ShelfEngine(canvasRef.current, catalog, {
          onActiveIndex: setActiveIndex,
          onMode: (nextMode, index) => { setMode(nextMode); setSelectedIndex(index); },
          onStatus: setStatus,
          onReady: () => setReady(true),
        });
        engineRef.current = engine;
      } catch {
        if (!cancelled) {
          setFailed(true);
          setStatus("The 3D shelf is unavailable. Choose a title to read my note.");
        }
      }
    }
    void start();
    const themeObserver = new MutationObserver(() => { engine?.refreshTheme(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelled = true;
      themeObserver.disconnect();
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  function openBook(index: number) {
    if (engineRef.current) {
      engineRef.current.focusBook(index);
    } else if (failed) {
      setSelectedIndex(index);
      setActiveIndex(index);
      setMode("inspect");
      setStatus(`Reading about ${catalog[index].shortTitle}`);
    }
  }

  function backToShelf() {
    if (engineRef.current) engineRef.current.returnToShelf();
    else {
      setSelectedIndex(null);
      setMode("browse");
      pickerRef.current?.querySelector("summary")?.focus({ preventScroll: true });
    }
  }

  function navigateTo(index: number) {
    if (engineRef.current) engineRef.current.navigateTo(index);
    else if (failed) openBook(index);
  }

  function navigateBy(direction: number) {
    if (engineRef.current) engineRef.current.navigateBy(direction);
    else if (failed) openBook(Math.max(0, Math.min(catalog.length - 1, currentIndex + direction)));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!canNavigate || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && event.target.matches("input, textarea, select")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      backToShelf();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      navigateBy(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      navigateTo(event.key === "Home" ? 0 : catalog.length - 1);
    } else if (event.target === canvasRef.current) {
      if ((event.key === "Enter" || event.key === " ") && !isFocused) {
        event.preventDefault();
        openBook(activeIndex);
      } else if (event.key.toLowerCase() === "r") {
        engineRef.current?.resetFocusView();
      }
    }
  }

  function pickBook(index: number) {
    openBook(index);
    if (pickerRef.current) pickerRef.current.open = false;
    if (!failed) {
      canvasRef.current?.focus({ preventScroll: true });
      canvasRef.current?.scrollIntoView({ block: "nearest" });
    }
  }

  useEffect(() => {
    if (failed && selectedBook) {
      noteRef.current?.focus({ preventScroll: true });
      noteRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [failed, selectedBook]);

  return (
    <div className={"shelf-experience" + (ready ? " is-ready is-active" : "") + (isFocused ? " is-focused" : " is-browsing") + (failed ? " is-fallback" : "")} onKeyDown={handleKeyDown}>
      <div className="shelf-toolbar" aria-label="Bookshelf controls">
        <div className="shelf-navigation" role="group" aria-label="Choose a book">
          <button type="button" className="shelf-step" aria-label="Previous book" disabled={!canNavigate || currentIndex === 0} onClick={() => navigateBy(-1)}><span aria-hidden="true">←</span><span className="shelf-step-label">Previous</span></button>
          <span className="shelf-position" aria-live="polite" aria-atomic="true">{currentIndex + 1} of {catalog.length}</span>
          <button type="button" className="shelf-step" aria-label="Next book" disabled={!canNavigate || currentIndex === catalog.length - 1} onClick={() => navigateBy(1)}><span className="shelf-step-label">Next</span><span aria-hidden="true">→</span></button>
        </div>
        <button type="button" className="shelf-action" disabled={!canNavigate} onClick={isFocused ? backToShelf : () => openBook(activeIndex)}>{isFocused ? "Back to shelf" : "Read my note"}</button>
      </div>
      <div className="shelf-stage">
        {failed ? <p className="shelf-fallback">The 3D shelf is unavailable in this browser. Choose a title below to read my note.</p> : <canvas
          ref={canvasRef}
          className="shelf-canvas"
          tabIndex={0}
          aria-label="Interactive 3D bookshelf. Drag sideways or use left and right arrow keys to browse. Enter opens a book. Escape returns to the shelf."
          aria-describedby="shelf-instructions"
        />}
        {isFocused && selectedBook && (
          <aside ref={noteRef} className="shelf-details" tabIndex={-1} aria-labelledby="shelf-note-title">
            <h3 id="shelf-note-title" className="shelf-details-title">{selectedBook.title}</h3>
            <p className="shelf-details-author">{selectedBook.author}</p>
            <p className="shelf-details-label">Why it stayed with me</p>
            <p className="shelf-details-note">{selectedBook.quote}</p>
            <a className="shelf-details-link" href={selectedBook.url} target="_blank" rel="noopener">View on Goodreads<span aria-hidden="true"> ↗</span></a>
            {!failed && <p className="shelf-details-hint">Drag to turn the book. Press R to reset its view.</p>}
          </aside>
        )}
        {!ready && !failed && <div className="shelf-loading" role="status"><span>{status}…</span></div>}
      </div>
      <p id="shelf-instructions" className="shelf-instructions">{failed ? "Every book and note is available below." : "Drag sideways to browse · Select a book to read my note · Esc to return"}</p>
      <details className="book-list-details shelf-book-picker" ref={pickerRef}>
        <summary>Browse the book list</summary>
        <ul className="book-list">{catalog.map((book, index) => <li key={book.id}><button type="button" disabled={!canNavigate} aria-current={currentIndex === index ? "true" : undefined} onClick={() => pickBook(index)}>{book.shortTitle}<span>{book.author}</span></button></li>)}</ul>
      </details>
    </div>
  );
}
