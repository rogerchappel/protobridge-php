import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';

const run = promisify(execFile);

test('CLI help prints usage', async () => {
  const { stdout } = await run(process.execPath, ['bin/protobridge-php.js', '--help']);
  assert.match(stdout, /Usage:/);
});

test('CLI inspect exits cleanly for matching baseline', async () => {
  const { stdout } = await run(process.execPath, ['bin/protobridge-php.js', 'inspect', 'fixtures/basic', '--baseline', 'fixtures/basic/snapshots/php-8.2.json', '--protoc', '25.3.0', '--php-plugin', '1.0.0', '--php-runtime', '4.30.0']);
  assert.match(stdout, /compatible/);
});
