"""Prose style of the canonical skills: line length, ALL-CAPS words, and MUST or NEVER rule leads."""

import re
from collections.abc import Iterator

from finding import Finding
from markdown import Document
from repo import CANONICAL, Repo

__all__ = ["ALLOWED_CAPS", "PROSE_SCOPE", "capitals", "long_lines", "rule_leads"]

PROSE_SCOPE = f"{CANONICAL}/skills"
MAX_LINE = 115
# Adding a word is a reviewed one-line change.
ALLOWED_CAPS = frozenset(
    {
        # Acronyms
        "API", "ASCII", "CLI", "CRUD", "CSS", "HTML", "ID", "JSON", "OOP", "SC", "SMS", "SOLID", "SOP", "SVG",
        "UI", "URL", "UTC", "UUID", "WCAG",
        # File names
        "README",
        # Workflow unit tokens
        "DISCUSSION", "RECORD", "REVIEW", "WORK",
        # Gate tokens
        "FAIL", "PASS", "REVISE",
        # The term itself
        "ALL-CAPS",
    }
)  # fmt: skip

_CAPS = re.compile(r"(?<![\w-])[A-Z][A-Z0-9-]*[A-Z](?![\w-])")
_RULE_LEAD = re.compile(r"\s*- \*\*((?:MUST|NEVER)\b[^*]*)")
_LEAD_WORD = re.compile(r"(\s*- \*\*)(?:MUST|NEVER)\b")
_CODE_SPAN = re.compile(r"(`+).+?(?<!`)\1(?!`)")
_LINK_TARGET = re.compile(r"\]\([^)]*\)")
_PLACEHOLDER = re.compile(r"\{[^}]*\}")


def long_lines(repo: Repo) -> Iterator[Finding]:
    for document in _documents(repo):
        for number, line in document.prose:
            if len(line) > MAX_LINE and len(line.split()) > 1:
                yield Finding(
                    "line-length", document.path, number, f"line is {len(line)} characters (max {MAX_LINE})"
                )


def capitals(repo: Repo) -> Iterator[Finding]:
    for document in _documents(repo):
        for number, line in document.prose:
            for word in _CAPS.findall(_plain(line)):
                if word not in ALLOWED_CAPS:
                    yield Finding("all-caps", document.path, number, f"ALL-CAPS word {word} is not allowed")


def rule_leads(repo: Repo) -> Iterator[Finding]:
    """Advisory: each MUST or NEVER lead, for a reviewer to confirm it guards safety, authority, or an
    irreversible boundary."""
    for document in _documents(repo):
        for number, line in document.prose:
            match = _RULE_LEAD.match(line)
            if match is not None:
                yield Finding("rule-leads", document.path, number, f"rule lead: {match.group(1).strip()}")


def _documents(repo: Repo) -> Iterator[Document]:
    for path in repo.files(PROSE_SCOPE):
        if path.endswith(".md"):
            yield repo.document(path)


def _plain(line: str) -> str:
    """The line without a rule lead's first word, inline code, link targets, and {…} placeholders."""
    line = _LEAD_WORD.sub(r"\1", line, count=1)
    for pattern, replacement in ((_CODE_SPAN, " "), (_LINK_TARGET, "]"), (_PLACEHOLDER, " ")):
        line = pattern.sub(replacement, line)
    return line
