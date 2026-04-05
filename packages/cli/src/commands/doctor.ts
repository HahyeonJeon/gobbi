/**
 * gobbi doctor -- Unified health check for .claude/ documentation.
 *
 * Runs all health, audit, and validation checks and presents a single
 * report with maturity level, completeness, and categorized findings.
 */

import { parseArgs } from 'node:util';
import { runDoctorCheck, type DoctorReport } from '../lib/docs/doctor.js';
import { getRepoRoot } from '../lib/repo.js';
import { header, ok, error, yellow, dim, bold } from '../lib/style.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi doctor [options]

Run unified health checks on .claude/ documentation.

Options:
  --format <fmt>   Output format: text (default), json
  --help           Show this help message`;

// ---------------------------------------------------------------------------
// Maturity labels (mirrors doctor library for display)
// ---------------------------------------------------------------------------

const MATURITY_LABELS: readonly string[] = [
  'None',
  'Bootstrap',
  'Structured',
  'Active',
  'Self-Sustaining',
];

// ---------------------------------------------------------------------------
// Text report printer
// ---------------------------------------------------------------------------

function printTextReport(report: DoctorReport): void {
  console.log(header('Doctor'));
  console.log('');

  // Summary lines (indented)
  for (const line of report.summary.split('\n')) {
    console.log(`  ${line}`);
  }

  console.log('');

  // Maturity
  const maturityLabel = MATURITY_LABELS[report.maturityLevel] ?? 'Unknown';
  console.log(`  Maturity: Level ${report.maturityLevel} (${maturityLabel})`);

  // Completeness
  const pct = Math.round(report.completeness.score * 100);
  console.log(`  Completeness: ${pct}%`);

  console.log('');

  // Findings
  if (report.findings.length === 0) {
    console.log(ok('No issues found'));
    return;
  }

  // Group by severity
  const errors = report.findings.filter((f) => f.severity === 'error');
  const warnings = report.findings.filter((f) => f.severity === 'warning');
  const infos = report.findings.filter((f) => f.severity === 'info');

  if (errors.length > 0) {
    console.log(bold('  Errors:'));
    for (const finding of errors) {
      console.log(error(`[${finding.category}] ${finding.path}: ${finding.message}`));
      console.log(dim(`    -> ${finding.suggestion}`));
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(bold('  Warnings:'));
    for (const finding of warnings) {
      console.log(yellow(`  ! [${finding.category}] ${finding.path}: ${finding.message}`));
      console.log(dim(`    -> ${finding.suggestion}`));
    }
    console.log('');
  }

  if (infos.length > 0) {
    console.log(bold('  Info:'));
    for (const finding of infos) {
      console.log(dim(`  i [${finding.category}] ${finding.path}: ${finding.message}`));
      console.log(dim(`    -> ${finding.suggestion}`));
    }
    console.log('');
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function runDoctor(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      'format': { type: 'string' },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(USAGE);
    return;
  }

  const repoRoot = getRepoRoot();
  const report = await runDoctorCheck(repoRoot);

  const fmt = typeof values.format === 'string' ? values.format : 'text';

  if (fmt === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printTextReport(report);
  }

  if (report.status === 'degraded') {
    process.exit(1);
  }
}
