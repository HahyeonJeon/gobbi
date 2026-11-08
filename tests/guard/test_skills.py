import unittest

from checks import skills

from .fixtures import HAS_GIT, PROCEDURE, REFERENCES, SKILLS, GuardCase, skill

ALPHA = f"{SKILLS}/alpha/SKILL.md"


@unittest.skipUnless(HAS_GIT, "git is required")
class FrontmatterTest(GuardCase):
    def test_clean(self):
        self.assertEqual(self.messages(skills.frontmatter, self.gobbi()), [])

    def test_each_rule(self):
        good = skill("alpha")
        cases = {
            "name": (
                good.replace("name: alpha", "name: other"),
                "name is 'other', not the directory name 'alpha'",
            ),
            "title": (
                good.replace("# Alpha\n", "# Gamma\n"),
                "description does not start with the H1 title 'Gamma'",
            ),
            "use it": (good.replace("Use it when", "Use when"), "description has no 'Use it"),
            "skill-type": (good.replace("skill-type: operation\n", ""), "skill-type is None, not one of"),
            "unknown type": (
                good.replace("skill-type: operation", "skill-type: helper"),
                "skill-type is 'helper'",
            ),
            "tools": (good.replace("Read, Bash(git:*)", "Read, , Bash"), "allowed-tools is not a comma list"),
            "unparsed": (
                good.replace("allowed-tools: Read", "allowed-tools: [Read"),
                "frontmatter does not parse",
            ),
            "missing": ("# Alpha\n", "no frontmatter"),
        }
        for label, (text, expected) in cases.items():
            with self.subTest(label):
                messages = self.messages(skills.frontmatter, self.gobbi({ALPHA: text}))
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(f"{ALPHA} {expected}"), messages)


@unittest.skipUnless(HAS_GIT, "git is required")
class PhasesTest(GuardCase):
    def phases(self, procedure: str, skill_type: str = "operation") -> list[str]:
        text = skill("alpha", skill_type, procedure + REFERENCES)
        return [
            message.removeprefix(f"{ALPHA} ")
            for message in self.messages(skills.phases, self.gobbi({ALPHA: text}))
        ]

    def test_clean(self):
        self.assertEqual(self.phases(PROCEDURE), [])

    def test_each_rule(self):
        cases = {
            "order": (PROCEDURE.replace("Phase 2 — Finish", "Phase 3 — Finish").replace("2.1 Last", "3.1 Last"),
                      "Phase 3 is out of order; expected Phase 2"),
            "done when": (PROCEDURE.replace(" Done when it has begun.", ""), "Phase 1 has no 'Done when'"),
            "heading first": (PROCEDURE.replace("Begin the work. Done when it has begun.\n\n", ""),
                              "Phase 1 has no 'Done when'"),
            "format": (PROCEDURE.replace("Phase 1 — Start", "Phase 1: Start"), "phase heading 'Phase 1: Start'"),
            "step phase": (PROCEDURE.replace("#### 1.2 Second", "#### 2.2 Second"), "step 2.2 is under Phase 1"),
            "step order": (PROCEDURE.replace("#### 1.2 Second", "#### 1.3 Second"),
                           "step 1.3 is out of order; expected 1.2"),
            "bullets": (PROCEDURE.replace("- three\n", "- three\n- four\n"),
                        "step 1.1 has 4 top-level bullets (max 3)"),
        }  # fmt: skip
        for label, (procedure, expected) in cases.items():
            with self.subTest(label):
                messages = self.phases(procedure)
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(expected), messages)

    def test_nested_and_fenced_bullets_do_not_count(self):
        extra = "- three\n  - nested\n\n```\n- fenced\n- fenced\n```\n"
        self.assertEqual(self.phases(PROCEDURE.replace("- three\n", extra)), [])

    def test_only_operation_skills(self):
        self.assertEqual(self.phases("### Phase 2 — Wrong\n\n", "preference"), [])


@unittest.skipUnless(HAS_GIT, "git is required")
class ReferencesTest(GuardCase):
    def references(self, text: str) -> list[str]:
        return [
            message.removeprefix(f"{ALPHA} ")
            for message in self.messages(skills.references, self.gobbi({ALPHA: text}))
        ]

    def test_clean_and_domain_exempt(self):
        self.assertEqual(self.messages(skills.references, self.gobbi()), [])
        self.assertEqual(self.references(skill("alpha", "domain")), [])

    def test_each_rule(self):
        good = skill("alpha")
        cases = {
            "missing": (
                good.replace(REFERENCES, "See the [guide](../alpha/SKILL.md).\n"),
                "links internal documents but has no ## References section",
            ),
            "no table": (good.replace(REFERENCES, "## References\n\nNone.\n"), "## References has no table"),
            "header": (good.replace("| Name | Description |", "| Skill | Description |"), "table header is not"),
            "cells": (good.replace("| The guide. |", "| The guide. | extra |"), "row has 3 cells, not 2"),
            "link": (good.replace("[Guide](../alpha/SKILL.md#alpha)", "Guide"), "Name cell holds no link"),
        }
        for label, (text, expected) in cases.items():
            with self.subTest(label):
                messages = self.references(text)
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(expected), messages)

    def test_a_skill_without_internal_links_needs_no_references(self):
        text = skill("alpha").replace(REFERENCES, "See <https://example.com>.\n")
        self.assertEqual(self.references(text), [])

    def test_an_escaped_pipe_stays_in_its_cell(self):
        text = skill("alpha").replace("| The guide. |", "| The `a \\| b` guide. |")
        self.assertEqual(self.references(text), [])


if __name__ == "__main__":
    unittest.main()
