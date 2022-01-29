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

export type SOPMSchemeWith<
  AngledVerticesPresence extends boolean,
  DirectedEndpointsPresence extends boolean
> = SOPMScheme & {
  readonly angledVertices: AngledVerticesPresence
  readonly directedEndpoints: DirectedEndpointsPresence
};

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
