#!/usr/bin/env python3
"""Import the complete public Goodreads Read shelf into the website snapshot.
Fetch every RSS page before replacing the JSON file, preserving the feed order.
Publish only book metadata, ratings, reading dates, and the user's public reviews.
Failed requests, malformed pages, and pagination loops leave the snapshot intact.
The local website build uses the checked-in snapshot without network access.
GitHub Pages runs this importer before its build and on a daily schedule.
"""

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


USER_ID = "50942938"
PROFILE_URL = f"https://www.goodreads.com/user/show/{USER_ID}-abhishek-sharma"
SHELF_URL = f"https://www.goodreads.com/review/list/{USER_ID}?shelf=read"
FEED_URL = f"https://www.goodreads.com/review/list_rss/{USER_ID}"
OUTPUT = Path(__file__).resolve().parents[1] / "src/data/goodreads.json"
MAX_PAGES = 50


class FeedError(ValueError):
    pass


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.hidden = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.hidden += 1
        elif tag in {"br", "p", "div", "li", "blockquote"}:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.hidden = max(0, self.hidden - 1)
        elif tag in {"p", "div", "li", "blockquote"}:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)


def plain_text(value, paragraphs=False):
    parser = PlainText()
    parser.feed(unescape(value or ""))
    text = "".join(parser.parts).replace("\xa0", " ")
    if paragraphs:
        text = "\n".join(re.sub(r"[^\S\n]+", " ", line).strip() for line in text.splitlines())
        return re.sub(r"\n{3,}", "\n\n", text).strip()
    return re.sub(r"\s+", " ", text).strip()


def date_value(value, day_only=False):
    if not value or not value.strip():
        return None
    try:
        result = parsedate_to_datetime(value.strip())
        if result.tzinfo is None:
            raise ValueError("missing timezone")
        # Goodreads reading dates are calendar dates, not a time-zone conversion.
        if day_only:
            return result.date().isoformat()
        return result.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    except (TypeError, ValueError, OverflowError) as error:
        raise FeedError("Invalid Goodreads date") from error


def review_url(value):
    parsed = urlsplit(value or "")
    if parsed.scheme != "https" or parsed.hostname != "www.goodreads.com" or not re.fullmatch(r"/review/show/\d+", parsed.path):
        raise FeedError("Invalid Goodreads review link")
    return f"https://www.goodreads.com{parsed.path}"


def image_url(value):
    parsed = urlsplit(value or "")
    host = parsed.hostname or ""
    if parsed.scheme == "https" and host.endswith(".gr-assets.com") and not parsed.username and not parsed.password:
        return value
    return None


def parse_page(raw):
    try:
        root = ET.fromstring(raw)
    except ET.ParseError as error:
        raise FeedError("Malformed Goodreads RSS") from error
    channel = root.find("channel") if root.tag == "rss" else None
    if channel is None:
        raise FeedError("Expected a Goodreads RSS channel")
    source = urlsplit(channel.findtext("link") or "")
    if source.scheme != "https" or source.hostname != "www.goodreads.com" or source.path != f"/review/list_rss/{USER_ID}" or parse_qs(source.query).get("shelf") != ["read"]:
        raise FeedError("RSS does not match Abhishek's Read shelf")

    books = []
    for item in channel.findall("item"):
        book_id = (item.findtext("book_id") or "").strip()
        title = plain_text(item.findtext("title"))
        author = plain_text(item.findtext("author_name"))
        rating = (item.findtext("user_rating") or "").strip()
        if not re.fullmatch(r"\d+", book_id) or not title or not author or rating not in {"0", "1", "2", "3", "4", "5"}:
            raise FeedError("A Goodreads entry has missing or invalid book metadata")
        books.append({
            "id": book_id,
            "title": title,
            "author": author,
            "rating": int(rating),
            "readAt": date_value(item.findtext("user_read_at"), day_only=True),
            "addedAt": date_value(item.findtext("user_date_added")),
            "review": plain_text(item.findtext("user_review"), paragraphs=True),
            "url": f"https://www.goodreads.com/book/show/{book_id}",
            "reviewUrl": review_url(item.findtext("link")),
            "imageUrl": image_url(item.findtext("book_large_image_url")),
        })
    return books


def fetch_page(page):
    # Live RSS contract verified at https://www.goodreads.com/review/list_rss/50942938?shelf=read&per_page=200&page=1
    url = f"{FEED_URL}?{urlencode({'shelf': 'read', 'per_page': 200, 'page': page})}"
    request = Request(url, headers={"User-Agent": "Abhishek-personal-site-Goodreads-sync/1.0"})
    with urlopen(request, timeout=30) as response:
        return response.read()


def collect_books(fetch=fetch_page, max_pages=MAX_PAGES):
    books = []
    seen = set()
    for page in range(1, max_pages + 1):
        batch = parse_page(fetch(page))
        if not batch:
            if not books:
                raise FeedError("The Read shelf is empty; refusing to replace the snapshot")
            return books
        new_count = 0
        for book in batch:
            if book["id"] not in seen:
                books.append(book)
                seen.add(book["id"])
                new_count += 1
        if not new_count:
            raise FeedError("Goodreads repeated a page; the complete shelf could not be confirmed")
    raise FeedError("Goodreads pagination limit reached before the shelf ended")


def sync(output=OUTPUT, fetch=fetch_page):
    books = collect_books(fetch)
    snapshot = {
        "profileUrl": PROFILE_URL,
        "shelfUrl": SHELF_URL,
        "syncedAt": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "books": books,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent, suffix=".tmp", delete=False) as stream:
            temporary = Path(stream.name)
            json.dump(snapshot, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        os.replace(temporary, output)
    finally:
        if temporary and temporary.exists():
            temporary.unlink()
    return snapshot


if __name__ == "__main__":
    try:
        data = sync()
    except Exception as error:
        print(f"Goodreads sync failed: {error}. Existing snapshot was not changed.", file=sys.stderr)
        sys.exit(1)
    print(f"Synced {len(data['books'])} Read shelf entries from Goodreads.")
