import * as O from 'fp-ts/Option';

export type Vector2D = {
  readonly x: number;
  readonly y: number;
};

export const newVector2D = (x: number, y: number): Vector2D => ({ x, y });

export const plus = (v: Vector2D, w: Vector2D): Vector2D => ({
  x: v.x + w.x,
  y: v.y + w.y
});

export const mult = (l: number, v: Vector2D): Vector2D => ({
  x: l * v.x,
  y: l * v.y
});

export const minus = (v: Vector2D, w: Vector2D): Vector2D => ({
  x: v.x - w.x,
  y: v.y - w.y
});

export const normSquared = (v: Vector2D): number => v.x * v.x + v.y * v.y;

export const norm = (v: Vector2D): number => Math.sqrt(normSquared(v));

export type NonZeroVector2D = Vector2D & {
  readonly __tag_nonzero_vector_2d: unique symbol;
};

export const checkNonZero = (v: Vector2D): v is NonZeroVector2D =>
  v.x !== 0.0 || v.y !== 0.0;

export type NormalizedVector2D = Vector2D & {
  readonly __tag_normalized_vector_2d: unique symbol;
};

export const normalize = (v: NonZeroVector2D): NormalizedVector2D => {
  const vNorm = norm(v);
  if (vNorm === 0.0) throw new Error('unreachable');
  return mult(1 / vNorm, v) as NormalizedVector2D;
};
