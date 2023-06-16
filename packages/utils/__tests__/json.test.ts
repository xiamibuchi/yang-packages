import { describe, expect, test } from 'vitest';
import { safeJsonParse } from '../src/json';

const BIG_INT_STR = '123456789114514987654321';

const COMMON_JSON = `{
  "str": "str",
  "num": 1,
  "bool": true,
  "null": null,
  "arr": [1, 2, 3],
  "obj": {
    "str": "str",
    "num": 1,
    "bool": true,
    "null": null,
    "arr": [1, 2, 3]
  }
}`;
const BIG_INT_JSON = `{"bigint":${BIG_INT_STR}}`;
const NESTED_LONG_JSON = `{
  "nested": {
    "nested_long_json": "{id:${BIG_INT_STR}}"
  }
}`;
const NESTED_COMPLEX_JSON = `{
  "str": "${BIG_INT_STR}",
  "nested": {
    "nested_complex_json": "{\\"id\\":${BIG_INT_STR}}"
  }
}`;

describe('json.ts', () => {
  test('common json should be parsed', () => {
    expect(safeJsonParse(COMMON_JSON)).toEqual(JSON.parse(COMMON_JSON));
  });
  test('BigInt should parse to string', () => {
    expect(safeJsonParse(BIG_INT_JSON).bigint).toEqual(BIG_INT_STR);
  });

  test('nested_long_json should not be parsed', () => {
    expect(safeJsonParse(NESTED_LONG_JSON).nested.nested_long_json).toEqual(
      `{id:${BIG_INT_STR}}`
    );
    expect(safeJsonParse(NESTED_COMPLEX_JSON).str).toEqual(`${BIG_INT_STR}`);
    expect(
      safeJsonParse(NESTED_COMPLEX_JSON).nested.nested_complex_json
    ).toEqual(`{"id":${BIG_INT_STR}}`);
  });
});
