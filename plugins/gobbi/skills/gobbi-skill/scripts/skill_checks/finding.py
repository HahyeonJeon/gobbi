"""One check result at a location."""

from __future__ import annotations

from dataclasses import dataclass

__all__ = ["Finding"]


@dataclass(frozen=True)
class Finding:
    check: str
    path: str
    line: int | None
    message: str
    advisory: bool = False  # an advisory finding is reported as a note and never fails the run
