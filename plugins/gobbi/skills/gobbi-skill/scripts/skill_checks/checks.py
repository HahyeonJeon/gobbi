"""Gobbi's skill-writing standard as checks: skill shape, sentence limits, links and anchors, and prose style.

Each check reads a SkillTree with a project's Options and yields Findings. CHECKS lists them in run order.
"""

from __future__ import annotations

import posixpath
import re
from collections.abc import Callable, Iterable, Iterator
from dataclasses import dataclass
from pathlib import PurePosixPath
from urllib.parse import unquote

from .finding import Finding
from .markdown import Document, Heading, Link
from .tree import SkillTree

__all__ = [
    "CHECKS",
    "Check",
    "Options",
    "all_caps",
    "frontmatter",
    "line_length",
    "links",
    "phases",
    "references",
    "rule_leads",
    "sentences",
    "sentence_count",
]

SKILL_TYPES = ("domain", "operation", "tool", "preference")
MAX_STEP_BULLETS = 3
MAX_SENTENCES = 2  # in each Rule, counting its bold lead, and in each Step bullet
REFERENCES_HEADER = "| Name | Description |"
# Adding a word is a reviewed one-line change.
ALLOWED_CAPS = frozenset(
    {
        # Acronyms
        "API", "ASCII", "CLI", "CRUD", "CSS", "HTML", "ID", "JSON", "OOP", "SC", "SMS", "SOLID", "SOP", "SVG",
        "UI", "URL", "UTC", "UUID", "WCAG",
        # File names
        "README",
        # Workflow work-item tokens
        "DISCUSSION", "RECORD", "REVIEW", "WORK",
        # Gate tokens
        "FAIL", "PASS", "REVISE",
        # The term itself
        "ALL-CAPS",
    }
)  # fmt: skip

_USE_IT = re.compile(r"Use it (when|whenever|before|after|for)\b")
_TOOL = re.compile(r"[A-Za-z][A-Za-z0-9_]*(\([^()]*\))?")
_PHASE = re.compile(r"Phase (\d+) — \S.*")
_STEP = re.compile(r"(\d+)\.(\d+) \S.*")
_CELL_LINK = re.compile(r"\[[^\]]+\]\([^)]+\)")
_CELL_SEPARATOR = re.compile(r"(?<!\\)\|")
_SCHEME = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*:")
_CAPS = re.compile(r"(?<![\w-])[A-Z][A-Z0-9-]*[A-Z](?![\w-])")
_RULE_LEAD = re.compile(r"\s*- \*\*((?:MUST|NEVER)\b[^*]*)")
_LEAD_WORD = re.compile(r"(\s*- \*\*)(?:MUST|NEVER)\b")
_CODE_SPAN = re.compile(r"(`+).+?(?<!`)\1(?!`)")
_LINK_TARGET = re.compile(r"\]\([^)]*\)")
_PLACEHOLDER = re.compile(r"\{[^}]*\}")
# A sentence ends at . ! or ?, after any closing quote, parenthesis, or bracket, before space and more text.
_SENTENCE_END = re.compile(r"[.!?][\"')\]]*\s+(?=\S)")
_ABBREVIATIONS = frozenset({"etc.", "vs.", "cf.", "dr.", "mr.", "mrs.", "ms.", "no.", "st.", "fig.", "approx."})
_INITIALS = re.compile(r"[A-Z]\.|(?:[A-Za-z]\.){2,}")  # J. or e.g., i.e., U.S.
_LINK_TEXT = re.compile(r"!?\[([^\]]*)\]\([^)]*\)")
_ITEM = re.compile(r"(\s*)- ")


@dataclass(frozen=True)
class Options:
    """Project values for the checks."""

    max_line: int = 115  # the longest prose line, in characters
    allowed_caps: frozenset[str] = ALLOWED_CAPS  # the ALL-CAPS words prose may use


@dataclass(frozen=True)
class Check:
    id: str
    run: Callable[[SkillTree, Options], Iterable[Finding]]
    advisory: bool = False  # an advisory check reports notes and never fails the run


def frontmatter(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Each SKILL.md frontmatter parses and names its skill, H1 title, trigger, type, and tools."""
    for document in _skills(tree):
        yield from _frontmatter(document)


def phases(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Operation Phases and Steps are numbered in order, each Phase says Done when, and Steps stay short."""
    for document in _skills(tree):
        if document.frontmatter is not None and document.frontmatter.get("skill-type") == "operation":
            yield from _phases(document)


def references(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """A non-domain SKILL.md that links internal documents lists them in a Name | Description table."""
    for document in _skills(tree):
        if document.frontmatter is None or document.frontmatter.get("skill-type") != "domain":
            yield from _references(document)


def sentences(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Each Rule, counting its bold lead, and each operation Step bullet has at most two sentences."""
    for document in _skills(tree):
        units = [("rule", _bullets(document.section("Rules")))]
        if document.frontmatter is not None and document.frontmatter.get("skill-type") == "operation":
            steps = (h for h in document.headings if h.level == 4 and _STEP.fullmatch(h.title))
            units.extend((f"step {step.title.split(' ', 1)[0]} bullet", _bullets(document.section(step.title, 4)))
                         for step in steps)
        for kind, bullets in units:
            for number, text in bullets:
                count = sentence_count(text)
                if count > MAX_SENTENCES:
                    message = f"{kind} has {count} sentences (max {MAX_SENTENCES})"
                    yield Finding("sentences", document.path, number, message)


def sentence_count(text: str) -> int:
    """The sentences in one list item's prose. Inline code and {…} placeholders count as words, a link as its
    text, and Markdown emphasis and curly quotes are ignored; abbreviations and initials end no sentence."""
    text = _PLACEHOLDER.sub("P", _CODE_SPAN.sub("C", text))
    text = _LINK_TEXT.sub(r"\1", text).replace("*", "").replace("_", "")
    text = text.translate(str.maketrans("\u201c\u201d\u2018\u2019", "\"\"''")).strip()
    if not text:
        return 0
    ends = [match for match in _SENTENCE_END.finditer(text) if not _abbreviation(text, match.start())]
    return len(ends) + 1


def _abbreviation(text: str, end: int) -> bool:
    token = text[: end + 1].split()[-1].lstrip("(\"'[")
    return token.lower() in _ABBREVIATIONS or _INITIALS.fullmatch(token) is not None


def _bullets(lines: tuple[tuple[int, str], ...]) -> list[tuple[int, str]]:
    """Each `- ` list item at any depth with its continuation lines, joined. A continuation is indented to the
    item's text, even after a blank line; a nested item is its own entry."""
    items: list[tuple[int, list[str]]] = []
    open_items: list[tuple[int, list[str]]] = []  # (text indent, parts), outermost first
    for number, line in lines:
        if not line.strip() or line.lstrip().startswith("|"):
            continue  # a blank line or a table row inside an item is not its prose
        indent = len(line) - len(line.lstrip())
        match = _ITEM.match(line)
        while open_items and open_items[-1][0] > indent:
            open_items.pop()
        if match is not None:
            if open_items and open_items[-1][0] == indent:
                open_items.pop()  # a sibling closes the item before it
            parts = [line[match.end() :]]
            items.append((number, parts))
            open_items.append((match.end(), parts))
        elif open_items:
            open_items[-1][1].append(line.strip())
    return [(number, " ".join(parts)) for number, parts in items]


def links(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Relative links and their anchors resolve inside the root."""
    for document in _markdown(tree):
        for link in document.links:
            message = _problem(tree, document.path, link)
            if message is not None:
                yield Finding("links", document.path, link.line, message)


def line_length(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Prose lines are at most `max_line` characters; a line of one unbreakable token is exempt."""
    for document in _markdown(tree):
        for number, line in document.prose:
            if len(line) > options.max_line and len(line.split()) > 1:
                message = f"line is {len(line)} characters (max {options.max_line})"
                yield Finding("line-length", document.path, number, message)


def all_caps(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Prose uses no ALL-CAPS word outside `allowed_caps`, except MUST or NEVER opening a bold rule lead."""
    for document in _markdown(tree):
        for number, line in document.prose:
            for word in _CAPS.findall(_plain(line)):
                if word not in options.allowed_caps:
                    yield Finding("all-caps", document.path, number, f"ALL-CAPS word {word} is not allowed")


def rule_leads(tree: SkillTree, options: Options) -> Iterator[Finding]:
    """Advisory: each MUST or NEVER lead, for a reviewer to confirm it guards safety, authority, or an
    irreversible boundary."""
    for document in _markdown(tree):
        for number, line in document.prose:
            match = _RULE_LEAD.match(line)
            if match is not None:
                message = f"rule lead: {match.group(1).strip()}"
                yield Finding("rule-leads", document.path, number, message, advisory=True)


def _skills(tree: SkillTree) -> Iterator[Document]:
    for path in tree.files():
        if PurePosixPath(path).name == "SKILL.md":
            yield tree.document(path)


def _markdown(tree: SkillTree) -> Iterator[Document]:
    for path in tree.files():
        if path.endswith(".md"):
            yield tree.document(path)


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
        elif _CELL_LINK.search(cells[0]) is None:
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
    """A link to another document in the project, not a web address or an anchor in this file."""
    return not target.startswith(("#", "http://", "https://", "mailto:"))


def _problem(tree: SkillTree, path: str, link: Link) -> str | None:
    target = link.target
    if _SCHEME.match(target) or "{" in target or "<" in target:
        return None
    file_part, _, fragment = target.partition("#")
    resolved = _resolve(path, unquote(file_part)) if file_part else path
    if resolved == ".." or resolved.startswith("../"):
        return f"link target {target} leaves the repository"
    if not tree.exists(resolved):
        return f"link target {target} does not exist"
    if fragment and resolved.endswith(".md"):
        anchors = {heading.anchor for heading in tree.document(resolved).headings}
        if fragment not in anchors:
            return f"anchor #{fragment} is not a heading in {resolved}"
    return None


def _resolve(path: str, target: str) -> str:
    """A link target as a root-relative path: `/x` from the root, anything else from the linking file."""
    if target.startswith("/"):
        return posixpath.normpath(target.lstrip("/"))
    return posixpath.normpath(posixpath.join(posixpath.dirname(path), target))


def _plain(line: str) -> str:
    """The line without a rule lead's first word, inline code, link targets, and {…} placeholders."""
    line = _LEAD_WORD.sub(r"\1", line, count=1)
    for pattern, replacement in ((_CODE_SPAN, " "), (_LINK_TARGET, "]"), (_PLACEHOLDER, " ")):
        line = pattern.sub(replacement, line)
    return line


CHECKS = (
    Check("frontmatter", frontmatter),
    Check("phases", phases),
    Check("references", references),
    Check("sentences", sentences),
    Check("links", links),
    Check("line-length", line_length),
    Check("all-caps", all_caps),
    Check("rule-leads", rule_leads, advisory=True),
)
