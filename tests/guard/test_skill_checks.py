"""The guard runs every shared skill check over Gobbi's own paths."""

import unittest

from checks import CHECKS
from repo import Repo
from skill_checks.checks import CHECKS as SKILL_CHECKS

from .fixtures import AGENTS, HAS_GIT, SKILLS, GuardCase

GUARD_CHECKS = {check.id: check for check in CHECKS}


class RegistryTest(unittest.TestCase):
    def test_every_shared_check_runs_in_the_guard_with_its_advisory_flag(self):
        for shared in SKILL_CHECKS:
            with self.subTest(shared.id):
                self.assertEqual(GUARD_CHECKS[shared.id].advisory, shared.advisory)


@unittest.skipUnless(HAS_GIT, "git is required")
class PathsTest(GuardCase):
    def found(self, check_id: str, changes: dict[str, str]) -> list[str]:
        return [finding.path for finding in GUARD_CHECKS[check_id].run(Repo(self.gobbi(changes)))]

    def test_skill_and_prose_checks_read_the_canonical_skills_only(self):
        long = "word " * 40
        paths = (f"{SKILLS}/alpha/notes.md", f"{AGENTS}/claude/notes.md", "plugins/gobbi/skills/alpha/notes.md")
        self.assertEqual(self.found("line-length", dict.fromkeys(paths, long)), [paths[0]])

    def test_links_read_the_roles_the_package_and_the_root_guides(self):
        broken = "[x](missing.md)\n"
        read = (f"{AGENTS}/notes.md", "plugins/gobbi/agents/notes.md", "plugins/gobbi/runtimes/codex/notes.md")
        changes = {**dict.fromkeys(read, broken), "README.md": broken, "docs/notes.md": broken}
        self.assertEqual(self.found("links", changes), sorted(["README.md", *read]))


if __name__ == "__main__":
    unittest.main()
