"""Gobbi's repository as the guard sees it: where things are, which files exist, and the one write path."""

import os
import stat
import subprocess
import tempfile
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

from markdown import Document, parse

__all__ = ["CANONICAL", "PACKAGE", "Action", "Repo", "find_root"]

CANONICAL = ".gobbi/projects/gobbi"
PACKAGE = "plugins/gobbi"

_FILE_MODE = 0o644
_EXECUTABLE_MODE = 0o755


@dataclass(frozen=True)
class Action:
    """One planned write or delete, relative to the repository root."""

    op: str  # "write" | "delete"
    path: str
    content: bytes | None = None
    executable: bool = False


class Repo:
    """One Gobbi checkout opened for checking. Paths are POSIX and relative to `root`."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self._listing: tuple[str, ...] | None = None
        self._listed: frozenset[str] = frozenset()
        self._directories: frozenset[str] = frozenset()
        self._documents: dict[str, Document] = {}

    def files(self, *prefixes: str) -> tuple[str, ...]:
        """Tracked and untracked, non-ignored files that exist, under any prefix (all when none)."""
        listing = self._list()
        if not prefixes:
            return listing
        return tuple(path for path in listing if any(_under(path, prefix) for prefix in prefixes))

    def exists(self, path: str) -> bool:
        """Whether a listed file, or a directory holding one, is at this path."""
        self._list()
        return path in self._listed or path in self._directories

    def text(self, path: str) -> str:
        return (self.root / path).read_text(encoding="utf-8")

    def data(self, path: str) -> bytes:
        return (self.root / path).read_bytes()

    def executable(self, path: str) -> bool:
        return bool((self.root / path).stat().st_mode & stat.S_IXUSR)

    def link(self, path: str) -> str | None:
        """The path a symlink resolves to, relative to the root, or None when `path` is not a symlink."""
        full = self.root / path
        if not full.is_symlink():
            return None
        resolved = Path(os.path.realpath(full))
        return Path(os.path.relpath(resolved, os.path.realpath(self.root))).as_posix()

    def document(self, path: str) -> Document:
        if path not in self._documents:
            self._documents[path] = parse(path, self.text(path))
        return self._documents[path]

    def apply(self, actions: Sequence[Action], writable: Sequence[str]) -> None:
        """Make the planned writes and deletes.

        Checks: every action path is relative, has no `..`, lies under a `writable` prefix or equals a
        writable path, and is not inside a dot-directory of the package (the hand-kept manifests). A failed
        check raises ValueError naming every bad path, before any write. Changes: deletes first, removing
        directories they empty, then writes each file atomically (a temporary file, then `os.replace`) with
        mode 0o755 or 0o644. A symlink at a written or deleted path is replaced or removed, never followed.
        Clears the caches. Allowed caller: `guard.py sync`.
        """
        refused = [action.path for action in actions if not _allowed(action.path, writable)]
        if refused:
            raise ValueError(f"refusing to write outside the owned paths: {', '.join(refused)}")
        for action in actions:
            if action.op == "delete":
                self._delete(action.path, writable)
        for action in actions:
            if action.op == "write":
                self._write(action)
        self._listing = None
        self._documents.clear()

    def _list(self) -> tuple[str, ...]:
        if self._listing is None:
            completed = subprocess.run(
                ["git", "-C", str(self.root), "ls-files", "-co", "--exclude-standard", "-z"],
                capture_output=True,
                check=True,
            )
            paths = sorted({path for path in completed.stdout.decode().split("\0") if path})
            # A tracked file deleted from the working tree is still listed by git; it does not exist.
            self._listing = tuple(path for path in paths if os.path.lexists(self.root / path))
            self._listed = frozenset(self._listing)
            self._directories = frozenset(
                str(parent) for path in self._listing for parent in PurePosixPath(path).parents
            )
        return self._listing

    def _delete(self, path: str, writable: Sequence[str]) -> None:
        full = self.root / path
        if os.path.lexists(full):
            full.unlink()
        parent = PurePosixPath(path).parent
        while str(parent) not in writable and str(parent) != "." and not any((self.root / parent).iterdir()):
            (self.root / parent).rmdir()
            parent = parent.parent

    def _write(self, action: Action) -> None:
        assert action.content is not None, "a write action carries content"
        target = self.root / action.path
        target.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary = tempfile.mkstemp(dir=target.parent, prefix=f".{target.name}.")
        try:
            with os.fdopen(descriptor, "wb") as handle:
                handle.write(action.content)
            os.chmod(temporary, _EXECUTABLE_MODE if action.executable else _FILE_MODE)
            os.replace(temporary, target)
        except BaseException:
            os.unlink(temporary)
            raise


def find_root(start: Path) -> Path | None:
    """The nearest directory at or above `start` that holds the canonical Gobbi tree."""
    for directory in (start, *start.parents):
        if (directory / CANONICAL).is_dir():
            return directory
    return None


def _under(path: str, prefix: str) -> bool:
    prefix = prefix.rstrip("/")
    return path == prefix or path.startswith(prefix + "/")


def _allowed(path: str, writable: Sequence[str]) -> bool:
    pure = PurePosixPath(path)
    if pure.is_absolute() or ".." in pure.parts:
        return False
    depth = len(PurePosixPath(PACKAGE).parts)
    if _under(path, PACKAGE) and len(pure.parts) > depth and pure.parts[depth].startswith("."):
        return False  # plugins/gobbi/.*-plugin/ holds the hand-kept manifests
    return any(_under(path, entry) for entry in writable)
