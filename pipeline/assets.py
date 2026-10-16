"""Fetch stock images from Wikimedia Commons (only when a scene asks for one).

Only keeps files whose licence is public domain / CC0 / CC BY / CC BY-SA and records the credit,
so the video description can attribute them.
"""
import json
import os
import re
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "script-to-video/0.1 (personal project)"}
OK_LICENCE = re.compile(r"public domain|cc0|cc by|pd", re.I)


def _get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read()


def fetch_image(query: str, dest_dir: str, name: str):
    """Returns {'src': filename, 'credit': str} or None."""
    q = urllib.parse.urlencode({
        "action": "query", "generator": "search", "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": 6, "gsrlimit": 8, "prop": "imageinfo",
        "iiprop": "url|extmetadata", "iiurlwidth": 1400, "format": "json",
    })
    try:
        data = json.loads(_get(f"{API}?{q}"))
    except Exception as e:  # noqa: BLE001
        print(f"[assets] search failed for {query!r}: {e}")
        return None
    pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in pages:
        info = (p.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata", {})
        lic = meta.get("LicenseShortName", {}).get("value", "")
        url = info.get("thumburl") or info.get("url")
        if not url or not OK_LICENCE.search(lic):
            continue
        artist = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "Unknown"))
        try:
            blob = _get(url)
        except Exception as e:  # noqa: BLE001
            print(f"[assets] download failed: {e}")
            continue
        fn = f"{name}.jpg"
        with open(os.path.join(dest_dir, fn), "wb") as f:
            f.write(blob)
        return {"src": f"gen/{fn}", "credit": f"{artist} / {lic} / Wikimedia Commons"}
    print(f"[assets] no usable image for {query!r}")
    return None
