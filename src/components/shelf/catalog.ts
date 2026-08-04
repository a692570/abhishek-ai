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
    author: "Robert B. Cialdini",
    description: "Six principles that make people say yes. I keep coming back to this book because it explains why marketing works, not just how to do it. Reciprocity, commitment, social proof. If you have ever wondered why free samples convert, this is the physics behind it.",
    quote: "Everything we know about persuasion suggests that the way to get people to change is not by pressuring them but by helping them convince themselves.",
    quoteBy: "Robert B. Cialdini",
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
    author: "Sun Tzu",
    description: "Written 2,500 years ago and still the most practical book on strategy I have read. Every line is a compressed insight. The core idea: win before the battle starts. Most people skip this and go straight to fighting.",
    quote: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    quoteBy: "Sun Tzu",
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
    author: "Nassim Nicholas Taleb",
    description: "The book that changed how I think about risk. Taleb argues that the events that actually matter are the ones nobody predicted. Read this if you have ever been confident about a forecast. You will be less confident after, and that is the point.",
    quote: "Missing a train is only painful if you run after it. Likewise, not matching the idea of success others expect from you is only painful if that is what you are seeking.",
    quoteBy: "Nassim Nicholas Taleb",
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
    author: "Daniel Kahneman",
    description: "Two systems in your brain. System 1 is fast, automatic, and wrong more than you think. System 2 is slow, deliberate, and lazy. Every bias in marketing, hiring, and product decisions traces back to System 1 running when it should not.",
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
    id: "fluke",
    title: "Fluke: Chance, Chaos, and Why Everything We Do Matters",
    shortTitle: "Fluke",
    author: "Brian Klaas",
    description: "A book about how much of life is random, and why that is uncomfortable to accept. Klaas makes the case that the stories we tell about success and failure are mostly retrospective narratives imposed on chaos. Read it and you will stop trusting case studies quite so much.",
    quote: "The world is not deterministic, but it is also not random. It is somewhere in between, and that is where the interesting stuff happens.",
    quoteBy: "Brian Klaas",
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
    author: "Keigo Higashino",
    description: "A murder mystery where you know who did it by page 50. The question is whether the mathematician who helped cover it up can outthink the physicist detective. Higashino writes mysteries the way good product people write specs: every sentence earns its place.",
    quote: "Logic is the beginning of wisdom, not the end.",
    quoteBy: "Keigo Higashino",
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
    author: "Keigo Higashino",
    description: "The second Galileo detective novel. A murder that looks impossible, a detective who cares more about the physics than the feelings. Higashino trades emotion for precision, and somehow it hits harder because of it.",
    quote: "Sometimes the most rational answer is the one nobody wants to hear.",
    quoteBy: "Keigo Higashino",
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
    quote: "There is no such thing as a secret that stays buried forever.",
    quoteBy: "Keigo Higashino",
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
    author: "Jeffrey Archer",
    description: "The final book in the Clifton Chronicles. Archer is not subtle, but he is relentless. Every chapter ends on a hook. I read the whole series in two weeks. Not great literature. Great storytelling.",
    quote: "You can only be young once, but you can be immature forever.",
    quoteBy: "Jeffrey Archer",
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
    quote: "When a man has no more to say, his silence speaks for him.",
    quoteBy: "Jeffrey Archer",
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
    author: "Peter Thiel",
    description: "Notes on startups, or how to build the future. The case for monopoly and contrarian thinking. Thiel says competition is for losers. After working in a competitive market, I think he is right, and I think most people misunderstand what he means.",
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
    id: "on-writing-well",
    title: "On Writing Well",
    shortTitle: "On Writing Well",
    author: "William Zinsser",
    description: "The classic guide to writing nonfiction. Clarity, simplicity, and the discipline of revision. Zinsser taught me that most writing problems are thinking problems. If the sentence is unclear, the idea behind it probably is too.",
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
