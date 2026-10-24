"""Regression checks for the Goodreads feed importer.
Fixtures cover public shelf identity, metadata, dates, reviews, and pagination.
Failure cases assert the previous snapshot remains byte-for-byte unchanged.
Run with python3 scripts/test_sync_goodreads.py from any working directory.
All test fixtures are local; the test suite does not contact Goodreads.
The production importer is exercised separately against the public RSS feed.
"""

import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from urllib.error import HTTPError
import xml.etree.ElementTree as ET


sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("sync_goodreads", Path(__file__).with_name("sync-goodreads.py"))
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


def item(book_id="10", **changes):
    result = {
        "book_id": book_id,
        "title": "A Book",
        "author_name": "An Author",
        "user_rating": "4",
        "user_read_at": "Fri, 31 Jul 2026 00:00:00 +0000",
        "user_date_added": "Fri, 31 Jul 2026 21:43:23 -0700",
        "user_review": "",
        "link": "https://www.goodreads.com/review/show/123?utm_medium=api&utm_source=rss",
        "book_large_image_url": "https://i.gr-assets.com/images/books/10.jpg",
    }
    result.update(changes)
    return result


def feed(items, link=None):
    root = ET.Element("rss")
    channel = ET.SubElement(root, "channel")
    ET.SubElement(channel, "link").text = link or f"{importer.FEED_URL}?shelf=read&per_page=200&page=1"
    for fields in items:
        entry = ET.SubElement(channel, "item")
        for key, value in fields.items():
            if value is not None:
                ET.SubElement(entry, key).text = value
    return ET.tostring(root)


class ImportTests(unittest.TestCase):
    def test_metadata_and_dates(self):
        book = importer.parse_page(feed([item(title="  A &amp; B  ", author_name="Dan    Brown", user_rating="0")]))[0]
        self.assertEqual(book["title"], "A & B")
        self.assertEqual(book["author"], "Dan Brown")
        self.assertEqual(book["rating"], 0)
        self.assertEqual(book["readAt"], "2026-07-31")
        self.assertEqual(book["addedAt"], "2026-08-01T04:43:23Z")
        self.assertEqual(book["url"], "https://www.goodreads.com/book/show/10")
        self.assertEqual(book["reviewUrl"], "https://www.goodreads.com/review/show/123")
        self.assertEqual(book["imageUrl"], "https://i.gr-assets.com/images/books/10.jpg")
        self.assertEqual(set(book), {"id", "title", "author", "rating", "readAt", "addedAt", "review", "url", "reviewUrl", "imageUrl"})

    def test_read_date_preserves_calendar_day(self):
        book = importer.parse_page(feed([item(user_read_at="Fri, 31 Jul 2026 23:59:00 -0700")]))[0]
        self.assertEqual(book["readAt"], "2026-07-31")

    def test_blank_dates_and_untrusted_cover(self):
        book = importer.parse_page(feed([item(user_read_at="", user_date_added="", book_large_image_url="https://elsewhere.example/cover.jpg")]))[0]
        self.assertIsNone(book["readAt"])
        self.assertIsNone(book["addedAt"])
        self.assertIsNone(book["imageUrl"])

    def test_missing_rating_is_not_zero(self):
        for value in [None, "", "6", "-1", "three"]:
            with self.subTest(value=value), self.assertRaises(importer.FeedError):
                importer.parse_page(feed([item(user_rating=value)]))

    def test_reviews_are_plain_text_with_breaks(self):
        source = "<p>First &amp; second.</p><p>Next<br />line.</p><script>hidden</script>"
        book = importer.parse_page(feed([item(user_review=source)]))[0]
        self.assertEqual(book["review"], "First & second.\n\nNext\nline.")
        self.assertEqual(importer.plain_text("&lt;b&gt;Bold&lt;/b&gt;"), "Bold")

    def test_wrong_profile_or_shelf_rejected(self):
        for link in ["https://www.goodreads.com/review/list_rss/12680?shelf=read", f"{importer.FEED_URL}?shelf=to-read"]:
            with self.subTest(link=link), self.assertRaises(importer.FeedError):
                importer.parse_page(feed([item()], link=link))

    def test_malformed_metadata_and_xml_rejected(self):
        for raw in [b"<html>Unavailable</html>", b"<rss>", feed([item(author_name="")]), feed([item(user_date_added="yesterday")])]:
            with self.subTest(raw=raw[:60]), self.assertRaises(importer.FeedError):
                importer.parse_page(raw)

    def test_pagination_keeps_order_and_deduplicates(self):
        pages = [feed([item("20"), item("10"), item("20")]), feed([item("10"), item("30")]), feed([])]
        requested = []
        def fetch(page):
            requested.append(page)
            return pages[page - 1]
        self.assertEqual([book["id"] for book in importer.collect_books(fetch)], ["20", "10", "30"])
        self.assertEqual(requested, [1, 2, 3])

    def test_failed_sync_never_replaces_previous_snapshot(self):
        def http_failure(page):
            if page == 1:
                return feed([item()])
            raise HTTPError(importer.FEED_URL, 503, "Unavailable", None, None)
        failures = {
            "empty": lambda page: feed([]),
            "repeated": lambda page: feed([item()]),
            "malformed_second_page": lambda page: feed([item()]) if page == 1 else b"<html>Failure</html>",
            "http_second_page": http_failure,
        }
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "snapshot.json"
            original = b'{"existing":"snapshot"}\n'
            for name, fetch in failures.items():
                output.write_bytes(original)
                with self.subTest(case=name), self.assertRaises(Exception):
                    importer.sync(output, fetch)
                self.assertEqual(output.read_bytes(), original)
                self.assertEqual(list(Path(directory).glob("*.tmp")), [])

    def test_pagination_limit_fails(self):
        with self.assertRaises(importer.FeedError):
            importer.collect_books(lambda page: feed([item(str(page))]), max_pages=2)

    def test_completed_sync_writes_schema(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "data" / "snapshot.json"
            result = importer.sync(output, lambda page: feed([item()]) if page == 1 else feed([]))
            self.assertEqual(json.loads(output.read_text()), result)
            self.assertEqual(set(result), {"profileUrl", "shelfUrl", "syncedAt", "books"})
            self.assertTrue(result["syncedAt"].endswith("Z"))


if __name__ == "__main__":
    unittest.main()
