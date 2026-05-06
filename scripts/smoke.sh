#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"
node bin/protobridge-php.js --help >/tmp/protobridge-help.txt
grep -q "Usage" /tmp/protobridge-help.txt
node bin/protobridge-php.js inspect fixtures/basic --baseline fixtures/basic/snapshots/php-8.2.json --protoc 25.3.0 --php-plugin 1.0.0 --php-runtime 4.30.0 >/tmp/protobridge-report.txt
grep -q "compatible" /tmp/protobridge-report.txt
node bin/protobridge-php.js inspect fixtures/basic --format json --output /tmp/protobridge-report.json
test -s /tmp/protobridge-report.json
printf 'smoke ok\n'
