# Report format

The JSON report is designed for automation:

- `ok`: overall pass/fail boolean
- `descriptor`: deterministic schema descriptor plus digest
- `actual`: generated deterministic PHP-shape snapshot
- `baseline`: baseline path when supplied
- `comparison.mismatches`: path-addressed differences
- `comparison.versions`: protoc/plugin/runtime compatibility results

Text output is optimized for humans and CI logs. JSON output is stable enough for agents to parse, but not yet a formal API guarantee before `1.0.0`.
