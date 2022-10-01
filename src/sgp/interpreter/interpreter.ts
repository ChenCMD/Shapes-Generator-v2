/**
 * SGPを展開する。
 */
export { expandDiff } from './phases/diff-expansion';

/**
 * 展開済みのSGPを型チェックする
 */
export { typeCheckModifiers } from './phases/typecheck';

/**
 * 型チェック済みのSGPを実行する。
 */
export { evaluate } from './phases/evaluate';
