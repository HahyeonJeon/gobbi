import unittest

from markdown import anchor, parse


class FrontmatterTest(unittest.TestCase):
    def test_plain_and_double_quoted_values(self):
        document = parse("x.md", '---\nname: alpha\ndescription: "Say \\"hi\\": now"\n---\n\n# Alpha\n')
        self.assertEqual(document.frontmatter, {"name": "alpha", "description": 'Say "hi": now'})
        self.assertIsNone(document.frontmatter_error)
        self.assertEqual(document.lines[document.body_start :], ("", "# Alpha"))

    def test_anything_else_is_an_error_not_a_guess(self):
        cases = {
            "list": "---\ntools:\n  - Read\n---\n",
            "single quotes": "---\nname: 'alpha'\n---\n",
            "flow sequence": "---\ntools: [Read]\n---\n",
            "repeated key": "---\nname: a\nname: b\n---\n",
            "bad quoting": '---\nname: "open\n---\n',
            "unclosed": "---\nname: a\n",
        }
        for label, text in cases.items():
            with self.subTest(label):
                document = parse("x.md", text)
                self.assertIsNone(document.frontmatter)
                self.assertIsNotNone(document.frontmatter_error)

    def test_no_frontmatter(self):
        document = parse("x.md", "# Title\n")
        self.assertIsNone(document.frontmatter)
        self.assertIsNone(document.frontmatter_error)
        self.assertEqual(document.body_start, 0)


class HeadingTest(unittest.TestCase):
    def titles(self, text: str) -> list[tuple[int, str]]:
        return [(heading.level, heading.title) for heading in parse("x.md", text).headings]

    def test_fence_aware(self):
        text = "## A\n```md\n## In backticks\n```\n~~~\n## In tildes\n~~~\n````\n```\n## Still in\n````\n## B\n"
        self.assertEqual(self.titles(text), [(2, "A"), (2, "B")])

    def test_trailing_hashes_indent_and_setext(self):
        text = "## Closed ##\n## C#\n   ## Indented three\n    ## Indented four\nSetext\n------\n#NoSpace\n"
        self.assertEqual(self.titles(text), [(2, "Closed"), (2, "C#"), (2, "Indented three")])

    def test_unclosed_fence_runs_to_the_end(self):
        self.assertEqual(self.titles("## A\n```\n## B\n"), [(2, "A")])


class AnchorTest(unittest.TestCase):
    def test_github_anchors(self):
        cases = {
            "Phase 1 — Understand the Problem": "phase-1--understand-the-problem",
            "`review.py` (entry)": "reviewpy-entry",
            "**Bold** and *em*": "bold-and-em",
            "Read the [guide](x.md) first": "read-the-guide-first",
            "snake_case name": "snake_case-name",
        }
        for title, expected in cases.items():
            with self.subTest(title):
                self.assertEqual(anchor(title), expected)

    def test_repeated_anchors_are_numbered(self):
        document = parse("x.md", "## Rules\n## Rules\n## Rules\n")
        self.assertEqual([h.anchor for h in document.headings], ["rules", "rules-1", "rules-2"])


class BodyTest(unittest.TestCase):
    def test_links_outside_code(self):
        text = (
            "---\nname: x\n---\n"
            'See [a](a.md), ![img](i.png "title"), and `[not](code.md)`.\n'
            "| [cell](c.md#top) | x |\n"
            "```\n[fenced](f.md)\n```\n"
        )
        links = [(link.target, link.line) for link in parse("x.md", text).links]
        self.assertEqual(links, [("a.md", 4), ("i.png", 4), ("c.md#top", 5)])

    def test_prose_skips_frontmatter_fences_and_tables(self):
        text = "---\nname: x\n---\nkeep\n| table |\n```\nfenced\n```\n# Heading\n"
        prose = [line for _, line in parse("x.md", text).prose]
        self.assertEqual(prose, ["keep", "# Heading"])

    def test_section_ends_at_the_next_heading_at_its_level(self):
        text = "## A\none\n### Sub\ntwo\n```\n- fenced\n```\n## B\nthree\n"
        document = parse("x.md", text)
        self.assertEqual([line for _, line in document.section("A")], ["one", "### Sub", "two"])
        self.assertEqual(document.section("B"), ((9, "three"),))
        self.assertEqual(document.section("Missing"), ())


if __name__ == "__main__":
    unittest.main()
