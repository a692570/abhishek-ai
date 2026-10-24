# Goodreads connection
The site reads Abhishek’s public Goodreads Read shelf, user 50942938.
A checked-in snapshot supports local builds without network access.
GitHub Pages refreshes the snapshot before every deployment and daily at 13:43 UTC.
The importer fetches every RSS page, validates the source, and writes atomically.
Any failed or incomplete import stops deployment and keeps the current live site.
Twelve recent additions appear in 3D; the complete history is searchable below.

Profile: https://www.goodreads.com/user/show/50942938-abhishek-sharma
Feed: https://www.goodreads.com/review/list_rss/50942938?shelf=read&per_page=200&page=1

## Data
The snapshot is src/data/goodreads.json. It contains public book titles, authors, ratings, recorded reading dates, review links, cover links, and the user’s public reviews. It excludes publisher descriptions and authentication details. A zero rating means unrated. An absent reading date remains absent. Feed order follows additions to the Read shelf, not finish dates.

The initial import on October 24, 2026 contained 317 unique entries across 200, 117, and 0 entries per page. Two entries included written reviews. This is an initial count, not a fixed validation threshold.

## Refresh and checks
Run `python3 scripts/sync-goodreads.py` to refresh the local snapshot. Run `python3 -m unittest discover -s scripts -p 'test_*.py'` for importer checks. `npm run build` reads the snapshot without fetching Goodreads. These commands were exercised during implementation.

The daily schedule is in .github/workflows/deploy.yml. GitHub schedules may run later than the specified time. A manual workflow run refreshes and deploys through the same path. Scheduled builds update the deployed site without committing daily snapshot changes back to main.

The shelf uses Goodreads cover URLs when loading succeeds and keeps the procedural cover as its fallback. The history is rendered into HTML; search progressively reveals matching entries, 24 at a time. Without JavaScript, the full list remains visible when expanded.
