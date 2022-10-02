import { Vector2D, NormalizedVector2D } from '../../../util/types/Vector2D';

export interface ParticlePoint {
  readonly __type: 'ParticlePoint';
  readonly point: Vector2D;
  readonly velocity: Vector2D;
}

export interface Visibility {
  readonly __type: 'Visibility';
  readonly visibility: boolean;
}
export const visibility = (b: boolean): Visibility => ({
  __type: 'Visibility',
  visibility: b
});

export interface AngledVertex {
  readonly __type: 'AngledVertex';
  readonly point: Vector2D;
  readonly direction: NormalizedVector2D;
}

export interface DirectedEndpoints {
  readonly __type: 'Endpoints';
  readonly startPoint: Vector2D;
  readonly endPoint: Vector2D;
}
