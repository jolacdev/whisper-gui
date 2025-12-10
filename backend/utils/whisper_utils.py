import logging
from collections.abc import Iterable

import webview
from faster_whisper.transcribe import Segment

from schemas.transcription import TranscriptionSegment

logger = logging.getLogger(__name__)


def process_segments(raw_segments: Iterable[Segment], duration: float) -> list[TranscriptionSegment]:
    """Converts raw Whisper results into typed Segment objects."""
    segments: list[TranscriptionSegment] = []
    for s in raw_segments:
        logger.info("Transcribing segment %s: [%s - %s]", s.id, s.start, s.end)
        update_state_progress(duration=duration, elapsed=s.end)
        segment: TranscriptionSegment = {"id": s.id, "start": s.start, "end": s.end, "text": s.text.strip()}
        segments.append(segment)

    update_state_progress(duration=duration, elapsed=duration)  # Update progress to 100%
    return segments


def update_state_progress(duration: float, elapsed: float) -> None:
    """Updates the transcription progress in the webview state."""
    progress = int(round(elapsed / duration * 100))
    webview.windows[0].state.transcriptionProgress = progress
