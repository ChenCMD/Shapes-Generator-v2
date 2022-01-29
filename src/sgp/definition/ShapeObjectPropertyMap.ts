import { Vector2D } from '../../types/Vector2D';

export interface ParticlePoint {
  __type: 'ParticlePoint'
  point: Vector2D
  velocity: Vector2D
}

export interface Visibility {
  __type: 'Visibility'
  visibility: boolean
}

export interface AngledVertex {
  __type: 'AngledVertices'
  point: Vector2D
  /** 単位ベクトル */
  direction: Vector2D
}

export interface DirectedEndpoints {
  __type: 'Endpoints'
  startPoint: Vector2D
  endPoint: Vector2D
}

/**
 * ShapesGeneratorProgram内の一つのShapeObjectDefinitionから得られる、その定義の実行結果。
 */
export interface ShapeObjectPropertyMap {
  readonly particlePoints: ParticlePoint[];
  readonly visibility: Visibility;
  readonly angledVertices: AngledVertex[] | null;
  readonly directedEndpoints: DirectedEndpoints | null;
}

/**
 * {@link ShapeObjectPropertyMap}の略称
 */
export type SOPM = ShapeObjectPropertyMap;
