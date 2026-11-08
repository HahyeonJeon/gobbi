"""The reading of Markdown documents: frontmatter, fences, prose lines, headings, anchors, and links."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass

__all__ = ["Document", "Heading", "Link", "anchor", "parse"]

_FRONTMATTER_FENCE = "---"
_KEY_VALUE = re.compile(r"([A-Za-z][A-Za-z0-9_-]*): (.+)")
# A plain value may not open with a YAML indicator: those need a real YAML parser, so they are errors here.
_YAML_INDICATORS = tuple("'\"[]{}>|&*!%@`#")
_FENCE_OPEN = re.compile(r"\s*(`{3,}|~{3,})")
_FENCE_CLOSE = re.compile(r"\s*(`{3,}|~{3,})\s*")
# ATX heading: up to 3 spaces of indent, an optional closing run of '#' after a space. Setext is ignored.
_HEADING = re.compile(r" {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*")
_CODE_SPAN = re.compile(r"(`+)(.+?)(?<!`)\1(?!`)")
_LINK = re.compile(
    r"!?\[(?:[^\[\]\\]|\\.|\[[^\]]*\])*\]"
    r"\(\s*(<[^>]*>|[^\s()]*(?:\([^\s()]*\)[^\s()]*)*)(?:\s+(?:\"[^\"]*\"|'[^']*'))?\s*\)"
)
_INLINE_LINK = re.compile(r"\[([^\]]*)\]\([^)]*\)")
_NOT_ANCHOR_CHAR = re.compile(r"[^\w\- ]")


@dataclass(frozen=True)
class Heading:
    level: int
    title: str
    line: int
    anchor: str


@dataclass(frozen=True)
class Link:
    target: str
    line: int


@dataclass(frozen=True)
class Document:
    """One parsed Markdown file. Line numbers are 1-based; `lines[body_start:]` is the body."""

    path: str
    lines: tuple[str, ...]
    frontmatter: dict[str, str] | None
    frontmatter_error: str | None
    body_start: int
    headings: tuple[Heading, ...]
    links: tuple[Link, ...]
    prose: tuple[tuple[int, str], ...]
    fenced: frozenset[int]

    def section(self, title: str, level: int = 2) -> tuple[tuple[int, str], ...]:
        """The unfenced lines under the first heading with this title and level, up to the next heading
        at that level or above. Empty when no such heading exists."""
        for index, heading in enumerate(self.headings):
            if heading.level != level or heading.title != title:
                continue
            following = (h.line for h in self.headings[index + 1 :] if h.level <= level)
            end = next(following, len(self.lines) + 1)
            return tuple(
                (number, self.lines[number - 1])
                for number in range(heading.line + 1, end)
                if number not in self.fenced
            )
        return ()


def anchor(title: str) -> str:
    """The GitHub anchor of a heading title, before duplicate numbering."""
    text = _INLINE_LINK.sub(r"\1", title).replace("`", "").replace("*", "").lower()
    return _NOT_ANCHOR_CHAR.sub("", text).replace(" ", "-")


def parse(path: str, text: str) -> Document:
    lines = tuple(text.splitlines())
    frontmatter, error, body_start = _frontmatter(lines)
    fenced = _fenced(lines, body_start)
    links: list[Link] = []
    prose: list[tuple[int, str]] = []
    for number in range(body_start + 1, len(lines) + 1):
        if number in fenced:
            continue
        line = lines[number - 1]
        links.extend(Link(match.group(1), number) for match in _LINK.finditer(_without_code(line)))
        if not line.lstrip().startswith("|"):
            prose.append((number, line))
    return Document(
        path=path,
        lines=lines,
        frontmatter=frontmatter,
        frontmatter_error=error,
        body_start=body_start,
        headings=_headings(lines, body_start, fenced),
        links=tuple(links),
        prose=tuple(prose),
        fenced=fenced,
    )


def _frontmatter(lines: tuple[str, ...]) -> tuple[dict[str, str] | None, str | None, int]:
    if not lines or lines[0] != _FRONTMATTER_FENCE:
        return None, None, 0
    try:
        close = lines.index(_FRONTMATTER_FENCE, 1)
    except ValueError:
        return None, "frontmatter has no closing ---", 0
    values: dict[str, str] = {}
    for number in range(2, close + 1):
        line = lines[number - 1]
        match = _KEY_VALUE.fullmatch(line)
        if match is None:
            return None, f"line {number} is not 'key: value'", close + 1
        key, value = match.group(1), _value(match.group(2))
        if value is None:
            return None, f"line {number} has an unsupported value", close + 1
        if key in values:
            return None, f"line {number} repeats the key {key}", close + 1
        values[key] = value
    return values, None, close + 1


def _value(raw: str) -> str | None:
    raw = raw.strip()
    if raw.startswith('"'):
        try:
            value = json.loads(raw)
        except json.JSONDecodeError:
            return None
        return value if isinstance(value, str) else None
    if raw.startswith(_YAML_INDICATORS):
        return None
    return raw


def _fenced(lines: tuple[str, ...], body_start: int) -> frozenset[int]:
    """Line numbers inside a fence, delimiters included. An unclosed fence runs to the end."""
    fenced: set[int] = set()
    opener: str | None = None
    for number in range(body_start + 1, len(lines) + 1):
        line = lines[number - 1]
        if opener is None:
            match = _FENCE_OPEN.match(line)
            if match is not None and not (match.group(1)[0] == "`" and "`" in line[match.end() :]):
                opener = match.group(1)
                fenced.add(number)
            continue
        fenced.add(number)
        close = _FENCE_CLOSE.fullmatch(line)
        if close is not None and close.group(1)[0] == opener[0] and len(close.group(1)) >= len(opener):
            opener = None
    return frozenset(fenced)


def _headings(lines: tuple[str, ...], body_start: int, fenced: frozenset[int]) -> tuple[Heading, ...]:
    headings: list[Heading] = []
    seen: dict[str, int] = {}
    for number in range(body_start + 1, len(lines) + 1):
        if number in fenced:
            continue
        match = _HEADING.fullmatch(lines[number - 1])
        if match is None:
            continue
        title = (match.group(2) or "").strip()
        base = anchor(title)
        count = seen.get(base, 0)
        seen[base] = count + 1
        unique = base if count == 0 else f"{base}-{count}"
        headings.append(Heading(len(match.group(1)), title, number, unique))
    return tuple(headings)


def _without_code(line: str) -> str:
    return _CODE_SPAN.sub(lambda match: " " * len(match.group(0)), line)
