/**
 * {@link T}を、{@link T}が
 *  - `null` なら `false`
 *  - nullable なら `boolean`
 *  - そうでなければ `true`
 *
 * へ送る型関数。
 */
export type ProjectNullabilityToBool<T> = null extends T
  ? T extends null
    ? false
    : boolean
  : true;

/**
 * {@link T}を、{@link B}が
 *  - `true` なら {@link T}
 *  - `false` なら `null`
 *  - `boolean` なら `T | null`
 *
 * へ送る型関数。
 */
export type LiftBoolToNullability<B extends boolean, T> = B extends true
  ? T
  : B extends false
  ? null
  : T | null;
