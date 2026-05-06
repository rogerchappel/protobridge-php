import { inspectProject } from '../src/runner.js';
import { writeUtf8 } from '../src/files.js';
const { report } = await inspectProject({
  input: 'fixtures/basic',
  format: 'json',
  profile: { protoc: '25.3.0', phpPlugin: '1.0.0', phpRuntime: '4.30.0' }
});
await writeUtf8('fixtures/basic/snapshots/php-8.2.json', `${JSON.stringify(report.actual, null, 2)}\n`);
