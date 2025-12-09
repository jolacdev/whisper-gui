from typing import TypedDict


class FileMetadata(TypedDict):
    """
    Represents file metadata of the file selected in the application.

    Attributes:
        name (str): The name of the file.
        size (int): The size of the file in bytes.
        type (str): The MIME type of the file.
        absolutePath (str): The absolute path to the file on the system.
    """

    name: str
    size: int
    type: str
    absolutePath: str
