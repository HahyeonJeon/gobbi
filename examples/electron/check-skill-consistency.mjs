#!/usr/bin/env bun
// Source-derived consistency gate for the canonical Electron skill.
//
// Usage: bun check-skill-consistency.mjs <skills/electron-dir>
//
// This gate does not own fixed totals. It derives identifiers from the current
// scenario and checklist sources, then compares those counts with the prose
// declarations a cold reader sees. It also follows the macOS-notification
// behavior-register row to its named owner and confirms that the row's
// version qualifier is live there.

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  process.stderr.write("usage: check-skill-consistency.mjs <skills/electron-dir>\n");
  process.exit(2);
}

const skillDir = argv[0];
try {
  if (!statSync(skillDir).isDirectory()) {
    process.stderr.write(`FAIL[skill-consistency-input] not a directory: ${skillDir}\n`);
    process.exit(2);
  }
} catch {
  process.stderr.write(`FAIL[skill-consistency-input] directory not found: ${skillDir}\n`);
  process.exit(2);
}

const failures = [];
function fail(kind, message) {
  failures.push(`FAIL[${kind}] ${message}`);
}

function readSkillFile(name) {
  try {
    return readFileSync(join(skillDir, name), "utf8");
  } catch {
    fail("skill-consistency-input", `required source is unreadable: ${name}`);
    return "";
  }
}

function uniqueIdentifiers(matches, kind, sourceName) {
  const identifiers = matches.map((match) => match[1]);
  const unique = new Set(identifiers);
  if (unique.size !== identifiers.length) {
    const seen = new Set();
    const duplicates = new Set();
    for (const identifier of identifiers) {
      if (seen.has(identifier)) duplicates.add(identifier);
      seen.add(identifier);
    }
    fail(kind, `${sourceName} repeats identifier(s): ${[...duplicates].sort().join(", ")}`);
  }
  return unique;
}

function singleDeclaredNumber(source, pattern, kind, description) {
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 1) {
    fail(kind, `${description} must appear exactly once; found ${matches.length}`);
    return null;
  }
  return Number.parseInt(matches[0][1], 10);
}

const scenarios = readSkillFile("scenarios.md");
const checklists = readSkillFile("checklists.md");
const evaluation = readSkillFile("evaluation.md");
const migration = readSkillFile("migration.md");

const scenarioIds = uniqueIdentifiers(
  [...scenarios.matchAll(/^\| \*\*(EL-SC-\d{2}[a-z])\*\*/gm)],
  "scenario-count-drift",
  "scenarios.md"
);
const declaredScenarioCount = singleDeclaredNumber(
  scenarios,
  /^\*\*Scale\*\* — twelve families, (\d+) cases,/gm,
  "scenario-count-drift",
  "the scenarios.md Scale declaration"
);
if (declaredScenarioCount !== null && declaredScenarioCount !== scenarioIds.size) {
  fail(
    "scenario-count-drift",
    `scenarios.md declares ${declaredScenarioCount} cases but contains ${scenarioIds.size} unique case identifiers`
  );
}

const checklistIds = uniqueIdentifiers(
  [...checklists.matchAll(/^- \[ \] `(EL-CHECK-\d{2}[a-z])`/gm)],
  "checklist-count-drift",
  "checklists.md"
);
const declaredChecklistCount = singleDeclaredNumber(
  evaluation,
  /Every one of the (\d+) rows appears/g,
  "checklist-count-drift",
  "the evaluation.md perspective declaration"
);
if (declaredChecklistCount !== null && declaredChecklistCount !== checklistIds.size) {
  fail(
    "checklist-count-drift",
    `evaluation.md declares ${declaredChecklistCount} rows but checklists.md contains ` +
      `${checklistIds.size} unique row identifiers`
  );
}

const closureMatches = [
  ...checklists.matchAll(/No case is unreached: (\d+) cases,\s*(\d+) rows\./g),
];
if (closureMatches.length !== 1) {
  fail(
    "trace-closure-drift",
    `the checklists.md case-to-row closure must appear exactly once; found ${closureMatches.length}`
  );
} else {
  const closureScenarioCount = Number.parseInt(closureMatches[0][1], 10);
  const closureChecklistCount = Number.parseInt(closureMatches[0][2], 10);
  if (closureScenarioCount !== scenarioIds.size || closureChecklistCount !== checklistIds.size) {
    fail(
      "trace-closure-drift",
      `checklists.md closes ${closureScenarioCount} cases to ${closureChecklistCount} rows, but source contains ` +
        `${scenarioIds.size} cases and ${checklistIds.size} rows`
    );
  }
}

const notificationRows = migration
  .split(/\r?\n/)
  .filter((line) => /^\|/.test(line) && /macOS notifications/i.test(line))
  .map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim())
  )
  .filter((cells) => cells.length === 3);
let notificationQualifier = "";
if (notificationRows.length !== 1) {
  fail(
    "migration-claim-drift",
    `migration.md must contain exactly one macOS-notification register row; found ${notificationRows.length}`
  );
} else {
  const cells = notificationRows[0];
  if (cells.length !== 3) {
    fail("migration-claim-drift", "the macOS-notification register row must contain claim, qualifier, and owner");
  } else {
    const qualifier = cells[1].replaceAll("`", "").trim();
    notificationQualifier = qualifier;
    const ownerNames = [...cells[2].matchAll(/`([^`]+\.md)`/g)].map((match) => match[1]);
    const majorMatch = /^since (\d+)$/i.exec(qualifier);

    if (!majorMatch) {
      fail(
        "migration-claim-drift",
        `the macOS-notification register qualifier must have the source-derived form 'since N'; found '${qualifier}'`
      );
    }
    if (!ownerNames.includes("windows-native.md")) {
      fail("migration-claim-drift", "the macOS-notification register row does not name windows-native.md");
    }

    if (majorMatch && ownerNames.includes("windows-native.md")) {
      const owner = readSkillFile("windows-native.md");
      const marker = `**Since ${majorMatch[1]}.**`;
      const markerIndex = owner.indexOf(marker);
      const ownerClaim = markerIndex === -1 ? "" : owner.slice(markerIndex, markerIndex + 500);
      if (markerIndex === -1 || !/macOS notifications/i.test(ownerClaim)) {
        fail(
          "migration-claim-drift",
          `migration.md says '${qualifier}', but windows-native.md does not apply '${marker}' to the ` +
            "macOS-notification claim"
        );
      }
    }
  }
}

if (/One open gap/i.test(migration)) {
  fail("migration-claim-drift", "migration.md still labels the macOS-notification qualifier as an open gap");
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  process.stderr.write(`FAIL: ${failures.length} Electron skill source-consistency violation(s)\n`);
  process.exit(5);
}

process.stdout.write(
  `OK: source consistency — scenarios declared=${declaredScenarioCount} source=${scenarioIds.size}; ` +
    `checklist rows declared=${declaredChecklistCount} source=${checklistIds.size}\n`
);
process.stdout.write(
  `OK: behavior register — the macOS-notification '${notificationQualifier}' qualifier is live in ` +
    "windows-native.md\n"
);
process.exit(0);
