const fs = require('fs');
const path = require('path');

/**
 * Writes test-results/SUMMARY.md with pass/fail table after the run.
 */
class Tender360SummaryReporter {
  constructor() {
    this.results = [];
  }

  onTestEnd(test, result) {
    this.results.push({
      id: test.title,
      file: path.basename(test.location.file),
      status: result.status,
      duration: result.duration,
      error: result.error?.message?.split('\n')[0] || ''
    });
  }

  onEnd() {
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => r.status === 'failed').length;
    const skipped = this.results.filter((r) => r.status === 'skipped').length;
    const total = this.results.length;

    const lines = [
      '# Tender360 E2E Test Summary',
      '',
      `**Date:** ${new Date().toISOString()}`,
      '',
      '| Metric | Count |',
      '|--------|------:|',
      `| Total | ${total} |`,
      `| Passed | ${passed} |`,
      `| Failed | ${failed} |`,
      `| Skipped | ${skipped} |`,
      '',
      '## Results',
      '',
      '| Status | Test | File | Duration (ms) | Notes |',
      '|--------|------|------|---------------|-------|'
    ];

    for (const r of this.results) {
      const icon = r.status === 'passed' ? 'PASS' : r.status === 'failed' ? 'FAIL' : 'SKIP';
      lines.push(`| ${icon} | ${r.id} | ${r.file} | ${Math.round(r.duration)} | ${r.error} |`);
    }

    lines.push('');
    lines.push('## HTML report');
    lines.push('');
    lines.push('Open `playwright-report/index.html` for screenshots, videos, and traces.');
    lines.push('');

    const outDir = path.join(process.cwd(), 'test-results');
    fs.mkdirSync(outDir, { recursive: true });
    const summaryPath = path.join(outDir, 'SUMMARY.md');
    fs.writeFileSync(summaryPath, lines.join('\n'), 'utf8');
    console.log(`\n📋 Summary report: ${summaryPath}\n`);
    console.log(`   PASS: ${passed}  FAIL: ${failed}  SKIP: ${skipped}\n`);
  }
}

module.exports = Tender360SummaryReporter;
