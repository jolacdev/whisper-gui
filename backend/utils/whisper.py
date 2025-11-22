import os
from typing import TypedDict

import torch
import whisper


class Segment(TypedDict):
    """
    Represents a single segment of the transcription.

    Attributes:
        id (int): The unique identifier for the segment.
        text (str): The transcribed text for this segment.
        start (float): The start time of the segment in seconds.
        end (float): The end time of the segment in seconds.
    """

    id: int
    text: str
    start: float
    end: float


class TranscriptionResult(TypedDict):
    text: str
    segments: list[dict]
    language: str


class WhisperModelService:
    """Singleton service class to Whisper model and ensure it is loaded only once."""

    _instance = None
    _model = None
    _current_model_name = None

    def __new__(cls) -> "WhisperModelService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load_model(self, model_name: str = "base", device: str | None = None) -> None:
        """
        Loads the Whisper model if it's not already loaded or if the model name changes.

        Args:
            model_name (str): The name of the model to load (e.g., "base", "small", "medium").
                              Defaults to "base".
            device (str | None): The device to load the model on ("cpu" or "cuda").
                                 If None, it automatically detects available device.
        """
        # If the model is already loaded and the model name is the same, return
        if self._model is not None and self._current_model_name == model_name:
            return

        # If no device is specified, automatically detect available device
        if device is None:
            device = "cuda" if torch.cuda.is_available() else "cpu"

        self._model = whisper.load_model(model_name, device=device, download_root="models")
        self._current_model_name = model_name
        print(f"Model '{model_name}' loaded on {device} successfully.")  # TODO: Remove debug print

    def transcribe(
        self,
        file_path: str,
    ) -> TranscriptionResult:
        """
        Transcribes the given media file using the loaded model.

        Args:
            file_path (str): The path to the media file (audio or video).

        Returns:
            TranscriptionResult: The raw transcription result containing text and segments.

        Raises:
            RuntimeError: If the model has not been loaded.
            FileNotFoundError: If the audio file does not exist.
        """
        if self._model is None:
            self.load_model()  # Auto-load default if not loaded

        # TODO: Check if should remove URL
        if not os.path.exists(file_path) and not file_path.startswith("http"):
            raise FileNotFoundError(f"File not found: {file_path}")

        return self._model.transcribe(file_path)


# Global service instance
_whisper_service = WhisperModelService()


def transcribe_media_file(media_path: str, model_name: str = "base") -> TranscriptionResult:
    """
    Transcribes audio from a media file (audio or video) using the Whisper model.

    This function uses the shared WhisperModelService to ensure efficient model usage.
    Whisper automatically extracts audio from video files using ffmpeg.

    Args:
        media_path (str): Path to the media file.
        model_name (str): Name of the Whisper model to use. Defaults to "base".

    Returns:
        TranscriptionResult: The transcription result containing text, segments, and language.
    """
    _whisper_service.load_model(model_name)
    return _whisper_service.transcribe(media_path)


def extract_segments(transcription_result: TranscriptionResult) -> list[Segment]:
    """Converts raw Whisper results into typed Segment objects."""
    segments: list[Segment] = []
    for raw_segment in transcription_result["segments"]:
        segment: Segment = {
            "id": int(raw_segment["id"] + 1),
            "start": float(raw_segment["start"]),
            "end": float(raw_segment["end"]),
            "text": str(raw_segment["text"]).strip(),
        }
        segments.append(segment)
    return segments
