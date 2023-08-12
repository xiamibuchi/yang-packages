import { describe, expect, test } from 'vitest';
import { get } from '../src/lodash';

const obj = {
  name: 'shen',
  list: [
    {
      param1: 'string',
      list1: [
        {
          index: 1,
        },
        {
          index: 2,
        },
        3,
      ],
    },
  ],
};

describe('lg', () => {
  test('should return null', () => {
    expect(get(undefined)).toEqual(null);
    expect(get(null)).toEqual(null);
    expect(get(null, 'name')).toEqual(null);
    expect(get(undefined, 'name')).toEqual(null);
    expect(get({}, 'name')).toEqual(null);
  });
  test('should return normal value', () => {
    expect(get(obj, 'name')).toEqual('shen');
    expect(get(obj, '[name]')).toEqual('shen');
    expect(get(obj, "['name']")).toEqual('shen');
    expect(get(obj, '["name"]')).toEqual('shen');
    expect(get(obj, 'list[0].param1')).toEqual('string');
    expect(get(obj, 'list.0.param1')).toEqual('string');
    expect(get(obj, 'list.0.list1.1.index')).toEqual(2);
    expect(get(obj, 'list.0[list1].1.index')).toEqual(2);
    expect(get(obj, "list.0['list1'].1.index")).toEqual(2);
    expect(get(obj, 'list.0["list1"].1.index')).toEqual(2);
    expect(get(obj, 'list[0].list1[2]')).toEqual(3);
  });
  test('should return default', () => {
    expect(get(obj, 'name1', 1)).toEqual(1);
    expect(get(obj, 'a.b.c', 2)).toEqual(2);
    expect(get(obj, 'list[0][param2]', 3)).toEqual(3);
    expect(get(obj, 'list[0].list1[1].i', 4)).toEqual(4);
    expect(get(obj, 'list[0].list1[3]', 5)).toEqual(5);
  });
});
