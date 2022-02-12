import * as O from 'fp-ts/Option';

/**
 * `T` に関して存在量化された {@link BoundedPartialFunction}。
 */
export abstract class SomeBoundedPartialFunction<Bound> {
  abstract foldDomain<R>(f: <TargetType extends Bound>(patch: BPFn<Bound, TargetType>) => R): R;

  /**
   * このオブジェクトを {@link Bound} 上の部分関数として扱う。
   */
  readonly asPartialFunctionOnBound: (x: Bound) => O.Option<Bound> = x =>
    this.foldDomain<O.Option<Bound>>(<TargetType extends Bound>(patch: BPFn<Bound, TargetType>) =>
      patch.convertIfApplicable(x)
    );
}

export type SomeBPFn<B> = SomeBoundedPartialFunction<B>;

/**
 * {@link Bound} の部分型である {@link T} 上に閉じた関数。
 * 
 * {@link Bound} に関して反変性を持つ。すなわち、`A extends B` のとき、
 * `BPartialFn<B, T> extends BPartialFn<A, T>` が成り立つ。
 */
export abstract class BoundedPartialFunction<Bound, T extends Bound> extends SomeBoundedPartialFunction<Bound> {
  abstract canBeAppliedTo(x: Bound): x is T;
  abstract convert(x: T): T;

  readonly convertIfApplicable = (x: Bound): O.Option<T> =>
    this.canBeAppliedTo(x) ? O.some(this.convert(x)) : O.none;
  
  override readonly foldDomain = <R>(f: <TT extends Bound>(patch: BPFn<Bound, TT>) => R): R =>
    f<T>(this);
}

export type BPFn<B, T extends B> = BoundedPartialFunction<B, T>;

/**
 * {@link T} のコンストラクタの型
 */
type Constructor<T> = new (...args: never[]) => T;

/**
 * クラス{@link T}上の関数を{@link BoundedPartialFunction}として扱えるようにする関数。
 */
export const definePartialFnOnClass = <T>(clazz: Constructor<T>, f: (x: T) => T): BPFn<unknown, T> =>
  new class extends BoundedPartialFunction<unknown, T> {
    canBeAppliedTo(x: unknown): x is T {
      return x instanceof clazz;
    }
    convert: (x: T) => T = f;
  }();
