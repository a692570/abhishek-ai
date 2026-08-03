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
};

export const catalog: CatalogBook[] = [
  {
    id: "hooked",
    title: "Hooked",
    shortTitle: "Hooked",
    author: "Nir Eyal",
    description: "How to build habit-forming products. The behavioral model behind products people cannot put down.",
    quote: "Many of the products we use every day are designed to create habits.",
    quoteBy: "Nir Eyal",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/22667755-hooked",
    cover: "#2d4a3e",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "circuit",
    height: 2.0,
    thickness: 0.22,
  },
  {
    id: "the-hard-thing-about-hard-things",
    title: "The Hard Thing About Hard Things",
    shortTitle: "The Hard Thing",
    author: "Ben Horowitz",
    description: "Building a company when there is no easy answer. The brutal truths of leadership under pressure.",
    quote: "There is no formula for dealing with hard things.",
    quoteBy: "Ben Horowitz",
    format: "Hardcover",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/18114372-the-hard-thing-about-hard-things",
    cover: "#8b1a1a",
    accent: "#d5a756",
    ink: "#f4ead7",
    motif: "lattice",
    height: 2.1,
    thickness: 0.28,
  },
  {
    id: "the-design-of-everyday-things",
    title: "The Design of Everyday Things",
    shortTitle: "Design of Everyday Things",
    author: "Don Norman",
    description: "Why some products delight and others frustrate. The foundational text on human-centered design.",
    quote: "Good design is actually a lot harder to notice than poor design.",
    quoteBy: "Don Norman",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/940.The_Design_of_Everyday_Things",
    cover: "#1a3a5c",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "organization",
    height: 2.05,
    thickness: 0.24,
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    shortTitle: "Zero to One",
    author: "Peter Thiel",
    description: "Notes on startups, or how to build the future. The case for monopoly and contrarian thinking.",
    quote: "Competition is for losers.",
    quoteBy: "Peter Thiel",
    format: "Hardcover",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/21080144-zero-to-one",
    cover: "#1a1a1a",
    accent: "#e07a5f",
    ink: "#f4ead7",
    motif: "steps",
    height: 1.95,
    thickness: 0.2,
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    shortTitle: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "The two systems that drive the way we think. A landmark in behavioral economics.",
    quote: "We can be blind to the obvious, and we are also blind to our blindness.",
    quoteBy: "Daniel Kahneman",
    format: "Hardcover",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
    cover: "#3d2952",
    accent: "#d5a756",
    ink: "#f4ead7",
    motif: "maze",
    height: 2.16,
    thickness: 0.3,
  },
  {
    id: "crossing-the-chasm",
    title: "Crossing the Chasm",
    shortTitle: "Crossing the Chasm",
    author: "Geoffrey A. Moore",
    description: "Marketing and selling disruptive products to mainstream customers. The technology adoption lifecycle.",
    quote: "The chasm is the most difficult and unforgiving phase in the whole product life cycle.",
    quoteBy: "Geoffrey A. Moore",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/2256.Crossing_the_Chasm",
    cover: "#6f2130",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "continuum",
    height: 2.0,
    thickness: 0.22,
  },
  {
    id: "the-mom-test",
    title: "The Mom Test",
    shortTitle: "The Mom Test",
    author: "Rob Fitzpatrick",
    description: "How to talk to customers and learn if your business is a good idea when everyone is lying to you.",
    quote: "The goal of a customer interview is not to get compliments.",
    quoteBy: "Rob Fitzpatrick",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/23463279-the-mom-test",
    cover: "#2a5f3f",
    accent: "#e07a5f",
    ink: "#f4ead7",
    motif: "gather",
    height: 1.9,
    thickness: 0.18,
  },
  {
    id: "shape-up",
    title: "Shape Up: Stop Running in Circles and Ship Work that Matters",
    shortTitle: "Shape Up",
    author: "Ryan Singer",
    description: "The product development process from Basecamp. How to scope, bet, and build in six-week cycles.",
    quote: "When you shape the work, you give the team the right level of constraint.",
    quoteBy: "Ryan Singer",
    format: "Free online",
    availability: "Free at basecamp.com/shapeup",
    url: "https://basecamp.com/shapeup",
    cover: "#1a1a2e",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "fracture",
    height: 2.0,
    thickness: 0.22,
  },
  {
    id: "on-writing-well",
    title: "On Writing Well",
    shortTitle: "On Writing Well",
    author: "William Zinsser",
    description: "The classic guide to writing nonfiction. Clarity, simplicity, and the discipline of revision.",
    quote: "Clutter is the disease of American writing.",
    quoteBy: "William Zinsser",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/53343.On_Writing_Well",
    cover: "#5c3d2e",
    accent: "#d5a756",
    ink: "#f4ead7",
    motif: "wave",
    height: 1.95,
    thickness: 0.2,
  },
];
