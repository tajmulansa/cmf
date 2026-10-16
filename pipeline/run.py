"""Script -> props.json for the Remotion renderer.

    python -m pipeline.run scripts/example.txt            # full run (needs models)
    python -m pipeline.run scripts/example.txt --dry-run  # no TTS/network: estimated timings
"""
import argparse
import json
import math
import os

from . import align, assets, parse_script, planner, tts

FPS = 30
PAD_S = 0.45          # breathing room after each line
MIN_S = 2.5           # shortest a scene can be
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "remotion", "public", "gen")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--out", default=os.path.join(ROOT, "out", "props.json"))
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    os.makedirs(GEN, exist_ok=True)
    os.makedirs(os.path.dirname(a.out), exist_ok=True)

    with open(a.script, encoding="utf-8") as f:
        scenes = planner.plan(parse_script.parse(f.read()))

    credits, out_scenes = [], []
    for i, s in enumerate(scenes):
        params = dict(s["params"])
        template = s["template"]

        if template == "image":
            if a.dry_run:
                got = None
            else:
                got = assets.fetch_image(params["query"], GEN, f"img_{i}")
            if got:
                params.update(got)
                credits.append(got["credit"])
            else:
                template = "text"  # fall back so the video still renders
                params = {}

        wav_name = f"voice_{i}.wav"
        wav_path = os.path.join(GEN, wav_name)
        dur = tts.synth(s["text"], wav_path, a.dry_run)
        words = align.align(s["text"], None if a.dry_run else wav_path, dur, a.dry_run)
        total_s = max(MIN_S, dur + PAD_S)

        out_scenes.append({
            "template": template,
            "params": params,
            "text": s["text"],
            "words": words,
            "audio": None if a.dry_run else f"gen/{wav_name}",
            "durationInFrames": math.ceil(total_s * FPS),
        })

    props = {"fps": FPS, "scenes": out_scenes}
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2, ensure_ascii=False)
    if credits:
        with open(os.path.join(os.path.dirname(a.out), "credits.txt"), "w", encoding="utf-8") as f:
            f.write("Image credits:\n" + "\n".join(f"- {c}" for c in credits) + "\n")
    secs = sum(s["durationInFrames"] for s in out_scenes) / FPS
    print(f"[run] wrote {a.out}: {len(out_scenes)} scenes, {secs:.1f}s")
    if secs > 60:
        print("[run] WARNING: longer than 60 seconds, too long for a Short")


if __name__ == "__main__":
    main()
