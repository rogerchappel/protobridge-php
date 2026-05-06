import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDescriptor } from '../src/descriptor.js';
import { readJson } from '../src/files.js';
import { makeSnapshot, compareSnapshots } from '../src/snapshots.js';

test('fixture snapshot matches deterministic output', async () => {
  const descriptor = await buildDescriptor('fixtures/basic');
  const actual = makeSnapshot(descriptor, { protoc: '25.3.0', phpPlugin: '1.0.0', phpRuntime: '4.30.0' });
  const expected = await readJson('fixtures/basic/snapshots/php-8.2.json');
  assert.equal(compareSnapshots(actual, expected).ok, true);
});

test('version mismatch reports error for protoc major changes', () => {
  const result = compareSnapshots({ generator: { protoc: '26.0.0' }, descriptor: {}, generated: [] }, { generator: { protoc: '25.3.0' }, descriptor: {}, generated: [] });
  assert.equal(result.versions.protoc.severity, 'error');
});
