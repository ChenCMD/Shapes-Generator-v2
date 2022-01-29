import { SOPM } from './ShapeObjectPropertyMap';

/**
 * {@link T} を、Tが
 *  - `null` なら `false`
 *  - nullable なら `boolean`
 *  - そうでなければ `true`
 * 
 * へ送る型関数。
 */
type ProjectNullability<T> =
  null extends T
    ? (T extends null ? false : boolean)
    : true;

/**
 * {@link SOPM} の各フィールドの型に {@link ProjectNullability} を適用したもの。
 * 
 * FIXME: ShapeObject / Modifierパイプラインの「型付け」にこれが利用されていることをここに書け。
 */
export type SOPMScheme = {
  readonly [P in keyof SOPM]: ProjectNullability<SOPM[P]>;
};

/**
 * {@link SOPMScheme} のうち、より具体的な {@link SOPM} に対して {@link ProjectNullability} が適用されたもの。
 * 
 * この型の値は、主に{@link ShapeObject}の実装の内部的な整合性を取るのに用いられる。
 */
export type DetailedSOPMScheme<M extends SOPM> = SOPMScheme & {
  readonly [P in keyof M]: ProjectNullability<M[P]>;
};
