import { definePartialFnOnClass } from './BoundedPartialFunction';
import * as O from 'fp-ts/Option';

class A {
  readonly param: number;
  constructor(param: number) {
    this.param = param;
  }
}

describe('Partial functions constructed by definePartialFnOnClass', () => {
  type EndoFunction<X> = (x: X) => X;

  const testFunctions: ReadonlyArray<EndoFunction<A>> = [
    x => x,
    x => new A(x.param * x.param),
    x => new A(2 * x.param),
    x => new A(-x.param),
  ];
  const acceptableInputs: A[] = [1, 10, -1, -100].map(n => new A(n));
  const unacceptableInputs: unknown[] = [1, 0.1, '', null, undefined, ({})];

  describe('when given an instance of the class', () => {
    type TestCase = [EndoFunction<A>, A];
    const testCases: ReadonlyArray<TestCase> =
      testFunctions.flatMap(f => acceptableInputs.map(a => [f, a] as TestCase));

    it.each(testCases)('must accept the input', (f, a) => {
      expect(definePartialFnOnClass(A, f).canBeAppliedTo(a)).toEqual(true);
    });

    it.each(testCases)('must convert according to the underlying function', (f, a) => {
      expect(definePartialFnOnClass(A, f).convert(a)).toEqual(f(a));
    });

    it.each(testCases)('must convertIfApplicable according to the underlying function', (f, a) => {
      expect(definePartialFnOnClass(A, f).convertIfApplicable(a)).toEqual(O.some(f(a)));
    });
  });

  describe('when given non-instance of the class', () => {
    type TestCase = [EndoFunction<A>, unknown];
    const testCases: ReadonlyArray<TestCase> =
      testFunctions.flatMap(f => unacceptableInputs.map(a => [f, a] as TestCase));

    it.each(testCases)('must not accept the input', (f, x) => {
      expect(definePartialFnOnClass(A, f).canBeAppliedTo(x)).toEqual(false);
    });

    it.each(testCases)('must emit Option.none on convertIfApplicable', (f, x) => {
      expect(definePartialFnOnClass(A, f).convertIfApplicable(x)).toEqual(O.none);
    });
  });
});

export {};
