"""Relative Markdown links and their anchors resolve inside the repository."""

import posixpath
import re
from collections.abc import Iterator
from urllib.parse import unquote

from finding import Finding
from markdown import Link
from repo import CANONICAL, PACKAGE, Repo

__all__ = ["broken"]

SCOPE = (
    f"{CANONICAL}/skills",
    f"{CANONICAL}/agents",
    f"{PACKAGE}/skills",
    f"{PACKAGE}/agents",
    f"{PACKAGE}/runtimes",
    "README.md",
    "AGENTS.md",
)

_SCHEME = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*:")


def broken(repo: Repo) -> Iterator[Finding]:
    for path in repo.files(*SCOPE):
        if path.endswith(".md"):
            for link in repo.document(path).links:
                message = _problem(repo, path, link)
                if message is not None:
                    yield Finding("links", path, link.line, message)


def _problem(repo: Repo, path: str, link: Link) -> str | None:
    target = link.target
    if _SCHEME.match(target) or "{" in target or "<" in target:
        return None
    file_part, _, fragment = target.partition("#")
    resolved = _resolve(path, unquote(file_part)) if file_part else path
    if resolved == ".." or resolved.startswith("../"):
        return f"link target {target} leaves the repository"
    if not repo.exists(resolved):
        return f"link target {target} does not exist"
    if fragment and resolved.endswith(".md"):
        anchors = {heading.anchor for heading in repo.document(resolved).headings}
        if fragment not in anchors:
            return f"anchor #{fragment} is not a heading in {resolved}"
    return None


def _resolve(path: str, target: str) -> str:
    """A link target as a repository path: `/x` from the root, anything else from the linking file."""
    if target.startswith("/"):
        return posixpath.normpath(target.lstrip("/"))
    return posixpath.normpath(posixpath.join(posixpath.dirname(path), target))
