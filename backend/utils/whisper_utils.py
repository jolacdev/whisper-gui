import logging
from collections.abc import Iterable
from time import time

import webview
from faster_whisper.transcribe import Segment

from constants import TRANSCRIPTION_PROGRESS_MAX_VALUE, TRANSCRIPTION_PROGRESS_MIN_VALUE
from schemas.transcription import TranscriptionSegment

logger = logging.getLogger(__name__)


def process_segments(
    raw_segments: Iterable[Segment], total_duration_seconds: float, start_time_ms: float
) -> list[TranscriptionSegment]:
    """Converts raw Whisper results into typed Segment objects."""

    segments: list[TranscriptionSegment] = []
    for s in raw_segments:
        if webview.windows[0].state.isAbortRequested:
            logger.info("Transcription aborted by user.")
            break

        logger.info("Transcribing segment %s: [%s - %s]", s.id, s.start, s.end)
        _update_transcription_progress(
            total_duration_seconds=total_duration_seconds, elapsed=s.end, start_time_ms=start_time_ms
        )
        segment: TranscriptionSegment = {"id": s.id, "start": s.start, "end": s.end, "text": s.text.strip()}
        segments.append(segment)

    if webview.windows[0].state.isAbortRequested:
        # Reset transcription progress on abort
        webview.windows[0].state.transcriptionProgress = None
        return []  # TODO: Return None?

    _update_transcription_progress(
        total_duration_seconds=total_duration_seconds,
        elapsed=total_duration_seconds,
        start_time_ms=start_time_ms,
    )  # Update progress to 100%
    return segments


def _update_transcription_progress(
    total_duration_seconds: float, elapsed: float, start_time_ms: float
) -> None:
    """Updates the transcription progress in the webview state."""
    progress = int(round(elapsed / total_duration_seconds * 100))
    clamped_progress = max(TRANSCRIPTION_PROGRESS_MIN_VALUE, min(TRANSCRIPTION_PROGRESS_MAX_VALUE, progress))

    webview.windows[0].state.transcriptionProgress = clamped_progress
    _update_transcription_remaining_time(start_time_ms=start_time_ms, progress=clamped_progress)


def _update_transcription_remaining_time(start_time_ms: float, progress: int) -> None:
    """Updates transcription remaining seconds in the webview state based on progress and elapsed time."""
    if progress <= TRANSCRIPTION_PROGRESS_MIN_VALUE or progress > TRANSCRIPTION_PROGRESS_MAX_VALUE:
        return

    # Elapsed time
    current_time_ms = time() * 1000
    elapsed_time_ms = current_time_ms - start_time_ms
    elapsed_time_per_progress_unit_ms = elapsed_time_ms / progress

    # Remaining progress
    remaining_progress = TRANSCRIPTION_PROGRESS_MAX_VALUE - progress

    # Estimate remaining time based on elapsed time and progress.
    estimated_remaining_time_ms = elapsed_time_per_progress_unit_ms * remaining_progress
    estimated_remaining_time_seconds = max(0, int(estimated_remaining_time_ms / 1000))

    # Update remaining if changed.
    if webview.windows[0].state.transcriptionRemainingSeconds != estimated_remaining_time_seconds:
        webview.windows[0].state.transcriptionRemainingSeconds = estimated_remaining_time_seconds
