"""The registry of guard checks: which exist, their ids, their run order, and which are advisory."""

from collections.abc import Callable, Iterable, Sequence
from dataclasses import dataclass

import generated
import mirror
from finding import Finding
from repo import Repo

from . import links, prose, roles, skills, versions

__all__ = ["CHECKS", "Check", "select"]


@dataclass(frozen=True)
class Check:
    id: str
    summary: str
    run: Callable[[Repo], Iterable[Finding]]
    advisory: bool = False  # an advisory check reports NOTE lines and never fails the run


CHECKS = (
    Check("frontmatter", "SKILL.md frontmatter parses and names its skill, type, and tools", skills.frontmatter),
    Check("phases", "Operation phases and steps are numbered in order, with Done when", skills.phases),
    Check("references", "Non-domain SKILL.md ends with a Name | Description References table", skills.references),
    Check("links", "Relative links and anchors resolve", links.broken),
    Check("mirror", "The package equals the canonical projection", mirror.drift),
    Check("generated", "Generated Principles blocks equal their source", generated.drift),
    Check("roles", "Every runtime holds the same roles with the same body", roles.drift),
    Check("versions", "Every located version string is equal", versions.mismatches),
    Check("line-length", f"Skill prose lines are at most {prose.MAX_LINE} characters", prose.long_lines),
    Check("all-caps", "Skill prose uses no ALL-CAPS word outside the allowed list", prose.capitals),
    Check("rule-leads", "Lists MUST and NEVER rule leads for review", prose.rule_leads, advisory=True),
)


def select(ids: Sequence[str]) -> tuple[Check, ...]:
    """The checks named by ids, in run order, or every check when none is named."""
    if not ids:
        return CHECKS
    known = {check.id for check in CHECKS}
    unknown = [check_id for check_id in ids if check_id not in known]
    if unknown:
        raise ValueError(f"unknown check: {', '.join(unknown)}")
    return tuple(check for check in CHECKS if check.id in ids)
