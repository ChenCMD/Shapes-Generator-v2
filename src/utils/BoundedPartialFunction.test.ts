import { definePartialFnOnClass } from './BoundedPartialFunction';
import * as O from 'fp-ts/Option';

class A {
  readonly param: number;
  constructor(param: number) {
    this.param = param;
  }
}

describe('Partial functions constructed by definePartialFnOnClass', () => {
  const testFunctions: ((x: A) => A)[] = [
    x => x,
    x => new A(x.param * x.param),
    x => new A(2 * x.param),
    x => new A(-x.param),
  ];

  it('must behave as the provided function when given an instance of the class', () => {
    const inputs: A[] = [1, 10, -1, -100].map(n => new A(n));

    for (const f of testFunctions) {
      for (const param of inputs) {
        const partialFunction = definePartialFnOnClass(A, f);

        expect(partialFunction.canBeAppliedTo(param)).toEqual(true);
        expect(partialFunction.convert(param)).toEqual(f(param));
        expect(partialFunction.convertIfApplicable(param)).toEqual(O.some(f(param)));
      }
    }
  });

  it('must return Option.None when given non-instance of the class', () => {
    const nonAValues: unknown[] = [1, 0.1, '', null, undefined, ({})];

    for (const f of testFunctions) {
      for (const nonAValue of nonAValues) {
        const partialFunction = definePartialFnOnClass(A, f);

        expect(partialFunction.canBeAppliedTo(nonAValue)).toEqual(false);
        expect(partialFunction.convertIfApplicable(nonAValue)).toEqual(O.none);
      }
    }
  });
});

export {};
