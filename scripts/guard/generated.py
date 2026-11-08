"""The generated Principles blocks: the marker grammar, the declared targets, and the block content."""

import re
from collections.abc import Iterator
from dataclasses import dataclass

from finding import Finding
from repo import Action, Repo

__all__ = ["TARGETS", "drift", "expected_block", "plan"]

# Files that must hold exactly one block. A target that is a symlink to another target is checked through it.
TARGETS = (".claude/CLAUDE.md", ".codex/AGENTS.md", "AGENTS.md")

_NAME = "PRINCIPLES"
_BEGIN = re.compile(r"<!-- BEGIN GENERATED (\S+): (\S+) -->")
_END = re.compile(r"<!-- END GENERATED (\S+) -->")
_FRONTMATTER_FENCE = "---\n"


@dataclass(frozen=True)
class _Marker:
    index: int  # 0-based line index
    begin: bool
    name: str
    source: str | None


def expected_block(source_text: str) -> str:
    """The block body for a source file: a newline, then the source after its closing frontmatter line."""
    lines = source_text.splitlines(keepends=True)
    body = lines
    if lines and lines[0] == _FRONTMATTER_FENCE and _FRONTMATTER_FENCE in lines[1:]:
        body = lines[lines.index(_FRONTMATTER_FENCE, 1) + 1 :]
    text = "".join(body)
    return "\n" + (text if text.endswith("\n") else text + "\n")


def plan(repo: Repo) -> tuple[list[Action], list[Finding]]:
    """The writes that bring each declared block to its source, and the problems `sync` cannot fix."""
    actions: list[Action] = []
    problems: list[Finding] = []
    for target in TARGETS:
        action, found = _target(repo, target)
        problems.extend(found)
        if action is not None:
            actions.append(action)
    problems.extend(_undeclared(repo))
    return actions, problems


def drift(repo: Repo) -> Iterator[Finding]:
    actions, problems = plan(repo)
    yield from problems
    for action in actions:
        yield Finding("generated", action.path, None, "block differs from its source")


def _target(repo: Repo, target: str) -> tuple[Action | None, list[Finding]]:
    if not repo.exists(target):
        return None, [Finding("generated", target, None, "declared target is missing")]
    resolved = repo.link(target)
    if resolved is not None:
        if resolved in TARGETS:
            return None, []
        return None, [Finding("generated", target, None, f"symlink to undeclared file {resolved}")]
    markers = _markers(repo, target)
    begins = [marker for marker in markers if marker.begin]
    ends = [marker for marker in markers if not marker.begin]
    if len(begins) != 1 or len(ends) != 1 or ends[0].index < begins[0].index:
        message = f"needs exactly one block pair; found {len(begins)} BEGIN and {len(ends)} END markers"
        return None, [Finding("generated", target, None, message)]
    begin, end = begins[0], ends[0]
    problems = [
        Finding("generated", target, marker.index + 1, f"unknown block name {marker.name}")
        for marker in (begin, end)
        if marker.name != _NAME
    ]
    assert begin.source is not None
    if not repo.exists(begin.source):
        problems.append(Finding("generated", target, begin.index + 1, f"source {begin.source} is missing"))
    if problems:
        return None, problems
    lines = repo.text(target).splitlines(keepends=True)
    current = "".join(lines[begin.index + 1 : end.index])
    expected = expected_block(repo.text(begin.source))
    if current == expected:
        return None, []
    text = "".join(lines[: begin.index + 1]) + expected + "".join(lines[end.index :])
    return Action("write", target, text.encode("utf-8"), repo.executable(target)), []


def _undeclared(repo: Repo) -> Iterator[Finding]:
    """Blocks outside the declared targets. Only Markdown is scanned: the marker is an HTML comment."""
    for path in repo.files():
        if path in TARGETS or not path.endswith(".md") or repo.link(path) is not None:
            continue
        for marker in _markers(repo, path):
            if marker.begin:
                yield Finding("generated", path, marker.index + 1, "generated block in an undeclared file")


def _markers(repo: Repo, path: str) -> list[_Marker]:
    """Marker lines outside fences."""
    document = repo.document(path)
    markers: list[_Marker] = []
    for index, line in enumerate(document.lines):
        if index + 1 in document.fenced:
            continue
        if (begin := _BEGIN.fullmatch(line)) is not None:
            markers.append(_Marker(index, True, begin.group(1), begin.group(2)))
        elif (end := _END.fullmatch(line)) is not None:
            markers.append(_Marker(index, False, end.group(1), None))
    return markers
