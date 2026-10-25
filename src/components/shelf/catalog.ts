import reading from "../../data/goodreads.json";
import personalNotes from "../../data/book-notes.json";

export type BookMotif =
  | "lattice"
  | "corrosion"
  | "efficiency"
  | "network"
  | "boom"
  | "organization"
  | "schematic"
  | "flight"
  | "circuit"
  | "orbit"
  | "branches"
  | "wave"
  | "runner"
  | "gather"
  | "maze"
  | "fracture"
  | "continuum"
  | "windows"
  | "steps";

export type CatalogBook = {
  id: string;
  title: string;
  shortTitle: string;
  author: string;
  description: string;
  quote: string;
  quoteBy: string;
  format: string;
  availability: string;
  url: string;
  cover: string;
  accent: string;
  ink: string;
  motif: BookMotif;
  height: number;
  thickness: number;
  coverImage?: string;
  linkLabel?: string;
  living?: boolean;
  rating: number;
  readAt: string | null;
  reviewUrl: string;
  noteLabel: string;
};

const palettes = [
  ["#1a3a5c", "#e8c547"], ["#3d1a1a", "#d5a756"],
  ["#2a4a3e", "#e8c547"], ["#3d2952", "#d5a756"],
  ["#453721", "#e8c547"], ["#243b4b", "#e07a5f"],
];
const motifs: BookMotif[] = ["circuit", "lattice", "wave", "maze", "branches", "orbit"];

const notes: Record<string, string> = personalNotes;
const seenTitles = new Set<string>();

// Keep the newest edition of each featured title. Full history retains every entry.
export const catalog: CatalogBook[] = reading.books.filter(book => {
  if (book.rating !== 5 || /^(Death Note|One Piece)\b/i.test(book.title)) return false;
  const title = book.title.replace(/\s*\([^)]*\)\s*$/, "").trim().toLowerCase();
  const key = `${title}|${book.author.toLowerCase()}`;
  if (seenTitles.has(key)) return false;
  seenTitles.add(key);
  return true;
}).map((book) => {
  const seed = Number(book.id);
  const palette = palettes[seed % palettes.length];
  const rating = book.rating ? `My Goodreads rating: ${book.rating} of 5.` : "On my Goodreads read shelf.";
  const note = book.review || notes[book.id] || "";
  return {
    id: book.id,
    title: book.title,
    shortTitle: book.title.replace(/\s*\([^)]*#\d[^)]*\)$/, ""),
    author: book.author,
    description: rating,
    quote: note,
    quoteBy: note ? "Abhishek Sharma" : "",
    format: "Book",
    availability: "Read",
    url: book.url,
    cover: palette[0],
    accent: palette[1],
    ink: "#f4ead7",
    motif: motifs[seed % motifs.length],
    height: 1.9 + (seed % 7) * .04,
    thickness: .2 + (seed % 5) * .02,
    rating: book.rating,
    readAt: book.readAt,
    reviewUrl: book.reviewUrl,
    coverImage: book.imageUrl ?? undefined,
    noteLabel: book.review ? "My Goodreads review" : "My take",
  };
});
