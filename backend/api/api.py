import logging
from time import time
from typing import Optional

import faster_whisper
import webview
from pyflow import extensity

from schemas.file_metadata import FileMetadata
from schemas.transcription import TranscriptionSegment
from service.whisper_service import whisper_service
from utils.media_utils import get_file_metadata_from_path, get_media_dialog_file_types
from utils.time_utils import format_seconds_to_srt_time as secs_to_srt
from utils.whisper_utils import process_segments

# NOTE: Prefer using Union/Optional over `|` to support PyFlow-TS proper type generation.
# https://github.com/ExtensityAI/PyFlow.ts?tab=readme-ov-file#custom-type-mappings

logger = logging.getLogger(__name__)


@extensity
class PyWebViewApi:
    """Python API functions exposed to JavaScript."""

    # def _gen_types(self) -> Union[TranscriptionSegment, FileMetadata, None]:
    #     """Method to expose and generate types for PyFlow-TS."""
    #     return None

    def open_file_dialog(self) -> Optional[FileMetadata]:
        file_types = get_media_dialog_file_types()

        result = webview.windows[0].create_file_dialog(
            webview.FileDialog.OPEN, allow_multiple=False, file_types=file_types
        )

        if not result:
            return None

        file_path = str(result) if not isinstance(result, (tuple, list)) else str(result[0])
        file_metadata = get_file_metadata_from_path(file_path)
        logger.info("File picked: %s", file_metadata)
        return file_metadata

    # TODO: Print messages for debugging purposes, remove whe not needed.
    # TODO: Online audio example: https://keithito.com/LJ-Speech-Dataset/LJ037-0171.wav
    def run_transcription(self, file_path: str, model_name: str) -> list[TranscriptionSegment]:
        # Reset transcription state
        webview.windows[0].state.transcriptionProgress = None
        webview.windows[0].state.transcriptionAbort = False

        if model_name not in faster_whisper.available_models():
            raise ValueError(f"Model '{model_name}' is not available.")

        try:
            if (transcription_result := whisper_service.transcribe(file_path, model_name)) is None:
                raise ValueError("Transcription result returned `None`")

            raw_segments, info = transcription_result
            duration = info.duration

            logger.debug("Transcription info: %s", info)
            logger.info("Starting transcription of: %s", file_path)

            start_time_ms = time() * 1000
            segments = process_segments(raw_segments, duration)
            end_time_ms = time() * 1000

            for s in segments:
                logger.debug(
                    "\n%s\n%s --> %s\n%s\n",
                    s["id"],
                    secs_to_srt(s["start"]),
                    secs_to_srt(s["end"]),
                    s["text"],
                )

            elapsed_seconds = (end_time_ms - start_time_ms) / 1000
            logger.info("Transcribed %d segments in in %.2f seconds.", len(segments), elapsed_seconds)

            return segments

        except FileNotFoundError:
            logger.exception("File not found.")
        except ConnectionError:
            logger.exception("Network connection failed.")
        except Exception:
            logger.exception("Error during transcription.")

        return []
