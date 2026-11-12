"""The set of skill files to check, read from disk once."""

from __future__ import annotations

import os
from collections.abc import Sequence
from pathlib import Path, PurePosixPath

from .markdown import Document, parse

__all__ = ["SkillTree"]

_SKIPPED_DIRECTORY = "__pycache__"


class SkillTree:
    """The files under `paths`, each a file or directory relative to `root`. Read-only; paths are POSIX and
    relative to `root`.

    By default the files come from walking the disk. A caller that knows which files count, such as a git
    listing that leaves out ignored files, passes them as `listed`; then only those files and the directories
    that hold them exist."""

    def __init__(self, root: Path, paths: Sequence[str], listed: Sequence[str] | None = None) -> None:
        self.root = root
        self.paths = tuple(paths)
        self._listed = None if listed is None else frozenset(listed)
        self._directories = (
            frozenset()
            if self._listed is None
            else frozenset(str(parent) for path in self._listed for parent in PurePosixPath(path).parents)
        )
        self._files: tuple[str, ...] | None = None
        self._documents: dict[str, Document] = {}

    def files(self) -> tuple[str, ...]:
        """Every file at or under the paths, sorted. `__pycache__` directories are skipped."""
        if self._files is None and self._listed is not None:
            self._files = tuple(sorted(path for path in self._listed if any(_under(path, p) for p in self.paths)))
        if self._files is None:
            found: set[str] = set()
            for path in self.paths:
                if (self.root / path).is_file():
                    found.add(Path(path).as_posix())
                for directory, subdirectories, names in os.walk(self.root / path):
                    subdirectories[:] = [name for name in subdirectories if name != _SKIPPED_DIRECTORY]
                    found.update((Path(directory) / name).relative_to(self.root).as_posix() for name in names)
            self._files = tuple(sorted(found))
        return self._files

    def exists(self, path: str) -> bool:
        """Whether a file or directory is at this path: a link target, which may lie outside the paths."""
        if self._listed is not None:
            return path in self._listed or path in self._directories
        return (self.root / path).exists()

    def document(self, path: str) -> Document:
        if path not in self._documents:
            self._documents[path] = parse(path, (self.root / path).read_text(encoding="utf-8"))
        return self._documents[path]


def _under(path: str, prefix: str) -> bool:
    prefix = prefix.rstrip("/")
    return path == prefix or path.startswith(prefix + "/")
