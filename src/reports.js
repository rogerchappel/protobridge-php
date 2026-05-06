export function renderJsonReport(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function renderTextReport(report) {
  const lines = [];
  lines.push(`protobridge-php: ${report.ok ? 'compatible' : 'mismatch detected'}`);
  lines.push(`input: ${report.input}`);
  lines.push(`proto files: ${report.descriptor.files.length}`);
  lines.push(`descriptor digest: ${report.descriptor.digest}`);
  lines.push(`snapshot digest: ${report.actual.digest}`);
  if (report.comparison) {
    lines.push(`mismatches: ${report.comparison.mismatchCount}`);
    for (const item of report.comparison.mismatches.slice(0, 20)) {
      lines.push(`- ${item.path}: expected ${JSON.stringify(item.expected)} actual ${JSON.stringify(item.actual)}`);
    }
    lines.push('versions:');
    for (const [name, result] of Object.entries(report.comparison.versions)) lines.push(`- ${name}: ${result.severity} - ${result.message}`);
  } else {
    lines.push('baseline: not provided; generated deterministic snapshot only');
  }
  return `${lines.join('\n')}\n`;
}
