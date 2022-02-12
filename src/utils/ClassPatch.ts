import { BPFn, definePartialFnOnClass } from './BoundedPartialFunction';

type UnaryConstructor<T, P> = new (param: P) => T;

export type ParameterizedClassPatch<T, P> = (paramPatch: Partial<P>) => BPFn<unknown, T>;

/**
 * {@link P} のみをコンストラクタパラメータに持つような
 * クラス {@link C} に対してパッチを行うための {@link ParameterizedClassPatch} を作成する。
 * 
 * {@link constructor} と {@link extractParameter} は互いに逆の操作である必要がある。
 * すなわち、
 *  - 任意の `p: P` について、 `p` と `extractParameter(new constructor(p))` は等価
 *  - 任意の `i: C` について、 `i` と `new constructor(extractParameter(i))` は等価
 * 
 * であることが要求される。これはつまり、クラス `C` が `P` 以外の情報を持っていないものであることを要求する。
 */
export function patchForUnaryClass<C, P>(
  constructor: UnaryConstructor<C, P>, extractParameter: (t: C) => P
): ParameterizedClassPatch<C, P> {
  return (paramPatch: Partial<P>) => definePartialFnOnClass(
    constructor,
    (t: C) => {
      const currentParameter = extractParameter(t);
      const patchedParameter = Object.assign({}, currentParameter, paramPatch);
      return new constructor(patchedParameter);
    }
  );
}
