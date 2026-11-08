from __future__ import annotations

import unittest

from skill_checks import checks
from skill_checks.checks import CHECKS, Options
from skill_checks.tree import SkillTree

from .fixtures import PROCEDURE, REFERENCES, SKILLS, SkillCase, skill

ALPHA = f"{SKILLS}/alpha/SKILL.md"
NOTES = f"{SKILLS}/alpha/notes.md"


class FrontmatterTest(SkillCase):
    def test_clean(self):
        self.assertEqual(self.messages(checks.frontmatter, self.project()), [])

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
                messages = self.messages(checks.frontmatter, self.project({ALPHA: text}))
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(f"{ALPHA} {expected}"), messages)

    def test_every_use_it_clause_is_a_trigger(self):
        for clause in ("when", "whenever", "before", "after", "for"):
            with self.subTest(clause):
                text = skill("alpha").replace("Use it when", f"Use it {clause}")
                self.assertEqual(self.messages(checks.frontmatter, self.project({ALPHA: text})), [])


class PhasesTest(SkillCase):
    def phases(self, procedure: str, skill_type: str = "operation") -> list[str]:
        text = skill("alpha", skill_type, procedure + REFERENCES)
        return [
            message.removeprefix(f"{ALPHA} ")
            for message in self.messages(checks.phases, self.project({ALPHA: text}))
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


class ReferencesTest(SkillCase):
    def references(self, text: str) -> list[str]:
        return [
            message.removeprefix(f"{ALPHA} ")
            for message in self.messages(checks.references, self.project({ALPHA: text}))
        ]

    def test_clean_and_domain_exempt(self):
        self.assertEqual(self.messages(checks.references, self.project()), [])
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


class LinksTest(SkillCase):
    def broken(self, body: str) -> list[str]:
        root = self.project({NOTES: f"# Notes\n\n## Second — Part\n\n{body}\n", "tool.py": "x = 1\n"})
        return [message.removeprefix(f"{NOTES} ") for message in self.messages(checks.links, root)]

    def test_clean_project(self):
        self.assertEqual(self.messages(checks.links, self.project()), [])

    def test_resolving_links(self):
        body = (
            "[skill](SKILL.md) [anchor](SKILL.md#alpha) [self](#second--part) [dir](../beta) "
            "[root](/README.md) [web](https://example.com/x.md) [mail](mailto:a@b.c) "
            "[template](../{name}/SKILL.md) [angle](<../x y.md>) [encoded](../beta/SKILL%2Emd) "
            "[code-anchor](../../tool.py#L1)"
        )
        self.assertEqual(self.broken(body), [])

    def test_broken_links(self):
        cases = {
            "missing file": ("[x](missing.md)", "link target missing.md does not exist"),
            "missing anchor": ("[x](SKILL.md#nope)", "anchor #nope is not a heading in"),
            "missing self anchor": ("[x](#nope)", f"anchor #nope is not a heading in {NOTES}"),
            "outside": ("[x](../../../x.md)", "link target ../../../x.md leaves the repository"),
        }
        for label, (body, expected) in cases.items():
            with self.subTest(label):
                messages = self.broken(body)
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(expected), messages)

    def test_files_outside_the_paths_are_not_read(self):
        self.assertEqual(self.messages(checks.links, self.project({"docs/notes.md": "[x](missing.md)\n"})), [])


class ProseTest(SkillCase):
    def found(self, run, body: str, options: Options | None = None) -> list[str]:
        root = self.project({NOTES: f"# Notes\n\n{body}\n"})
        return [message.removeprefix(f"{NOTES} ") for message in self.messages(run, root, options)]

    def test_clean_project(self):
        root = self.project()
        for run in (checks.line_length, checks.all_caps, checks.rule_leads):
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
        self.assertEqual(self.found(checks.line_length, body), ["line is 119 characters (max 115)"])

    def test_max_line_is_a_project_option(self):
        body = ("word " * 24).rstrip()  # 119 characters
        self.assertEqual(self.found(checks.line_length, body, Options(max_line=120)), [])
        self.assertEqual(
            self.found(checks.line_length, body, Options(max_line=80)), ["line is 119 characters (max 80)"]
        )

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
            self.found(checks.all_caps, body),
            [
                "ALL-CAPS word VERY is not allowed",
                "ALL-CAPS word DONT is not allowed",
                "ALL-CAPS word MUST is not allowed",
                "ALL-CAPS word NEVER is not allowed",
            ],
        )

    def test_allowed_caps_is_a_project_option(self):
        options = Options(allowed_caps=Options().allowed_caps | {"VERY"})
        self.assertEqual(self.found(checks.all_caps, "This is VERY fine, and API too.", options), [])

    def test_rule_leads_are_listed_as_advisory(self):
        body = "- **MUST keep the boundary.** Because.\n- **NEVER cross it.**\n- **Prefer** this."
        self.assertEqual(
            self.found(checks.rule_leads, body),
            ["rule lead: MUST keep the boundary.", "rule lead: NEVER cross it."],
        )
        root = self.project({NOTES: f"# Notes\n\n{body}\n"})
        self.assertTrue(
            all(finding.advisory for finding in checks.rule_leads(SkillTree(root, (SKILLS,)), Options()))
        )


class RegistryTest(SkillCase):
    def test_ids_are_unique_and_rule_leads_alone_is_advisory(self):
        ids = [check.id for check in CHECKS]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual([check.id for check in CHECKS if check.advisory], ["rule-leads"])

    def test_each_finding_carries_its_check_id_and_advisory_flag(self):
        broken = skill("alpha").replace("name: alpha", "name: other").replace("- three\n", "- three\n- four\n")
        notes = f"# Notes\n\n[x](missing.md) {'word ' * 30}\n\nThis is VERY loud.\n\n- **MUST hold.**\n"
        alpha = broken.replace(REFERENCES, "See [x](notes.md).\n")
        tree = SkillTree(self.project({ALPHA: alpha, NOTES: notes}), (SKILLS,))
        for check in CHECKS:
            with self.subTest(check.id):
                found = list(check.run(tree, Options()))
                self.assertTrue(found, f"the fixture does not trigger {check.id}")
                self.assertEqual(
                    {(finding.check, finding.advisory) for finding in found}, {(check.id, check.advisory)}
                )


if __name__ == "__main__":
    unittest.main()
