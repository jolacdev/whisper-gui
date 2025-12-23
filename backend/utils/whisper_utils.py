import logging
from collections.abc import Iterable

import webview
from faster_whisper.transcribe import Segment

from constants import TRANSCRIPTION_PROGRESS_MAX_VALUE, TRANSCRIPTION_PROGRESS_MIN_VALUE
from schemas.transcription import TranscriptionSegment

logger = logging.getLogger(__name__)


def process_segments(raw_segments: Iterable[Segment], duration: float) -> list[TranscriptionSegment]:
    """Converts raw Whisper results into typed Segment objects."""

    segments: list[TranscriptionSegment] = []
    for s in raw_segments:
        if webview.windows[0].state.isAbortRequested:
            logger.info("Transcription aborted by user.")
            break

        logger.info("Transcribing segment %s: [%s - %s]", s.id, s.start, s.end)
        _update_transcription_progress(duration=duration, elapsed=s.end)
        segment: TranscriptionSegment = {"id": s.id, "start": s.start, "end": s.end, "text": s.text.strip()}
        segments.append(segment)

    if webview.windows[0].state.isAbortRequested:
        # Reset transcription progress on abort
        webview.windows[0].state.transcriptionProgress = None
        return []  # TODO: Return None?

    _update_transcription_progress(duration=duration, elapsed=duration)  # Update progress to 100%
    return segments


def _update_transcription_progress(duration: float, elapsed: float) -> None:
    """Updates the transcription progress in the webview state."""
    progress = int(round(elapsed / duration * 100))
    progress = max(TRANSCRIPTION_PROGRESS_MIN_VALUE, min(TRANSCRIPTION_PROGRESS_MAX_VALUE, progress))
    webview.windows[0].state.transcriptionProgress = progress
