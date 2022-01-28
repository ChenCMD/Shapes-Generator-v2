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
 * 一つのShapeObjectDefinitionに対応する、ShapesGeneratorProgramの「実行結果」。
 */
export interface ShapeObjectPropertyMap {
  readonly particlePoints: ParticlePoint[]
  readonly visibility: Visibility
  readonly angledVertices?: AngledVertex[]
  readonly DirectedEndpoints?: DirectedEndpoints
}
