import { subsetOf } from './ReadonlySet';

describe('subsetOf', () => {
  it('empty set must return true when an empty set is given', () => {
    expect(subsetOf(new Set())(new Set())).toBe(true);
  });

  it.each([new Set([1]), new Set([1, '']), new Set([''])])(
    'empty set must return false when an nonempty set is given',
    (s) => {
      expect(subsetOf(new Set())(s)).toBe(false);
    }
  );

  it.each([new Set([1]), new Set([1, 2]), new Set([1, 2, 3])])(
    'set with itself must return true',
    (s) => {
      expect(subsetOf(s)(s)).toBe(true);
    }
  );

  it.each([
    [new Set([1]), new Set([1, 2])],
    [new Set([2]), new Set([1, 2])],
    [new Set([3]), new Set([3, 2])]
  ])(
    'set must return when containing an element not in the second set',
    (s1, s2) => {
      expect(subsetOf(s1)(s2)).toBe(false);
    }
  );
});

export {};
