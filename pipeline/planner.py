"""Decide which template each scene uses and fill its parameters.

Order of precedence:
  1. An explicit [tag] from the script always wins (hints = manual override).
  2. Otherwise a small local LLM (llama.cpp, JSON-constrained) picks one.
  3. If no model is available, a rule-based fallback picks one.
"""
import json
import os
import re

TEMPLATES = ["hook", "map", "number", "image", "text"]

NUM_RE = re.compile(r"(?P<val>\d[\d,]*\.?\d*)\s*(?P<unit>%|percent|million|billion|thousand|km²|km2|km|miles|years|degrees|°c|°f)?", re.I)


def _parse_number(s: str):
    """'14 million km²' -> (14.0, 'million km²'); returns None if no number."""
    m = re.match(r"\s*(\d[\d,]*\.?\d*)\s*(.*)$", s)
    if not m:
        return None
    return float(m.group(1).replace(",", "")), m.group(2).strip()


def from_tag(scene: dict) -> dict:
    tag, arg = scene["tag"], scene["arg"]
    if tag == "map":
        return {"template": "map", "params": {"place": arg or ""}}
    if tag == "number":
        parsed = _parse_number(arg)
        if not parsed:
            raise ValueError(f"[number: ...] needs a number, got {arg!r}")
        return {"template": "number", "params": {"value": parsed[0], "unit": parsed[1]}}
    if tag == "image":
        return {"template": "image", "params": {"query": arg or scene["text"]}}
    return {"template": tag, "params": {}}


def heuristic(scene: dict, index: int, total: int) -> dict:
    if index == 0:
        return {"template": "hook", "params": {}}
    m = NUM_RE.search(scene["text"])
    if m and (m.group("unit") or len(m.group("val")) >= 3):
        val = float(m.group("val").replace(",", ""))
        return {"template": "number", "params": {"value": val, "unit": (m.group("unit") or "").strip()}}
    return {"template": "text", "params": {}}


_llm = None


def _load_llm():
    global _llm
    if _llm is not None:
        return _llm or None
    path = os.environ.get("LLM_PATH")
    if not path or not os.path.exists(path):
        _llm = False
        return None
    try:
        from llama_cpp import Llama
        _llm = Llama(model_path=path, n_ctx=2048, n_threads=os.cpu_count() or 2, verbose=False)
    except Exception as e:  # noqa: BLE001
        print(f"[planner] LLM unavailable ({e}); using heuristic")
        _llm = False
    return _llm or None


SCHEMA = {
    "type": "object",
    "properties": {
        "template": {"type": "string", "enum": TEMPLATES},
        "place": {"type": "string"},
        "image_query": {"type": "string"},
        "number": {"type": "number"},
        "unit": {"type": "string"},
    },
    "required": ["template"],
}

PROMPT = """You choose a visual template for one line of a short educational video.
Templates:
- hook: opening line of the video (only for the first line)
- map: the line is about a specific country or continent; set "place"
- number: the line centres on one big number; set "number" and "unit"
- image: a real photo would help (space, history, animals); set "image_query" (3-5 words)
- text: anything else; big on-screen statement
Line {i} of {n}: "{text}"
Reply with JSON only."""


def llm_plan(scene: dict, index: int, total: int):
    llm = _load_llm()
    if not llm:
        return None
    try:
        out = llm.create_chat_completion(
            messages=[{"role": "user", "content": PROMPT.format(i=index + 1, n=total, text=scene["text"])}],
            response_format={"type": "json_object", "schema": SCHEMA},
            temperature=0.2,
            max_tokens=120,
        )
        d = json.loads(out["choices"][0]["message"]["content"])
    except Exception as e:  # noqa: BLE001
        print(f"[planner] LLM call failed ({e}); using heuristic")
        return None
    t = d.get("template")
    if t == "hook" and index != 0:
        t = "text"
    if t == "map" and d.get("place"):
        return {"template": "map", "params": {"place": d["place"]}}
    if t == "number" and d.get("number") is not None:
        return {"template": "number", "params": {"value": d["number"], "unit": d.get("unit", "")}}
    if t == "image" and d.get("image_query"):
        return {"template": "image", "params": {"query": d["image_query"]}}
    if t in ("hook", "text"):
        return {"template": t, "params": {}}
    return None


def plan(scenes: list[dict]) -> list[dict]:
    out = []
    n = len(scenes)
    for i, s in enumerate(scenes):
        if s["tag"]:
            p, source = from_tag(s), "hint"
        else:
            p = llm_plan(s, i, n)
            source = "llm"
            if p is None:
                p, source = heuristic(s, i, n), "heuristic"
        out.append({**s, **p, "source": source})
        print(f"[planner] scene {i + 1}: {p['template']} ({source})")
    return out
