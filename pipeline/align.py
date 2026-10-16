"""Word timings for captions. Uses faster-whisper on the generated audio; falls back to even spacing."""


def proportional(text: str, duration: float) -> list[dict]:
    words = text.split()
    weights = [len(w) + 2 for w in words]
    total = sum(weights)
    out, acc = [], 0
    for w, wt in zip(words, weights):
        start = duration * acc / total
        acc += wt
        out.append({"w": w, "start": round(start, 3), "end": round(duration * acc / total, 3)})
    return out


_model = None


def align(text: str, wav: str | None, duration: float, dry_run: bool = False) -> list[dict]:
    if dry_run or not wav:
        return proportional(text, duration)
    try:
        global _model
        from faster_whisper import WhisperModel
        if _model is None:
            _model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
        segs, _ = _model.transcribe(wav, word_timestamps=True, language="en")
        heard = [w for s in segs for w in (s.words or [])]
    except Exception as e:  # noqa: BLE001
        print(f"[align] whisper failed ({e}); using even spacing")
        return proportional(text, duration)
    words = text.split()
    if len(heard) != len(words):
        # token counts differ (numbers, symbols): stretch evenly across the spoken span
        if not heard:
            return proportional(text, duration)
        span0, span1 = heard[0].start, heard[-1].end
        out = proportional(text, span1 - span0)
        return [{**w, "start": round(w["start"] + span0, 3), "end": round(w["end"] + span0, 3)} for w in out]
    return [{"w": w, "start": round(h.start, 3), "end": round(h.end, 3)} for w, h in zip(words, heard)]
