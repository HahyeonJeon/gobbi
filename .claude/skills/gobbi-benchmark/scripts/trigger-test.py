#!/usr/bin/env python3
"""
trigger-test.py — Test whether a skill's description accurately triggers for the right prompts.

Usage:
    python3 trigger-test.py <SKILL.md> <prompts.txt> [--verbose]
    python3 trigger-test.py --help

Prompts file format: one prompt per line, prefixed with + (should trigger) or - (should not trigger).
    +Create a new skill for notification handling
    -Fix the login bug in auth.ts
"""

import sys
import os
import argparse
import re


def check_dependencies() -> None:
    """Check required dependencies are available, exit with helpful message if not."""
    try:
        import anthropic  # noqa: F401
    except ImportError:
        print(
            "Error: 'anthropic' package is not installed.\n"
            "Install it with: pip install anthropic",
            file=sys.stderr,
        )
        sys.exit(1)

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print(
            "Error: ANTHROPIC_API_KEY environment variable is not set.\n"
            "Set it with: export ANTHROPIC_API_KEY=<your-api-key>",
            file=sys.stderr,
        )
        sys.exit(1)


def extract_description(skill_md_path: str) -> str:
    """Extract the description field from YAML frontmatter in a SKILL.md file."""
    try:
        with open(skill_md_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: SKILL.md not found: {skill_md_path}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error reading SKILL.md: {e}", file=sys.stderr)
        sys.exit(1)

    # Match YAML frontmatter block
    frontmatter_match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not frontmatter_match:
        print(
            f"Error: No YAML frontmatter found in {skill_md_path}",
            file=sys.stderr,
        )
        sys.exit(1)

    frontmatter = frontmatter_match.group(1)

    # Extract description field (may span multiple lines with continuation indent)
    desc_match = re.search(r"^description:\s*(.+?)(?=\n\S|\Z)", frontmatter, re.MULTILINE | re.DOTALL)
    if not desc_match:
        print(
            f"Error: No 'description' field found in frontmatter of {skill_md_path}",
            file=sys.stderr,
        )
        sys.exit(1)

    description = desc_match.group(1).strip()
    if not description:
        print(
            f"Error: 'description' field is empty in {skill_md_path}",
            file=sys.stderr,
        )
        sys.exit(1)

    return description


def load_prompts(prompts_path: str) -> list[tuple[bool, str]]:
    """
    Load test prompts from file. Returns list of (expected_trigger, prompt_text) tuples.
    Lines must start with + or -.
    """
    try:
        with open(prompts_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"Error: Prompts file not found: {prompts_path}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error reading prompts file: {e}", file=sys.stderr)
        sys.exit(1)

    prompts: list[tuple[bool, str]] = []
    for i, line in enumerate(lines, start=1):
        line = line.rstrip("\n").rstrip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("+"):
            prompts.append((True, line[1:].strip()))
        elif line.startswith("-"):
            prompts.append((False, line[1:].strip()))
        else:
            print(
                f"Error: Line {i} in {prompts_path} must start with + or -: {line!r}",
                file=sys.stderr,
            )
            sys.exit(1)

    if not prompts:
        print(
            f"Error: No valid test prompts found in {prompts_path}",
            file=sys.stderr,
        )
        sys.exit(1)

    return prompts


def ask_claude(description: str, prompt: str) -> bool:
    """
    Ask Claude Haiku whether a prompt warrants loading a skill with the given description.
    Returns True if YES (should trigger), False if NO.
    """
    import anthropic

    client = anthropic.Anthropic()

    system = (
        "You are evaluating whether a user prompt warrants loading a specific skill. "
        "A skill is loaded when it is relevant to what the user is trying to do. "
        "Answer YES if the skill should be loaded for this prompt, NO if it should not. "
        "Answer with only YES or NO."
    )

    user_message = (
        f"Skill description: {description}\n\n"
        f"User prompt: {prompt}\n\n"
        "Should this skill be loaded? Answer YES or NO only."
    )

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=10,
        system=system,
        messages=[{"role": "user", "content": user_message}],
    )

    response_text = message.content[0].text.strip().upper()
    return response_text.startswith("YES")


def calculate_metrics(
    results: list[tuple[bool, bool, str]],
) -> dict[str, float]:
    """
    Calculate precision, recall, F1 score, and counts.

    results: list of (expected_trigger, actual_trigger, prompt_text)
    """
    tp = sum(1 for exp, act, _ in results if exp and act)
    fp = sum(1 for exp, act, _ in results if not exp and act)
    tn = sum(1 for exp, act, _ in results if not exp and not act)
    fn = sum(1 for exp, act, _ in results if exp and not act)
    total = len(results)
    passed = tp + tn

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (
        2 * precision * recall / (precision + recall)
        if (precision + recall) > 0
        else 0.0
    )

    return {
        "tp": float(tp),
        "fp": float(fp),
        "tn": float(tn),
        "fn": float(fn),
        "total": float(total),
        "passed": float(passed),
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }


def run_tests(
    description: str,
    prompts: list[tuple[bool, str]],
    verbose: bool,
) -> list[tuple[bool, bool, str]]:
    """Run all prompts through Claude and return results."""
    results: list[tuple[bool, bool, str]] = []

    for i, (expected, prompt_text) in enumerate(prompts, start=1):
        if verbose:
            print(f"[{i}/{len(prompts)}] Testing: {prompt_text[:80]}...")

        actual = ask_claude(description, prompt_text)
        passed = expected == actual
        results.append((expected, actual, prompt_text))

        if verbose:
            expected_label = "SHOULD trigger" if expected else "should NOT trigger"
            actual_label = "triggered" if actual else "did not trigger"
            status = "PASS" if passed else "FAIL"
            print(f"  Expected: {expected_label}")
            print(f"  Actual:   {actual_label}")
            print(f"  Result:   {status}")
            print()

    return results


def print_summary(metrics: dict[str, float]) -> None:
    """Print summary statistics."""
    print("--- Results ---")
    print(f"Total prompts:     {int(metrics['total'])}")
    print(f"Passed:            {int(metrics['passed'])}")
    print(f"Failed:            {int(metrics['total'] - metrics['passed'])}")
    print()
    print(f"True positives:    {int(metrics['tp'])}")
    print(f"False positives:   {int(metrics['fp'])}")
    print(f"True negatives:    {int(metrics['tn'])}")
    print(f"False negatives:   {int(metrics['fn'])}")
    print()
    print(f"Precision:         {metrics['precision']:.3f}")
    print(f"Recall:            {metrics['recall']:.3f}")
    print(f"F1 score:          {metrics['f1']:.3f}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Test whether a skill's description accurately triggers for the right prompts. "
            "Uses Claude to evaluate each prompt against the skill description."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Prompts file format:\n"
            "  One prompt per line, prefixed with + (should trigger) or - (should not trigger).\n"
            "\n"
            "  Example:\n"
            "  +Create a new skill for notification handling\n"
            "  -Fix the login bug in auth.ts\n"
            "\n"
            "  Lines starting with # are treated as comments and ignored.\n"
            "\n"
            "Metrics:\n"
            "  Precision — of prompts Claude said should trigger, what fraction actually should?\n"
            "  Recall    — of prompts that should trigger, what fraction did Claude identify?\n"
            "  F1        — harmonic mean of precision and recall"
        ),
    )
    parser.add_argument("skill_md", help="Path to the SKILL.md file")
    parser.add_argument("prompts_file", help="Path to the test prompts file")
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show per-prompt details (prompt text, expected, actual, pass/fail)",
    )

    args = parser.parse_args()

    check_dependencies()

    description = extract_description(args.skill_md)
    prompts = load_prompts(args.prompts_file)

    if args.verbose:
        print(f"Skill description: {description}")
        print(f"Testing {len(prompts)} prompt(s)...")
        print()

    results = run_tests(description, prompts, args.verbose)
    metrics = calculate_metrics(results)
    print_summary(metrics)

    # Exit 1 if any failures
    if metrics["passed"] < metrics["total"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
