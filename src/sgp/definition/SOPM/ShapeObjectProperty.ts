import { Vector2D } from '../../../types/Vector2D';

export interface ParticlePoint {
  readonly __type: 'ParticlePoint'
  readonly point: Vector2D
  readonly velocity: Vector2D
}

export interface Visibility {
  readonly __type: 'Visibility'
  readonly visibility: boolean
}

export interface AngledVertex {
  readonly __type: 'AngledVertices'
  readonly point: Vector2D
  /** 単位ベクトル */
  readonly direction: Vector2D
}

export interface DirectedEndpoints {
  readonly __type: 'Endpoints'
  readonly startPoint: Vector2D
  readonly endPoint: Vector2D
}
