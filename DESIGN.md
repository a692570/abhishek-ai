---
name: Abhishek Sharma
description: Personal publication with writing, software, and reading.
colors:
  text: "#292921"
  text-secondary: "#65645a"
  bg: "#f8f6ef"
  surface: "#eeebe0"
  border: "#d9d7cb"
  accent: "#9b472c"
  accent-hover: "#71321f"
  dark-text: "#ece9df"
  dark-text-secondary: "#afafa2"
  dark-bg: "#1b1d1b"
  dark-surface: "#272b25"
  dark-border: "#3d4138"
  dark-accent: "#e7a17d"
  dark-accent-hover: "#f3b99a"
typography:
  display:
    fontFamily: '"Geist Mono", ui-monospace, monospace'
    fontSize: "clamp(2.8rem, 5.3vw, 4.05rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.043em"
  headline:
    fontFamily: '"Geist Mono", ui-monospace, monospace'
    fontSize: "2.1rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Geist Mono", ui-monospace, monospace'
    fontSize: "1.65rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-.02em"
  body:
    fontFamily: '"Geist Mono", ui-monospace, monospace'
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: '"Geist Mono", ui-monospace, monospace'
    fontSize: ".69rem"
    lineHeight: 1.5
rounded:
  surface: "3px"
  circle: "50%"
spacing:
  row-gap: "1.2rem"
  section: "4.6rem"
  section-mobile: "3.2rem"
components:
  theme-toggle:
    textColor: "{colors.text}"
    rounded: "{rounded.circle}"
    size: "44px"
  featured-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.surface}"
    padding: "2.2rem 2.5rem"
---

# Design System: Abhishek Sharma

## Overview

**Creative North Star: "Personal publication"**

The site uses Geist Mono throughout, with scale, weight, and spacing separating headings, body text, and metadata. Warm paper, dark ink, thin dividers, and restrained rust links keep writing and personal work readable. The supplied portrait and interactive bookshelf provide the personal character.

**Key Characteristics:**
- Geist Mono headings, reading text, and dates, following Abhishek’s personal font preference.
- A centered content column with open rows and one quiet featured surface.
- Paired light and dark themes with the same hierarchy.

## Colors

### Primary

Rust identifies links, heading hover states, focus outlines, and small punctuation accents. The lighter dark-theme accent keeps the same role against charcoal. Hover uses the corresponding accent-hover token.

### Neutral

Warm ivory is the light background; charcoal is the dark background. Text and text-secondary distinguish reading content from dates and supporting descriptions. Surface identifies the featured project and fallback panels. Border separates navigation, section headings, and list rows.

**The Theme Pair Rule.** Use the existing semantic CSS properties so every surface follows the active theme.

## Typography

Geist Mono sets all site text, including headings, body text, navigation, metadata, and generated shelf text. The variable font is self hosted in public/fonts and preloaded by the layout. Size, weight, leading, and spacing distinguish text roles.

The frontmatter records the desktop hierarchy. Section headings reduce to 1.8rem and article titles to 1.55rem at the main mobile breakpoint. The name becomes 2.8rem, then 2.5rem on the narrowest layout. Body copy keeps comfortable leading; supporting descriptions are smaller and use secondary text.

**The Metadata Rule.** Metadata supports its heading. In the featured Bolo block, it follows the project name.

## Layout

The content column is capped at 880px with 1.5rem side gutters. At 650px and below, gutters become 1.25rem, the navigation shortens, and section spacing reduces to the mobile token. At 360px and below, gutters become 1rem.

Desktop writing and career rows share a 108px date column. Writing dates move above their titles on mobile, while career dates retain a narrower 76px column. The introduction pairs its text with a circular portrait; mobile keeps the name and portrait side by side and places introductory copy below them. Book links change from two columns to one.

## Elevation & Depth

Page chrome uses tonal surfaces and thin borders without box shadows. The interactive bookshelf supplies object depth within its own canvas. Its selected-book panel uses a nearly opaque background and an 8px backdrop blur on wider screens, with a border separating it from the scene. Compact layouts place the notes below the canvas on the page background.

## Shapes

Open rows and straight dividers carry most content. The featured project has a slight corner radius from the surface token. The portrait and theme control are circular. Preserve the real Bolo app icon and its rounded silhouette.

## Components

- **Navigation:** a Geist Mono wordmark, compact section links, and a circular theme button. The button shows a moon to offer dark mode and a sun to offer light mode. Its accessible label follows the same action.
- **Writing rows:** a date, title, supporting description, and destination affordance. The entire row is a link. Hover changes the title to the accent.
- **Project links:** the featured project uses a tonal surface, name, metadata below the name, short copy, and the actual app icon. Ordinary projects use open divided rows and sans titles.
- **Disclosures:** native details and summary controls reveal earlier writing, more projects, the book list, and career history. Summary controls retain a minimum 44px height and a visible open state.
- **Portrait:** the supplied center image remains the fallback. Direction tracking runs only with a fine pointer and hover support, and stops for reduced motion.
- **Bookshelf:** the scene loads when visible. One sticky control row provides previous and next buttons, the current position, and an open or return action. Notes sit at the right on wider screens and flow below the canvas when the shelf is narrower than 760px. The title picker opens the book details; Goodreads remains a separate destination. Without JavaScript, the page provides Goodreads links. Without WebGL, the picker still opens book details.
- **Reading history:** Goodreads supplies the read list, ratings, recorded dates, public reviews, and cover URLs. Five-star books appear in 3D, with newer additions first. A separate disclosure contains the complete history, with title and author search, a result count, and batches of 24 rows. Without JavaScript, every row remains available. Rows use the existing .9rem title, .8rem author, and .68rem metadata scale; .75rem supports the source and results text.
- **Shelf type:** shelf titles use 1.5rem Geist Mono. Notes use .9rem Geist Mono, controls and author text .8rem, compact actions .75rem, and fallback text .85rem. These component sizes keep the twelve-book navigator compact and follow the existing supporting-text scale.

Interactive controls use an accent focus outline with a 5px offset. Theme hover transitions last .15s. The shelf retains its 3D focus and return motion; notes appear with the selected book. Reduced-motion preferences suppress CSS transitions and portrait tracking.

## Do's and Don'ts

### Do:
- Do use semantic theme properties for backgrounds, text, borders, and accents.
- Do preserve the heading, body, and metadata role separation.
- Do retain visible keyboard focus and meaningful control labels.
- Do keep the supplied portrait, actual app icon, and HTML book list available.

### Don't:
- Don't place project metadata above the featured project heading.
- Don't replace real personal or project assets with invented product imagery.
- Don't require portrait motion to access any content.
