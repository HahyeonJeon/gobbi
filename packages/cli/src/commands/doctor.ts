/**
 * gobbi doctor -- Unified health check for .claude/ documentation.
 *
 * Runs all health, audit, and validation checks and presents a single
 * report with maturity level, completeness, and categorized findings.
 */

import { parseArgs } from 'node:util';
import {
  runDoctorCheck,
  runDoctorPlan,
  runDoctorFix,
  MATURITY_LABELS,
  type DoctorReport,
  type DoctorPlanResult,
  type DoctorFixResult,
  type RemediationPlan,
  type Remediation,
  type RemediationResult,
} from '../lib/docs/doctor.js';
import { getRepoRoot } from '../lib/repo.js';
import { header, ok, error, yellow, dim, bold } from '../lib/style.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi doctor [options]

Run unified health checks on .claude/ documentation.

Options:
  --format <fmt>   Output format: text (default), json
  --plan           Show what would be fixed (terraform plan style)
  --fix            Auto-apply safe fixes, then re-run doctor
  --help           Show this help message`;

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
  if (report.completeness.missing.length > 0) {
    console.log(dim(`  Missing: ${report.completeness.missing.join(', ')}`));
  }

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
// Plan report printer
// ---------------------------------------------------------------------------

function printPlanReport(result: DoctorPlanResult): void {
  // Print standard report first
  printTextReport(result.report);

  const { plan } = result;

  console.log(bold('  Remediation Plan'));
  console.log('');

  if (plan.auto.length > 0) {
    console.log(dim('  Auto-fixable (run gobbi doctor --fix to apply):'));
    for (const rem of plan.auto) {
      const symbol = rem.action === 'add-nav-entry' ? '+' : '~';
      console.log(`    ${symbol} ${rem.action} ${rem.description}`);
    }
    console.log('');
  }

  if (plan.suggested.length > 0) {
    console.log(dim('  Suggested (review manually):'));
    for (const rem of plan.suggested) {
      console.log(dim(`    ? ${rem.finding.path}: ${rem.description}`));
    }
    console.log('');
  }

  console.log(dim(`  ${plan.auto.length} auto-fixable, ${plan.suggested.length} suggested, ${plan.skipped.length} skipped`));
  console.log('');
}

// ---------------------------------------------------------------------------
// Fix report printer
// ---------------------------------------------------------------------------

function printFixReport(result: DoctorFixResult): void {
  console.log(header('Doctor'));
  console.log('');

  if (result.results.length === 0) {
    console.log('  No auto-fixable issues found.');
    console.log('');
  } else {
    const succeeded = result.results.filter((r) => r.success).length;
    const failed = result.results.length - succeeded;
    console.log(`  Applied ${succeeded} fix${succeeded !== 1 ? 'es' : ''}${failed > 0 ? `, ${failed} failed` : ''}:`);

    for (const r of result.results) {
      if (r.success) {
        console.log(ok(`  ${r.remediation.action} ${r.remediation.description}`));
      } else {
        console.log(error(`  ${r.remediation.action} ${r.remediation.description} — ${r.error ?? 'Unknown error'}`));
      }
    }
    console.log('');
  }

  console.log(dim('  Re-running doctor...'));
  console.log('');

  // Print the after-fix report
  printTextReport(result.afterReport);
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
      'plan': { type: 'boolean', default: false },
      'fix': { type: 'boolean', default: false },
      'help': { type: 'boolean', default: false },
    },
  });

  if (values.help === true) {
    console.log(USAGE);
    return;
  }

  // Mutual exclusion
  if (values.plan === true && values.fix === true) {
    console.log(error('--plan and --fix are mutually exclusive'));
    process.exit(1);
  }

  const repoRoot = getRepoRoot();
  const fmt = typeof values.format === 'string' ? values.format : 'text';

  // --plan mode
  if (values.plan === true) {
    const result = await runDoctorPlan(repoRoot);

    if (fmt === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printPlanReport(result);
    }

    // Exit 2 if auto-fixable items exist (CI signal)
    if (result.plan.auto.length > 0) {
      process.exit(2);
    }
    if (result.report.status === 'degraded') {
      process.exit(1);
    }
    return;
  }

  // --fix mode
  if (values.fix === true) {
    const result = await runDoctorFix(repoRoot);

    if (fmt === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printFixReport(result);
    }

    if (result.afterReport.status === 'degraded') {
      process.exit(1);
    }
    return;
  }

  // Default mode (no flags)
  const report = await runDoctorCheck(repoRoot);

  if (fmt === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printTextReport(report);
  }

  if (report.status === 'degraded') {
    process.exit(1);
  }
}
