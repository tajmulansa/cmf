# script-to-video

Turns a short script into a vertical (1080x1920) explainer Short, entirely on GitHub Actions.

```
script.txt -> parse -> plan (hints / small LLM / rules) -> voice (Kokoro) -> word timings (Whisper tiny)
           -> stock images (Wikimedia, only if asked) -> props.json -> Remotion render -> video.mp4
```

## Script format

One scene per line. A leading tag is a hint that overrides the AI; no tag means the AI picks.

```
[hook] Antarctica is a desert.
[map: Antarctica] It's the driest continent on Earth.
[number: 14.2 million km²] That's bigger than Europe.
[image: Antarctica ice sheet aerial] Beneath it lies ninety percent of the world's ice.
It rarely snows there, so the ice built up slowly.
```

Tags: `hook`, `map`, `number`, `image`, `text`. Keep the whole script under about 140 words (60 seconds).
Write numbers as words in the narration ("ninety percent") so the voice reads them correctly.

## Run it

1. Push a `scripts/*.txt` file, or Actions -> make-video -> Run workflow and type the script path.
2. When it finishes, download the `video` artifact (mp4, props.json, credits.txt for image attribution).

## Local

```
pip install -r requirements.txt
python -m pipeline.run scripts/example.txt --dry-run      # no models needed, estimated timings
cd remotion && npm install && npm run studio              # preview templates in the browser
```

## Where to change things

| Want to change | File |
| --- | --- |
| Colors, font, safe area | `remotion/src/theme.ts` |
| A template's look | `remotion/src/templates/*.tsx` |
| Caption style | `remotion/src/Captions.tsx` |
| Scene transitions | `SceneFade` in `remotion/src/Video.tsx` |
| How the AI picks templates | `pipeline/planner.py` |
| Voice | env `KOKORO_VOICE` (default `af_heart`) in `pipeline/tts.py` |

## Status: v0.1, not yet run end to end

Written without network access to npm / Hugging Face, so the first Actions run will likely need small fixes
(package versions, model URLs). The Python parts (parser, planner heuristic, props) were tested with `--dry-run`.

## Roadmap

- More templates: chart, timeline, comparison, kinetic quote
- Proper transitions, sound effects, background music with ducking under the voice
- Hint for chart data, per-scene image/map overrides
- Optional YouTube upload
