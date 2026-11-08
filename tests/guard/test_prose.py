import unittest

from checks import prose

from .fixtures import AGENTS, HAS_GIT, SKILLS, GuardCase

NOTES = f"{SKILLS}/alpha/notes.md"


@unittest.skipUnless(HAS_GIT, "git is required")
class ProseTest(GuardCase):
    def found(self, run, body: str) -> list[str]:
        root = self.gobbi({NOTES: f"# Notes\n\n{body}\n"})
        return [message.removeprefix(f"{NOTES} ") for message in self.messages(run, root)]

    def test_clean_fixture(self):
        root = self.gobbi()
        for run in (prose.long_lines, prose.capitals, prose.rule_leads):
            with self.subTest(run.__name__):
                self.assertEqual(self.messages(run, root), [])

    def test_long_lines(self):
        body = "\n".join(
            [
                "word " * 23,  # 115 characters: allowed
                ("word " * 24).rstrip(),  # 119 characters
                "x" * 200,  # one unbreakable token: exempt
                "| " + "cell " * 40 + "|",  # table row: exempt
                "```",
                "code " * 40,  # fenced: exempt
                "```",
            ]
        )
        self.assertEqual(self.found(prose.long_lines, body), ["line is 119 characters (max 115)"])

    def test_scope_is_canonical_skills_only(self):
        long = "word " * 40
        root = self.gobbi({f"{AGENTS}/claude/notes.md": long, "plugins/gobbi/skills/alpha/notes.md": long})
        self.assertEqual(self.messages(prose.long_lines, root), [])

    def test_capitals(self):
        body = "\n".join(
            [
                "The API and JSON and ALL-CAPS and PASS are allowed, as are T0, K2, and UTF-8.",
                "This is VERY bad, and DONT do it.",
                "Code `SHOUT`, links [x](NOISE.md), and {PLACEHOLDER} are removed.",
                "- **MUST keep the boundary.** A rule lead may open with MUST.",
                "- **NEVER cross it.** But NEVER inside the sentence is shouting.",
            ]
        )
        self.assertEqual(
            self.found(prose.capitals, body),
            [
                "ALL-CAPS word VERY is not allowed",
                "ALL-CAPS word DONT is not allowed",
                "ALL-CAPS word MUST is not allowed",
                "ALL-CAPS word NEVER is not allowed",
            ],
        )

    def test_rule_leads_are_listed(self):
        body = "- **MUST keep the boundary.** Because.\n- **NEVER cross it.**\n- **Prefer** this."
        self.assertEqual(
            self.found(prose.rule_leads, body),
            ["rule lead: MUST keep the boundary.", "rule lead: NEVER cross it."],
        )


if __name__ == "__main__":
    unittest.main()
