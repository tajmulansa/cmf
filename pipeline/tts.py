"""Text-to-speech with Kokoro (ONNX, CPU). Dry-run mode skips audio and estimates timing."""
import os
import wave

MODEL = os.environ.get("KOKORO_MODEL", "models/kokoro-v1.0.onnx")
VOICES = os.environ.get("KOKORO_VOICES", "models/voices-v1.0.bin")
VOICE = os.environ.get("KOKORO_VOICE", "af_heart")

_k = None


def estimate_seconds(text: str) -> float:
    return len(text.split()) / 2.6 + 0.3


def synth(text: str, out_wav: str, dry_run: bool = False) -> float:
    """Writes a wav file and returns its duration in seconds."""
    if dry_run:
        return estimate_seconds(text)
    global _k
    import soundfile as sf
    from kokoro_onnx import Kokoro
    if _k is None:
        _k = Kokoro(MODEL, VOICES)
    samples, sr = _k.create(text, voice=VOICE, speed=1.0, lang="en-us")
    sf.write(out_wav, samples, sr)
    with wave.open(out_wav) as w:
        return w.getnframes() / w.getframerate()
