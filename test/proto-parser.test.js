import assert from 'node:assert/strict';
import test from 'node:test';
import { parseProto } from '../src/proto-parser.js';

test('parseProto extracts package namespace messages and fields', () => {
  const parsed = parseProto('syntax = "proto3"; package acme.demo; message Thing { string name = 1; repeated int32 count = 2; }');
  assert.equal(parsed.syntax, 'proto3');
  assert.equal(parsed.phpNamespace, 'Acme\\Demo');
  assert.equal(parsed.messages[0].fields[1].label, 'repeated');
});
