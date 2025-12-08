from mimetypes import guess_file_type
from pathlib import Path

from constants import AUDIO_EXTENSIONS, VIDEO_EXTENSIONS
from schemas.file_metadata import FileMetadata


def is_media_file(file_path: str) -> bool:
    """Check if the file is a media file."""
    if not file_path:
        return False

    return any(
        file_path.lower().endswith(ext.replace("*", "")) for ext in AUDIO_EXTENSIONS + VIDEO_EXTENSIONS
    )


def get_media_dialog_file_types() -> tuple[str, ...]:
    """Get media file dialog file types."""
    file_types = (
        f"Media Files ({';'.join(AUDIO_EXTENSIONS + VIDEO_EXTENSIONS)})",
        f"Audio Files ({';'.join(AUDIO_EXTENSIONS)})",
        f"Video Files ({';'.join(VIDEO_EXTENSIONS)})",
    )
    return file_types


def get_file_metadata_from_path(file_path: str) -> FileMetadata | None:
    """Returns the file metadata for the given path."""
    file = Path(file_path)

    if not file.exists():
        return None

    mime_type, _encoding = guess_file_type(file_path)
    type = mime_type.split("/")[0] if mime_type else ""

    return {
        "name": file.name,
        "size": file.stat().st_size,
        "type": type,
        "absolutePath": str(file.resolve()),
    }
