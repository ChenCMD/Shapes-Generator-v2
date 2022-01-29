import { ProjectNullabilityToBool } from '../../utils/bool-to-nullability';
import { SOPM } from './ShapeObjectPropertyMap';

/**
 * {@link SOPM} の各フィールドの型に
 * {@link ProjectNullabilityToBool} を適用したもの。
 * 
 * FIXME: ShapeObject / Modifierパイプラインの「型付け」にこれが利用されていることをここに書け。
 */
export type SOPMScheme = {
  readonly [P in keyof SOPM]: ProjectNullabilityToBool<SOPM[P]>;
};

/**
 * {@link SOPMScheme} のうち、より具体的な {@link SOPM} に対して
 * {@link ProjectNullabilityToBool} が適用されたもの。
 * 
 * この型の値は、主に{@link ShapeObject}の実装の内部的な整合性を取るのに用いられる。
 */
export type DetailedSOPMScheme<M extends SOPM> = SOPMScheme & {
  readonly [P in keyof M]: ProjectNullabilityToBool<M[P]>;
};

type SOPMSchemeWith<
  AngledVerticesPresence extends boolean,
  DirectedEndpointsPresence extends boolean
> = SOPMScheme & {
  readonly angledVertices: AngledVerticesPresence
  readonly directedEndpoints: DirectedEndpointsPresence
};

/**
 * {@link SOPMScheme} の値を簡単に生成するための関数。
 * 引数はそれぞれどのフィールドの存在を予期するかを表す。
 * 
 * この関数は、引数にリテラルを渡すことで返り値の型({@link SOPMScheme}の部分型)
 * がより具体的になるように型宣言されている。
 */
export const sopmSchemeWith = <
  AngledVerticesPresence extends boolean,
  DirectedEndpointsPresence extends boolean
>(angledVerticesPresence: AngledVerticesPresence,
  directedEndpointsPresence: DirectedEndpointsPresence): SOPMSchemeWith<AngledVerticesPresence, DirectedEndpointsPresence> => ({
    particlePoints: true,
    visibility: true,
    angledVertices: angledVerticesPresence,
    directedEndpoints: directedEndpointsPresence,
  });
