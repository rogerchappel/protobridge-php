import { buildDescriptor } from './descriptor.js';
import { readJson, writeUtf8 } from './files.js';
import { makeSnapshot, compareSnapshots } from './snapshots.js';
import { renderJsonReport, renderTextReport } from './reports.js';

export async function inspectProject(options) {
  const descriptor = await buildDescriptor(options.input);
  const actual = makeSnapshot(descriptor, options.profile ?? {});
  const expected = options.baseline ? await readJson(options.baseline) : null;
  const comparison = expected ? compareSnapshots(actual, expected) : null;
  const report = {
    ok: comparison ? comparison.ok : true,
    input: options.input,
    descriptor,
    actual,
    baseline: options.baseline ?? null,
    comparison
  };
  const output = options.format === 'json' ? renderJsonReport(report) : renderTextReport(report);
  if (options.output) await writeUtf8(options.output, output);
  return { report, output };
}
