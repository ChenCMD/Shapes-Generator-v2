import { AngledVertex, DirectedEndpoints, ParticlePoint, SOPM, Visibility } from './ShapeObjectPropertyMap';

/**
 * `SOPM` のフィールドに現れる型に対応する文字列。
 * 
 * この型関数は、一意な文字列を割り当てなければならない。つまり、 `SOPM` の二つのフィールド
 *  - `field1: Type1`
 *  - `field2: Type2`
 * があった時、`Type1` と `Type2` がTypeScriptの型として等しくないならば、
 * `SOPTypeTag<Type1>` と `SOPTypeTag<Type2>` が異なる必要がある。
 */
type SOPTypeTag<T> =
    T extends ParticlePoint[] ? 'ParticlePoint[]'
  : T extends Visibility ? 'Visibility'
  : T extends AngledVertex[] ? 'AngledVertex[]'
  : T extends DirectedEndpoints ? 'DirectedEndpoints'
  : undefined;

/**
 * {@link SOPM} の各フィールドの型に {@link SOPTypeTag} を適用したもの。
 * 
 * FIXME: ShapeObject / Modifierパイプラインの「型付け」にこれが利用されていることをここに書け。
 */
export type SOPMScheme = {
  readonly [P in keyof SOPM]: SOPTypeTag<SOPM[P]>;
};

/**
 * {@link SOPMScheme} のうち、より具体的な {@link SOPM} に対して {@link SOPTypeTag} が適用されたもの。
 * 
 * この型の値は、主に{@link ShapeObject}の実装の内部的な整合性を取るのに用いられる。
 */
export type DetailedSOPMScheme<M extends SOPM> = SOPMScheme & {
  readonly [P in keyof M]: SOPTypeTag<M[P]>;
};
