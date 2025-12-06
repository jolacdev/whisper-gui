import logging
from collections.abc import Iterable

from faster_whisper.transcribe import Segment

from schemas.transcription import TranscriptionSegment

logger = logging.getLogger(__name__)


def format_segments(raw_segments: Iterable[Segment]) -> list[TranscriptionSegment]:
    """Converts raw Whisper results into typed Segment objects."""
    segments: list[TranscriptionSegment] = []
    for s in raw_segments:
        logger.info("Transcribing segment %s: [%s - %s]", s.id, s.start, s.end)
        segment: TranscriptionSegment = {"id": s.id, "start": s.start, "end": s.end, "text": s.text.strip()}
        segments.append(segment)
    return segments
