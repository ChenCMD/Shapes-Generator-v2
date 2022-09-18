export interface Point {
    x: number
    y: number
}

export function calcPoint(point: Point, calc: (p: number) => number): Point;
export function calcPoint(a: Point, b: Point, calc: (ap: number, bp: number) => number): Point;
export function calcPoint(a: Point, b: Point, c: Point, calc: (ap: number, bp: number, cp: number) => number): Point;
export function calcPoint(a: Point, b: Point | ((ap: number) => number), c?: Point | ((ap: number, bp: number) => number), calc?: (ap: number, bp: number, cp: number) => number): Point {
    if (typeof b === 'function') {
        return { x: b(a.x), y: b(a.y) };
    }
    if (typeof c === 'function') {
        return { x: c(a.x, b.x), y: c(a.y, b.y) };
    }
    if (c && typeof calc === 'function') {
        return { x: calc(a.x, b.x, c.x), y: calc(a.y, b.y, c.y) };
    }
    return { x: 0, y: 0 };
}