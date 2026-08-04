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
    id: "influence",
    title: "Influence: The Psychology of Persuasion",
    shortTitle: "Influence",
    author: "Abhishek Sharma",
    description: "Six principles that make people say yes. I keep coming back to this book because it explains why marketing works, not just how to do it. Reciprocity, commitment, social proof. If you have ever wondered why free samples convert, this is the physics behind it.",
    quote: "I keep coming back to this book because it explains the mechanics behind decisions I used to think were gut calls. Reciprocity, social proof, scarcity. Once you see the patterns, you cannot unsee them in every marketing campaign you touch.",
    quoteBy: "Abhishek Sharma",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/28815.Influence",
    cover: "#1a3a5c",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "circuit",
    height: 2.05,
    thickness: 0.24,
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    shortTitle: "The Art of War",
    author: "Abhishek Sharma",
    description: "Written 2,500 years ago and still the most practical book on strategy I have read. Every line is a compressed insight. The core idea: win before the battle starts. Most people skip this and go straight to fighting.",
    quote: "Most strategy books talk about execution. This one talks about positioning. Win before the fight starts. I think about this every time I see a startup launch into a crowded market without a wedge.",
    quoteBy: "Abhishek Sharma",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/10534.The_Art_of_War",
    cover: "#3d1a1a",
    accent: "#d5a756",
    ink: "#f4ead7",
    motif: "lattice",
    height: 1.85,
    thickness: 0.16,
  },
  {
    id: "black-swan",
    title: "The Black Swan",
    shortTitle: "The Black Swan",
    author: "Abhishek Sharma",
    description: "The book that changed how I think about risk. Taleb argues that the events that actually matter are the ones nobody predicted. Read this if you have ever been confident about a forecast. You will be less confident after, and that is the point.",
    quote: "This book made me distrust every case study I had ever read. Taleb argues the events that matter most are the ones nobody predicted. After reading this, I stopped building plans that assumed the world was predictable.",
    quoteBy: "Abhishek Sharma",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/242472.The_Black_Swan",
    cover: "#0d0d0d",
    accent: "#e07a5f",
    ink: "#f4ead7",
    motif: "fracture",
    height: 2.1,
    thickness: 0.26,
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    shortTitle: "Thinking, Fast and Slow",
    author: "Abhishek Sharma",
    description: "Two systems in your brain. System 1 is fast, automatic, and wrong more than you think. System 2 is slow, deliberate, and lazy. Every bias in marketing, hiring, and product decisions traces back to System 1 running when it should not.",
    quote: "Every bias in marketing, hiring, and product decisions traces back to System 1 running when it should not. This book made me pause before sending emails, making hires, and trusting my gut. The pause is the gift.",
    quoteBy: "Abhishek Sharma",
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
    id: "fluke",
    title: "Fluke: Chance, Chaos, and Why Everything We Do Matters",
    shortTitle: "Fluke",
    author: "Abhishek Sharma",
    description: "A book about how much of life is random, and why that is uncomfortable to accept. Klaas makes the case that the stories we tell about success and failure are mostly retrospective narratives imposed on chaos. Read it and you will stop trusting case studies quite so much.",
    quote: "I read this at a point when I was crediting myself for outcomes that were partly luck. Klaas does not let you do that. The stories we tell about success are mostly retrospective narratives imposed on chaos. Honest and uncomfortable.",
    quoteBy: "Abhishek Sharma",
    format: "Hardcover",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/199650006-fluke",
    cover: "#2a4a3e",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "wave",
    height: 2.0,
    thickness: 0.24,
  },
  {
    id: "devotion-of-suspect-x",
    title: "The Devotion of Suspect X",
    shortTitle: "Devotion of Suspect X",
    author: "Abhishek Sharma",
    description: "A murder mystery where you know who did it by page 50. The question is whether the mathematician who helped cover it up can outthink the physicist detective. Higashino writes mysteries the way good product people write specs: every sentence earns its place.",
    quote: "You know who did it by page 50. The tension is not in the reveal but in watching a mathematician and a physicist think past each other. Higashino writes mysteries the way I want product specs written: every sentence earns its place.",
    quoteBy: "Abhishek Sharma",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/16253758-the-devotion-of-suspect-x",
    cover: "#1a1a2e",
    accent: "#e07a5f",
    ink: "#f4ead7",
    motif: "maze",
    height: 1.95,
    thickness: 0.2,
  },
  {
    id: "salvation-of-a-saint",
    title: "Salvation of a Saint",
    shortTitle: "Salvation of a Saint",
    author: "Abhishek Sharma",
    description: "The second Galileo detective novel. A murder that looks impossible, a detective who cares more about the physics than the feelings. Higashino trades emotion for precision, and somehow it hits harder because of it.",
    quote: "A murder that looks physically impossible. The detective cares more about the physics than the feelings. Higashino trades emotion for precision, and somehow that makes the human moments hit harder when they finally arrive.",
    quoteBy: "Abhishek Sharma",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/10386285-salvation-of-a-saint",
    cover: "#2a1a3a",
    accent: "#d5a756",
    ink: "#f4ead7",
    motif: "circuit",
    height: 1.95,
    thickness: 0.2,
  },
  {
    id: "journey-midnight-sun",
    title: "Journey Under the Midnight Sun",
    shortTitle: "Journey Under the Midnight Sun",
    author: "Keigo Higashino",
    description: "A single crime traced across two decades. No detective, no whodunit. Just two people shaped by one moment, and the slow accumulation of consequences. The longest Higashino I have read, and the one that stayed with me the most.",
    quote: "No detective. No whodunit. Just two lives shaped by one moment, traced across twenty years. It is the longest Higashino I have read and the one that stayed with me the most. The accumulation of small choices is the actual story.",
    quoteBy: "Abhishek Sharma",
    format: "Paperback",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/16151.Journey_Under_the_Midnight_Sun",
    cover: "#0a0a1a",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "continuum",
    height: 2.1,
    thickness: 0.28,
  },
  {
    id: "this-was-a-man",
    title: "This Was a Man",
    shortTitle: "This Was a Man",
    author: "Abhishek Sharma",
    description: "The final book in the Clifton Chronicles. Archer is not subtle, but he is relentless. Every chapter ends on a hook. I read the whole series in two weeks. Not great literature. Great storytelling.",
    quote: "Not great literature. Great storytelling. Every chapter ends on a hook and you cannot stop. I read the whole Clifton Chronicles in two weeks. Archer taught me that pacing is a feature, not a compromise.",
    quoteBy: "Abhishek Sharma",
    format: "Hardcover",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/25730513-this-was-a-man",
    cover: "#5c2d1a",
    accent: "#e8c547",
    ink: "#f4ead7",
    motif: "steps",
    height: 2.05,
    thickness: 0.26,
  },
  {
    id: "cometh-the-hour",
    title: "Cometh the Hour",
    shortTitle: "Cometh the Hour",
    author: "Jeffrey Archer",
    description: "Book six of the Clifton Chronicles. If you have read this far, you are not stopping. Archer does not let you. The plot twists are sometimes absurd, but the pacing is so tight you do not care until after.",
    quote: "Book six and you are not stopping. The plot twists are sometimes absurd but the pacing is so tight you do not care until after. That is a skill I respect more after trying to write anything that holds attention.",
    quoteBy: "Abhishek Sharma",
    format: "Hardcover",
    availability: "Widely available",
    url: "https://www.goodreads.com/book/show/25730485-cometh-the-hour",
    cover: "#4a2515",
    accent: "#d5a756",
    ink: "#f4ead7",
    motif: "organization",
    height: 2.05,
    thickness: 0.26,
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    shortTitle: "Zero to One",
    author: "Abhishek Sharma",
    description: "Notes on startups, or how to build the future. The case for monopoly and contrarian thinking. Thiel says competition is for losers. After working in a competitive market, I think he is right, and I think most people misunderstand what he means.",
    quote: "Thiel says competition is for losers. After working in a competitive market, I think he is right, and I think most people misunderstand what he means. He is not saying avoid competition. He is saying build something where competition does not apply.",
    quoteBy: "Abhishek Sharma",
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
    id: "on-writing-well",
    title: "On Writing Well",
    shortTitle: "On Writing Well",
    author: "Abhishek Sharma",
    description: "The classic guide to writing nonfiction. Clarity, simplicity, and the discipline of revision. Zinsser taught me that most writing problems are thinking problems. If the sentence is unclear, the idea behind it probably is too.",
    quote: "Zinsser taught me that most writing problems are thinking problems. If the sentence is unclear, the idea behind it probably is too. I still reread chapters of this before writing anything important.",
    quoteBy: "Abhishek Sharma",
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
