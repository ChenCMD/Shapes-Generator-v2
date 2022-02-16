import { patchForUnaryClass } from './ClassPatch';

type Parameter = {
  x: number;
  y: string | undefined;
};

class A {
  readonly param: Parameter;
  constructor(param: Parameter) {
    this.param = param;
  }
}

describe('patchForUnaryClass', () => {
  type PatchParam = Partial<Parameter>;

  it.each<[Parameter, PatchParam, Parameter]>([
    [{ x: 1.0, y: undefined }, { y: 'c' }, { x: 1.0, y: 'c' }],
    [{ x: 1.0, y: undefined }, ({}), { x: 1.0, y: undefined }],
    [{ x: 1.0, y: 'b' }, { x: 2.0 }, { x: 2.0, y: 'b' }],
    [{ x: 1.0, y: 'b' }, { x: 2.0, y: 'c' }, { x: 2.0, y: 'c' }],
  ])(
    'should patch instance with %o with %o, and output an instance with parameter %o',
    (input, patchParam, output) => {
      const patch = patchForUnaryClass(A, t => t.param)(patchParam);
      expect(patch.convert(new A(input)).param).toEqual(output);
    }
  );
});

export {};
