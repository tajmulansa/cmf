"""Parse a script file into raw scenes.

Format, one scene per line:
    [tag] narration text
    [tag: argument] narration text
    narration text with no tag  -> the planner (AI or heuristic) picks the template

Lines starting with '#' and blank lines are ignored.
"""
import re

TAG = re.compile(r"^\s*\[(?P<tag>[a-zA-Z]+)(?:\s*:\s*(?P<arg>[^\]]*))?\]\s*(?P<text>.*)$")

KNOWN_TAGS = {"hook", "map", "number", "image", "text"}


def parse(raw: str) -> list[dict]:
    scenes = []
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = TAG.match(line)
        if m:
            tag = m.group("tag").lower()
            if tag not in KNOWN_TAGS:
                raise ValueError(f"Unknown tag [{tag}] in line: {line!r}. Known: {sorted(KNOWN_TAGS)}")
            arg = (m.group("arg") or "").strip()
            text = m.group("text").strip()
        else:
            tag, arg, text = None, "", line
        if not text:
            raise ValueError(f"Scene has no narration text: {line!r}")
        scenes.append({"tag": tag, "arg": arg, "text": text})
    if not scenes:
        raise ValueError("Script is empty")
    return scenes
