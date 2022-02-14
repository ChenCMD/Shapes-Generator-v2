import { definePartialFnOnClass } from './BoundedPartialFunction';
import * as O from 'fp-ts/Option';

class A {
  readonly param: number;
  constructor(param: number) {
    this.param = param;
  }
}

describe('Partial functions constructed by definePartialFnOnClass', () => {
  // テスト用の関数列
  const testFunctions: ReadonlyArray<(x: A) => A> = [
    x => x,
    x => new A(x.param * x.param),
    x => new A(2 * x.param),
    x => new A(-x.param),
  ];

  // A の値の列
  const acceptableInputs: A[] = [1, 10, -1, -100].map(n => new A(n));

  // A 以外の値の列
  const unacceptableInputs: unknown[] = [1, 0.1, '', null, undefined, ({})].concat(testFunctions);

  describe('when given an instance of the class', () => {
    const testCases = testFunctions.flatMap(f => acceptableInputs.map(a => [f, a] as const));

    it.each(testCases)('must accept the input', (f, a) => {
      expect(definePartialFnOnClass(A, f).canBeAppliedTo(a)).toEqual(true);
    });

    it.each(testCases)('must convert according to the underlying function', (f, a) => {
      expect(definePartialFnOnClass(A, f).convert(a)).toEqual(f(a));
    });

    it.each(testCases)('must convert (with asPartialFunctionOn) according to the underlying function', (f, a) => {
      expect(definePartialFnOnClass(A, f).asPartialFunctionOn()(a)).toEqual(O.some(f(a)));
    });
  });

  describe('when given non-instance of the class', () => {
    const testCases =
      testFunctions.flatMap(f => unacceptableInputs.map(a => [f, a] as const));

    it.each(testCases)('must not accept the input', (f, x) => {
      expect(definePartialFnOnClass(A, f).canBeAppliedTo(x)).toEqual(false);
    });

    it.each(testCases)('must emit Option.none when a value is applied to asPartialFunctionOn', (f, x) => {
      expect(definePartialFnOnClass(A, f).asPartialFunctionOn<unknown>()(x)).toEqual(O.none);
    });
  });
});

export {};
