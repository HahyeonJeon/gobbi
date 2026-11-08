"""The canonical-to-package projection: what the package must hold, and how it differs now."""

import re
from collections.abc import Iterator

from finding import Finding
from repo import CANONICAL, PACKAGE, Action, Repo

__all__ = ["MAPPING", "OWNED", "REWRITTEN", "drift", "plan", "rewrite_links"]

# Canonical prefix -> package prefix. Claude's roles flatten into agents/, because a plugin's agents/ directory
# is scanned recursively and a subfolder would join the agent's identifier; the other runtimes ship in runtimes/.
MAPPING = (
    ("skills", "skills"),
    ("agents/claude", "agents"),
    ("agents/codex", "runtimes/codex"),
    ("agents/cursor", "runtimes/cursor"),
    ("agents/grok", "runtimes/grok"),
)
# Package subtrees the projection owns; any other file in them is unexpected.
# The .*-plugin/ manifests beside them are hand-kept, so the projection never touches them.
OWNED = ("skills", "agents", "runtimes")
# Canonical files whose ../../ links point into a mapped prefix, so the package copy gets the package paths.
REWRITTEN = frozenset({"skills/gobbi/SKILL.md"})

_LONGEST_FIRST = sorted(MAPPING, key=lambda pair: len(pair[0]), reverse=True)
_RELATIVE_PREFIX = re.compile(
    r"\.\./\.\./(" + "|".join(re.escape(canonical) for canonical, _ in _LONGEST_FIRST) + r")/"
)
_PACKAGE_PREFIX = dict(MAPPING)


def rewrite_links(text: str) -> str:
    """The text with each `../../<canonical prefix>/` moved to its package prefix, longest prefix first."""
    return _RELATIVE_PREFIX.sub(lambda match: f"../../{_PACKAGE_PREFIX[match.group(1)]}/", text)


def plan(repo: Repo) -> list[Action]:
    """The actions that make the package equal the projection."""
    return [action for _, action in _differences(repo)]


def drift(repo: Repo) -> Iterator[Finding]:
    """One finding per pending projection action, named by its kind."""
    for kind, action in _differences(repo):
        yield Finding("mirror", action.path, None, kind)


def _differences(repo: Repo) -> list[tuple[str, Action]]:
    expected = _projection(repo)
    present = set(repo.files(*(f"{PACKAGE}/{subtree}" for subtree in OWNED)))
    differences: list[tuple[str, Action]] = []
    for path, (source, content) in sorted(expected.items()):
        executable = repo.executable(source)
        write = Action("write", path, content, executable)
        if path not in present:
            differences.append(("missing-in-package", write))
        elif repo.link(path) is not None or repo.data(path) != content:
            differences.append(("content-differs", write))
        elif repo.executable(path) != executable:
            differences.append(("mode-differs", write))
    for path in sorted(present - expected.keys()):
        differences.append(("unexpected-in-package", Action("delete", path)))
    return differences


def _projection(repo: Repo) -> dict[str, tuple[str, bytes]]:
    """Package path -> (canonical source path, expected bytes)."""
    projection: dict[str, tuple[str, bytes]] = {}
    for canonical, package in MAPPING:
        base = f"{CANONICAL}/{canonical}/"
        for source in repo.files(base):
            relative = source.removeprefix(base)
            content = repo.data(source)
            if f"{canonical}/{relative}" in REWRITTEN:
                content = rewrite_links(content.decode("utf-8")).encode("utf-8")
            projection[f"{PACKAGE}/{package}/{relative}"] = (source, content)
    return projection
