"""The registry of guard checks: which exist, their ids, their run order, and which are advisory.

The skill checks are the shared ones that ship in the gobbi-skill skill, run here over Gobbi's own paths with
Gobbi's options; mirror, generated, roles, and versions are Gobbi-only.
"""

from collections.abc import Callable, Iterable, Sequence
from dataclasses import dataclass

import generated
import mirror
from repo import CANONICAL, PACKAGE, Repo
from skill_checks.checks import CHECKS as SKILL_CHECKS
from skill_checks.checks import Options
from skill_checks.finding import Finding
from skill_checks.tree import SkillTree

from . import roles, versions

__all__ = ["CHECKS", "Check", "select"]

SKILLS = (f"{CANONICAL}/skills",)
# Links must also resolve in the roles, the package, and the root guides.
LINKS = (
    f"{CANONICAL}/skills",
    f"{CANONICAL}/agents",
    f"{PACKAGE}/skills",
    f"{PACKAGE}/agents",
    f"{PACKAGE}/runtimes",
    "README.md",
    "AGENTS.md",
)
OPTIONS = Options()  # Gobbi's own skills keep the shared defaults


@dataclass(frozen=True)
class Check:
    id: str
    summary: str
    run: Callable[[Repo], Iterable[Finding]]
    advisory: bool = False  # an advisory check reports NOTE lines and never fails the run


_SKILL_CHECKS = {check.id: check for check in SKILL_CHECKS}


def _skill_check(check_id: str, summary: str, paths: Sequence[str]) -> Check:
    """The shared skill check with this id, run over Gobbi's paths with Gobbi's options."""
    shared = _SKILL_CHECKS[check_id]

    def run(repo: Repo) -> Iterable[Finding]:
        return shared.run(SkillTree(repo.root, paths), OPTIONS)

    return Check(check_id, summary, run, shared.advisory)


CHECKS = (
    _skill_check("frontmatter", "SKILL.md frontmatter parses and names its skill, type, and tools", SKILLS),
    _skill_check("phases", "Operation phases and steps are numbered in order, with Done when", SKILLS),
    _skill_check("references", "Non-domain SKILL.md ends with a Name | Description References table", SKILLS),
    _skill_check("links", "Relative links and anchors resolve", LINKS),
    Check("mirror", "The package equals the canonical projection", mirror.drift),
    Check("generated", "Generated Principles blocks equal their source", generated.drift),
    Check("roles", "Every runtime holds the same roles with the same body", roles.drift),
    Check("versions", "Every located version string is equal", versions.mismatches),
    _skill_check("line-length", f"Skill prose lines are at most {OPTIONS.max_line} characters", SKILLS),
    _skill_check("all-caps", "Skill prose uses no ALL-CAPS word outside the allowed list", SKILLS),
    _skill_check("rule-leads", "Lists MUST and NEVER rule leads for review", SKILLS),
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
