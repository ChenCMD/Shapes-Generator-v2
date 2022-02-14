import * as O from 'fp-ts/Option';

export type PartialEndoFunction<X> = (x: X) => O.Option<X>;

/**
 * {@link Bound} の部分型である {@link T} 上に閉じた関数。
 * 
 * {@link Bound} に関して反変性を持つ。すなわち、`A extends B` のとき、
 * `BPartialFn<B, T> extends BPartialFn<A, T>` が成り立つ。
 */
export abstract class BoundedPartialFunction<Bound, T extends Bound> {
  /**
   * 与えられた値が {@link T} に適合するか判別する。
   */
  abstract canBeAppliedTo(x: Bound): x is T;

  /**
   * {@link T}の値を変換する。
   */
  abstract convert(x: T): T;

  /**
   * このオブジェクトを `(x: T | B) => Option<T | B>` の関数とみなす。
   */
  readonly asPartialFunctionOn = <B extends Bound>(): PartialEndoFunction<T | B> =>
    x => this.canBeAppliedTo(x) ? O.some(this.convert(x)) : O.none;
}

export type BPFn<B, T extends B> = BoundedPartialFunction<B, T>;

/**
 * {@link T} のコンストラクタの型
 */
type Constructor<T> = new (...args: never[]) => T;

/**
 * クラス{@link T}上の関数を{@link BPFn}として扱えるようにする関数。
 * 
 * @param clazz
 *    {@link T} のコンストラクタ。コンストラクタ以外の値が渡された場合、
 *    契約を満たさない{@link BPFn}が得られる可能性がある。
 */
export const definePartialFnOnClass = <T>(clazz: Constructor<T>, f: (x: T) => T): BPFn<unknown, T> =>
  new class extends BoundedPartialFunction<unknown, T> {
    canBeAppliedTo(x: unknown): x is T {
      return x instanceof clazz;
    }
    convert: (x: T) => T = f;
  }();
