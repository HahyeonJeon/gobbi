import os
import unittest

import generated
from repo import Repo

from .fixtures import BLOCK, BLOCK_END, HAS_GIT, PRINCIPLES_SOURCE, SKILLS, GuardCase, generated_file


class ExpectedBlockTest(unittest.TestCase):
    def test_newline_then_the_source_after_its_frontmatter(self):
        self.assertEqual(generated.expected_block("---\nname: p\n---\n\n# P\n\nBody.\n"), "\n\n# P\n\nBody.\n")

    def test_no_frontmatter_and_no_final_newline(self):
        self.assertEqual(generated.expected_block("# P"), "\n# P\n")


@unittest.skipUnless(HAS_GIT, "git is required")
class PlanTest(GuardCase):
    def test_clean_blocks(self):
        self.assertEqual(self.messages(generated.drift, self.gobbi()), [])

    def test_stale_block_is_rewritten_and_the_rest_of_the_file_kept(self):
        stale = generated_file().replace("is a fixture", "was a fixture") + "\nAfter the block.\n"
        root = self.gobbi({".claude/CLAUDE.md": stale})
        actions, problems = generated.plan(Repo(root))
        self.assertEqual(problems, [])
        self.assertEqual([action.path for action in actions], [".claude/CLAUDE.md"])
        self.assertEqual(actions[0].content.decode(), generated_file() + "\nAfter the block.\n")

    def test_problems_sync_cannot_fix(self):
        cases = {
            "no pair": ({".codex/AGENTS.md": "## Principles\n"}, ".codex/AGENTS.md needs exactly one block pair"),
            "two pairs": ({"AGENTS.md": generated_file() * 2}, "AGENTS.md needs exactly one block pair"),
            "unknown name": (
                {"AGENTS.md": generated_file().replace("PRINCIPLES", "OTHER")},
                "AGENTS.md unknown block name OTHER",
            ),
            "missing source": (
                {"AGENTS.md": generated_file().replace("principles/SKILL.md", "gone/SKILL.md")},
                f"AGENTS.md source {SKILLS}/gone/SKILL.md is missing",
            ),
            "missing target": ({"AGENTS.md": None}, "AGENTS.md declared target is missing"),
            "undeclared": (
                {"docs/notes.md": generated_file()},
                "docs/notes.md generated block in an undeclared file",
            ),
        }
        for label, (changes, expected) in cases.items():
            with self.subTest(label):
                messages = self.messages(generated.drift, self.gobbi(changes))
                self.assertTrue(any(message.startswith(expected) for message in messages), messages)

    def test_a_fenced_marker_is_not_a_block(self):
        fenced = f"# Notes\n\n```md\n{BLOCK}\n{BLOCK_END}\n```\n"
        self.assertEqual(self.messages(generated.drift, self.gobbi({"docs/notes.md": fenced})), [])

    def test_a_symlinked_target_is_checked_through_its_declared_target(self):
        root = self.gobbi({"AGENTS.md": None})
        os.symlink(".codex/AGENTS.md", root / "AGENTS.md")
        self.assertEqual(self.messages(generated.drift, root), [])
        (root / ".codex/AGENTS.md").write_text(generated_file(PRINCIPLES_SOURCE + "More.\n"))
        actions, _ = generated.plan(Repo(root))
        self.assertEqual([action.path for action in actions], [".codex/AGENTS.md"])  # never the link itself

    def test_sync_writes_the_block(self):
        root = self.gobbi({f"{SKILLS}/principles/SKILL.md": PRINCIPLES_SOURCE + "New line.\n"})
        actions, _ = generated.plan(Repo(root))
        Repo(root).apply(actions, generated.TARGETS)
        self.assertEqual(self.messages(generated.drift, root), [])
        self.assertIn("New line.\n" + BLOCK_END, (root / "AGENTS.md").read_text())


if __name__ == "__main__":
    unittest.main()
