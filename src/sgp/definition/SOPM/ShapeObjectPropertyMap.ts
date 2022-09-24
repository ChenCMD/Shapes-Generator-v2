import { LiftBoolToNullability } from '../../../utils/bool-to-nullability';
import {
  AngledVertex,
  DirectedEndpoints,
  ParticlePoint,
  Visibility
} from './ShapeObjectProperty';

/**
 * ShapesGeneratorProgram内の一つのShapeObjectDefinitionから得られる、その定義の実行結果。
 */
export interface ShapeObjectPropertyMap {
  readonly particlePoints: ReadonlyArray<ParticlePoint>;
  readonly visibility: Visibility;
  readonly angledVertices: ReadonlyArray<AngledVertex> | null;
  readonly directedEndpoints: DirectedEndpoints | null;
}

/**
 * {@link ShapeObjectPropertyMap}の略称
 */
export type SOPM = ShapeObjectPropertyMap;

/**
 * {@link SOPM}のより具体的な部分型を簡単に記述するための型関数
 */
export type SOPMWith<
  AngledVerticesPresence extends boolean,
  DirectedEndpointsPresence extends boolean
> = SOPM & {
  readonly angledVertices: LiftBoolToNullability<
    AngledVerticesPresence,
    ReadonlyArray<AngledVertex>
  >;
  readonly directedEndpoints: LiftBoolToNullability<
    DirectedEndpointsPresence,
    DirectedEndpoints
  >;
};
