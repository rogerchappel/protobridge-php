# protobridge-php Documentation

This directory holds project documentation.

## Contents

- [Contributing guide](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)
- [Agent instructions](../AGENTS.md)

## Additional docs

For a hosted documentation site, see the `docs-site/` directory if present.

## Fixture layout

A compatibility fixture is a directory containing one or more `.proto` files and, optionally, a `snapshots/` directory.

```text
fixtures/basic/
  person.proto
  order.proto
  snapshots/php-8.2.json
```

Snapshots are ordinary JSON and are safe to diff in code review.
