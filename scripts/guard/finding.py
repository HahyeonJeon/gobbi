"""One guard observation at a location."""

from dataclasses import dataclass

__all__ = ["Finding"]


@dataclass(frozen=True)
class Finding:
    check: str
    path: str
    line: int | None
    message: str
