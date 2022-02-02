import * as O from 'fp-ts/Option';

/**
 * `T` に関して存在量化された {@link BoundedPartialFunction}。
 */
export interface SomeBoundedPartialFunction<Bound> {
  foldDomain<R>(f: <TargetType extends Bound>(patch: BPartialFn<Bound, TargetType>) => R): R
}

export type SomeBPFn<B> = SomeBoundedPartialFunction<B>;

/**
 * {@link Bound} の部分型である {@link T} 上に閉じた関数。
 * 
 * {@link Bound} に関して反変性を持つ。すなわち、`A extends B` のとき、
 * `BPartialFn<B, T> extends BPartialFn<A, T>` が成り立つ。
 */
export abstract class BoundedPartialFunction<Bound, T extends Bound> implements SomeBPFn<Bound> {
  abstract canBeAppliedTo(x: Bound): x is T;
  abstract convert(x: T): T;

  readonly convertIfApplicable = (x: Bound): O.Option<T> =>
    this.canBeAppliedTo(x) ? O.some(this.convert(x)) : O.none;
  
  readonly foldDomain = <R>(f: <TT extends Bound>(patch: BoundedPartialFunction<Bound, TT>) => R): R =>
    f<T>(this);
}

export type BPartialFn<B, T extends B> = BoundedPartialFunction<B, T>;

/**
 * {@link T} のコンストラクタの型
 */
type Constructor<T> = new (...args: never[]) => T;

/**
 * クラス{@link T}上の関数を{@link BoundedPartialFunction}として扱えるようにする関数。
 */
export const definePartialFnOnClass = <T>(clazz: Constructor<T>, f: (x: T) => T): BoundedPartialFunction<unknown, T> =>
  new class extends BoundedPartialFunction<unknown, T> {
    canBeAppliedTo(x: unknown): x is T {
      return x instanceof clazz;
    }
    convert: (x: T) => T = f;
  }();
