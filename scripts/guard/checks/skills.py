"""Skill shape: frontmatter, operation phases, and the References table of each canonical SKILL.md."""

import re
from collections.abc import Iterator
from pathlib import PurePosixPath

from finding import Finding
from markdown import Document, Heading
from repo import CANONICAL, Repo

__all__ = ["frontmatter", "phases", "references"]

SCOPE = f"{CANONICAL}/skills"
SKILL_TYPES = ("domain", "operation", "tool", "preference")
MAX_STEP_BULLETS = 3
REFERENCES_HEADER = "| Name | Description |"

_USE_IT = re.compile(r"Use it (when|whenever|before|after|for)\b")
_TOOL = re.compile(r"[A-Za-z][A-Za-z0-9_]*(\([^()]*\))?")
_PHASE = re.compile(r"Phase (\d+) — \S.*")
_STEP = re.compile(r"(\d+)\.(\d+) \S.*")
_LINK = re.compile(r"\[[^\]]+\]\([^)]+\)")
_CELL_SEPARATOR = re.compile(r"(?<!\\)\|")


def frontmatter(repo: Repo) -> Iterator[Finding]:
    for document in _skills(repo):
        yield from _frontmatter(document)


def phases(repo: Repo) -> Iterator[Finding]:
    for document in _skills(repo):
        if document.frontmatter is not None and document.frontmatter.get("skill-type") == "operation":
            yield from _phases(document)


def references(repo: Repo) -> Iterator[Finding]:
    for document in _skills(repo):
        if document.frontmatter is None or document.frontmatter.get("skill-type") != "domain":
            yield from _references(document)


def _skills(repo: Repo) -> Iterator[Document]:
    for path in repo.files(SCOPE):
        if path.endswith("/SKILL.md"):
            yield repo.document(path)


def _frontmatter(document: Document) -> Iterator[Finding]:
    def finding(key: str, message: str) -> Finding:
        return Finding("frontmatter", document.path, _key_line(document, key), message)

    if document.frontmatter_error is not None:
        yield Finding("frontmatter", document.path, 1, f"frontmatter does not parse: {document.frontmatter_error}")
        return
    if document.frontmatter is None:
        yield Finding("frontmatter", document.path, 1, "no frontmatter")
        return
    fields = document.frontmatter
    directory = PurePosixPath(document.path).parent.name
    if fields.get("name") != directory:
        yield finding("name", f"name is {fields.get('name')!r}, not the directory name {directory!r}")
    title = next((heading.title for heading in document.headings if heading.level == 1), None)
    description = fields.get("description", "")
    if title is None or not description.startswith(title):
        yield finding("description", f"description does not start with the H1 title {title!r}")
    if _USE_IT.search(description) is None:
        yield finding("description", "description has no 'Use it when|whenever|before|after|for' clause")
    if fields.get("skill-type") not in SKILL_TYPES:
        yield finding(
            "skill-type", f"skill-type is {fields.get('skill-type')!r}, not one of {', '.join(SKILL_TYPES)}"
        )
    tools = fields.get("allowed-tools", "")
    if not tools or not all(_TOOL.fullmatch(tool.strip()) for tool in tools.split(",")):
        yield finding("allowed-tools", "allowed-tools is not a comma list of Name or Name(...)")


def _phases(document: Document) -> Iterator[Finding]:
    def finding(heading: Heading, message: str) -> Finding:
        return Finding("phases", document.path, heading.line, message)

    phase_headings = [h for h in document.headings if h.level == 3 and h.title.startswith("Phase ")]
    for position, phase in enumerate(phase_headings, start=1):
        match = _PHASE.fullmatch(phase.title)
        if match is None:
            yield finding(phase, f"phase heading {phase.title!r} is not 'Phase N — Title'")
            continue
        number = int(match.group(1))
        if number != position:
            yield finding(phase, f"Phase {number} is out of order; expected Phase {position}")
        if "Done when" not in _first_paragraph(document, phase):
            yield finding(phase, f"Phase {number} has no 'Done when' in its first paragraph")
        yield from _steps(document, phase, number)


def _steps(document: Document, phase: Heading, number: int) -> Iterator[Finding]:
    later = [h for h in document.headings if h.line > phase.line and h.level <= phase.level]
    end = later[0].line if later else len(document.lines) + 1
    steps = [
        h for h in document.headings if phase.line < h.line < end and h.level == 4 and _STEP.fullmatch(h.title)
    ]
    for position, step in enumerate(steps, start=1):
        major, minor = (int(part) for part in step.title.split(" ", 1)[0].split("."))
        messages = []
        if major != number:
            messages.append(f"step {major}.{minor} is under Phase {number}")
        elif minor != position:
            messages.append(f"step {major}.{minor} is out of order; expected {number}.{position}")
        bullets = sum(1 for _, line in document.section(step.title, level=4) if line.startswith("- "))
        if bullets > MAX_STEP_BULLETS:
            messages.append(f"step {major}.{minor} has {bullets} top-level bullets (max {MAX_STEP_BULLETS})")
        yield from (Finding("phases", document.path, step.line, message) for message in messages)


def _first_paragraph(document: Document, heading: Heading) -> str:
    """The first run of non-blank lines after a heading, or empty when a heading or fence comes first."""
    heading_lines = {h.line for h in document.headings}
    paragraph: list[str] = []
    for number in range(heading.line + 1, len(document.lines) + 1):
        line = document.lines[number - 1]
        if number in heading_lines or number in document.fenced:
            break
        if not line.strip():
            if paragraph:
                break
            continue
        paragraph.append(line)
    return " ".join(paragraph)


def _references(document: Document) -> Iterator[Finding]:
    heading = next((h for h in document.headings if h.level == 2 and h.title == "References"), None)
    if heading is None:
        # A skill that links no internal document has nothing to list, so the section is optional there.
        if any(_internal(link.target) for link in document.links):
            message = "links internal documents but has no ## References section"
            yield Finding("references", document.path, None, message)
        return
    table = _first_table(document.section("References"))
    if not table:
        yield Finding("references", document.path, heading.line, "## References has no table")
        return
    (header_line, header), *rest = table
    if header.rstrip() != REFERENCES_HEADER:
        yield Finding("references", document.path, header_line, f"table header is not {REFERENCES_HEADER!r}")
    for number, row in rest[1:]:  # rest[0] is the |---| separator
        cells = _cells(row)
        if len(cells) != 2:
            yield Finding("references", document.path, number, f"row has {len(cells)} cells, not 2")
        elif _LINK.search(cells[0]) is None:
            yield Finding("references", document.path, number, "Name cell holds no link")


def _first_table(lines: tuple[tuple[int, str], ...]) -> list[tuple[int, str]]:
    table: list[tuple[int, str]] = []
    for number, line in lines:
        if line.lstrip().startswith("|"):
            table.append((number, line))
        elif table:
            break
    return table


def _cells(row: str) -> list[str]:
    inner = row.strip().removeprefix("|").removesuffix("|")
    return [cell.strip() for cell in _CELL_SEPARATOR.split(inner)]


def _key_line(document: Document, key: str) -> int:
    for number in range(1, document.body_start + 1):
        if document.lines[number - 1].startswith(f"{key}:"):
            return number
    return 1


def _internal(target: str) -> bool:
    """A link to another document in the repository, not a web address or an anchor in this file."""
    return not target.startswith(("#", "http://", "https://", "mailto:"))
