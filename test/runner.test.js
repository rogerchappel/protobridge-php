import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectProject } from '../src/runner.js';

test('inspectProject renders a compatible text report with baseline', async () => {
  const { report, output } = await inspectProject({
    input: 'fixtures/basic',
    baseline: 'fixtures/basic/snapshots/php-8.2.json',
    profile: { protoc: '25.3.0', phpPlugin: '1.0.0', phpRuntime: '4.30.0' }
  });
  assert.equal(report.ok, true);
  assert.match(output, /compatible/);
});
