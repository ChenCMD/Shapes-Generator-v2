export interface Vector2D {
  readonly x: number;
  readonly y: number;
}

export const newVector2D = (x: number, y: number): Vector2D => ({ x, y });

export const plus = (v: Vector2D, w: Vector2D): Vector2D => ({
  x: v.x + w.x,
  y: v.y + w.y
});

export const mult = (l: number, v: Vector2D): Vector2D => ({
  x: l * v.x,
  y: l * v.y
});
