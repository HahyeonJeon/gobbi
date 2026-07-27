#!/usr/bin/env bun
// Source-derived consistency gate for the canonical Electron skill.
//
// Usage: bun check-skill-consistency.mjs <skills/electron-dir>
//
// This gate does not own fixed totals or scenario-to-check exceptions. It
// derives identifiers, trace declarations, and row-definition traces from the
// current sources, then compares the exact directed edge sets in both
// directions. It also follows the macOS-notification behavior-register row to
// its named owner and confirms that the row's version qualifier is live there.

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

function parseChecklistRows(source) {
  const rows = [];
  let current = null;

  function finishCurrent() {
    if (current !== null) {
      rows.push({ id: current.id, definition: current.lines.join("\n") });
      current = null;
    }
  }

  for (const line of source.split(/\r?\n/)) {
    const rowStart = /^- \[ \] `(EL-CHECK-\d{2}[a-z])`/.exec(line);
    if (rowStart) {
      finishCurrent();
      current = { id: rowStart[1], lines: [line] };
      continue;
    }
    if (current !== null && /^#{2,6}\s/.test(line)) {
      finishCurrent();
      continue;
    }
    if (current !== null) current.lines.push(line);
  }
  finishCurrent();
  return rows;
}

function edgeKey(scenarioId, checklistId) {
  return `${scenarioId}\u0000${checklistId}`;
}

function formatEdge(key) {
  const [scenarioId, checklistId] = key.split("\u0000");
  return `${scenarioId} -> ${checklistId}`;
}

function parseTemplate(value, declarationName) {
  const marker = "{slot}";
  const firstMarker = value.indexOf(marker);
  if (firstMarker === -1 || firstMarker !== value.lastIndexOf(marker)) {
    fail(
      "trace-closure-drift",
      `${declarationName} template must contain exactly one '${marker}' marker; found '${value}'`
    );
    return null;
  }
  return {
    prefix: value.slice(0, firstMarker),
    suffix: value.slice(firstMarker + marker.length),
  };
}

function applyTemplate(template, value, declarationName) {
  if (
    template === null ||
    !value.startsWith(template.prefix) ||
    !value.endsWith(template.suffix) ||
    value.length <= template.prefix.length + template.suffix.length
  ) {
    fail(
      "trace-closure-drift",
      `${declarationName} template does not match live identifier '${value}'`
    );
    return null;
  }
  const slot = value.slice(
    template.prefix.length,
    value.length - template.suffix.length
  );
  return slot;
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

const checklistRows = parseChecklistRows(checklists);
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

const traceDeclarationLines = checklists
  .split(/\r?\n/)
  .filter((line) => /^- `trace-/.test(line));
const traceDeclarations = [];
for (const line of traceDeclarationLines) {
  const match =
    /^- `trace-(default|additional|replacement): ([^`]+) -> ([^`]+)`$/.exec(line);
  if (!match) {
    fail("trace-closure-drift", `malformed trace declaration: ${line}`);
    continue;
  }
  traceDeclarations.push({
    kind: match[1],
    scenario: match[2],
    checklist: match[3],
    line,
  });
}

const defaultDeclarations = traceDeclarations.filter(
  (declaration) => declaration.kind === "default"
);
if (defaultDeclarations.length !== 1) {
  fail(
    "trace-closure-drift",
    `exactly one trace-default declaration is required; found ${defaultDeclarations.length}`
  );
}

const expectedEdges = new Set();
const defaultEdges = new Map();
const defaultDeclaration = defaultDeclarations.length === 1 ? defaultDeclarations[0] : null;
if (defaultDeclaration !== null) {
  const scenarioTemplate = parseTemplate(
    defaultDeclaration.scenario,
    "trace-default scenario"
  );
  const checklistTemplate = parseTemplate(
    defaultDeclaration.checklist,
    "trace-default checklist"
  );
  for (const scenarioId of scenarioIds) {
    const slot = applyTemplate(scenarioTemplate, scenarioId, "trace-default scenario");
    if (slot === null || checklistTemplate === null) continue;
    const checklistId =
      checklistTemplate.prefix + slot + checklistTemplate.suffix;
    const edge = edgeKey(scenarioId, checklistId);
    defaultEdges.set(scenarioId, edge);
    expectedEdges.add(edge);
  }
}

const seenNonDefaultDeclarations = new Set();
const seenNonDefaultEdges = new Set();
const replacementScenarios = new Set();
const nonDefaultDeclarations = traceDeclarations.filter(
  (declaration) => declaration.kind !== "default"
);
for (const declaration of nonDefaultDeclarations) {
  const declarationKey =
    `${declaration.kind}\u0000${declaration.scenario}\u0000${declaration.checklist}`;
  const edge = edgeKey(declaration.scenario, declaration.checklist);
  if (seenNonDefaultDeclarations.has(declarationKey)) {
    fail(
      "trace-closure-drift",
      `duplicate ${declaration.kind} trace declaration: ${formatEdge(edge)}`
    );
    continue;
  }
  seenNonDefaultDeclarations.add(declarationKey);
  if (seenNonDefaultEdges.has(edge)) {
    fail(
      "trace-closure-drift",
      `duplicate non-default trace edge: ${formatEdge(edge)}`
    );
    continue;
  }
  seenNonDefaultEdges.add(edge);

  const scenarioIsLive = scenarioIds.has(declaration.scenario);
  const checklistIsLive = checklistIds.has(declaration.checklist);
  if (!scenarioIsLive) {
    fail(
      "trace-closure-drift",
      `${declaration.kind} declaration names non-live scenario '${declaration.scenario}'`
    );
  }
  if (!checklistIsLive) {
    fail(
      "trace-closure-drift",
      `${declaration.kind} declaration names non-live checklist row '${declaration.checklist}'`
    );
  }
  if (!scenarioIsLive || !checklistIsLive) continue;

  const scenarioDefaultEdge = defaultEdges.get(declaration.scenario);
  if (scenarioDefaultEdge === undefined) {
    fail(
      "trace-closure-drift",
      `${declaration.kind} declaration has no live default edge to extend: ${formatEdge(edge)}`
    );
    continue;
  }
  if (edge === scenarioDefaultEdge) {
    fail(
      "trace-closure-drift",
      `${declaration.kind} declaration redundantly repeats the default edge: ${formatEdge(edge)}`
    );
    continue;
  }

  if (declaration.kind === "replacement") {
    if (replacementScenarios.has(declaration.scenario)) {
      fail(
        "trace-closure-drift",
        `scenario '${declaration.scenario}' has more than one replacement declaration`
      );
      continue;
    }
    replacementScenarios.add(declaration.scenario);
    expectedEdges.delete(scenarioDefaultEdge);
  }
  expectedEdges.add(edge);
}

const actualEdges = new Set();
const reachedScenarios = new Set();
const tracedChecklistRows = new Set();
for (const row of checklistRows) {
  const traces = [...row.definition.matchAll(/`(EL-SC-\d{2}[a-z])`/g)].map(
    (match) => match[1]
  );
  if (traces.length !== 1) {
    fail(
      "trace-closure-drift",
      `${row.id} definition must carry exactly one scenario trace; found ${traces.length}`
    );
    continue;
  }
  const scenarioId = traces[0];
  if (!scenarioIds.has(scenarioId)) {
    fail(
      "trace-closure-drift",
      `${row.id} definition traces to non-live scenario '${scenarioId}'`
    );
    continue;
  }
  const edge = edgeKey(scenarioId, row.id);
  if (actualEdges.has(edge)) {
    fail("trace-closure-drift", `duplicate checklist trace edge: ${formatEdge(edge)}`);
  }
  actualEdges.add(edge);
  reachedScenarios.add(scenarioId);
  tracedChecklistRows.add(row.id);
}

for (const scenarioId of scenarioIds) {
  if (!reachedScenarios.has(scenarioId)) {
    fail("trace-closure-drift", `live scenario '${scenarioId}' is unreached by any checklist row`);
  }
}
for (const checklistId of checklistIds) {
  if (!tracedChecklistRows.has(checklistId)) {
    fail(
      "trace-closure-drift",
      `live checklist row '${checklistId}' has no valid scenario trace`
    );
  }
}

const expectedChecklistIds = new Set(
  [...expectedEdges].map((edge) => edge.split("\u0000")[1])
);
for (const checklistId of expectedChecklistIds) {
  if (!checklistIds.has(checklistId)) {
    fail("trace-closure-drift", `expected checklist row '${checklistId}' is missing`);
  }
}
for (const checklistId of checklistIds) {
  if (!expectedChecklistIds.has(checklistId)) {
    fail(
      "trace-closure-drift",
      `checklist row '${checklistId}' is orphaned from the declared trace relation`
    );
  }
}
for (const edge of expectedEdges) {
  if (!actualEdges.has(edge)) {
    fail("trace-closure-drift", `missing expected trace edge: ${formatEdge(edge)}`);
  }
}
for (const edge of actualEdges) {
  if (!expectedEdges.has(edge)) {
    fail("trace-closure-drift", `unexpected trace edge: ${formatEdge(edge)}`);
  }
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
  `OK: trace closure — expected=${expectedEdges.size} actual=${actualEdges.size}; exact edge sets match\n`
);
process.stdout.write(
  `OK: behavior register — the macOS-notification '${notificationQualifier}' qualifier is live in ` +
    "windows-native.md\n"
);
process.exit(0);
