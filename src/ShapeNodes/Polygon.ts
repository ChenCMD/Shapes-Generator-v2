import rfdc from 'rfdc';
import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { NormalParameter, Param, ParamMetaData, ParamValue } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { mod, rotateMatrix2D, toRadians } from '../utils/common';
import { CircleParams } from './Circle';

export interface PolygonParams extends CircleParams {
    corner: NormalParameter
    jump: NormalParameter
    vezier: NormalParameter
}

const paramMetaData: ParamMetaData<PolygonParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    center: { type: 'pos', unit: '' },
    radius: { unit: 'm', validation: { min: 0.0001 } },
    start: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    ellipse: { type: 'range', unit: 'unit.per', min: 0, max: 100, step: 1 },
    rotate: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    corner: { validation: { min: 1 } },
    jump: {},
    vezier: {}
};

const defaultParams: ParamValue<PolygonParams> = {
    count: 20,
    center: { x: 0, y: 0 },
    radius: 5,
    start: 0,
    ellipse: 100,
    rotate: 0,
    corner: 5,
    jump: 1,
    vezier: 0
};

export class PolygonShape extends AbstractShapeNode<PolygonParams, keyof PolygonParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = rfdc()(defaultParams)) {
        super('polygon', paramMetaData, name, params as ParamValue<PolygonParams>);
    }

    protected generatePointSet(params: ParamValue<PolygonParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        const drawLine = (from: Point, to: Point) => {
            const calcPoint = (fromPos: Point, toPos: Point, t: number): Point => [
                (1 - t) * fromPos[0] + t * toPos[0],
                (1 - t) * fromPos[1] + t * toPos[1]
            ];
            const vector = [to[0] - from[0], to[1] - from[1]];
            const vecMagnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
            const normalizedVector = [vector[1] / vecMagnitude * params.vezier, -vector[0] / vecMagnitude * params.vezier];

            const controlPoint: Point = [(from[0] + to[0]) / 2 + normalizedVector[0], (from[1] + to[1]) / 2 + normalizedVector[1]];
            for (let i = 0; i < params.count; i++) {
                const t = i / params.count;
                addPoint(calcPoint(calcPoint(from, controlPoint, t), calcPoint(controlPoint, to, t), t));
            }
        };

        const corners: Point[] = [];
        for (let i = 0; i < params.corner; i++) {
            const theta = toRadians(360 / params.corner * i + params.start);
            const p: Point = rotateMatrix2D([
                params.center.x + Math.sin(theta) * params.radius,
                params.center.y + -Math.cos(theta) * params.radius
            ], params.rotate);
            corners.push(rotateMatrix2D([p[0], p[1] * (params.ellipse / 100)], -params.rotate));
        }
        for (const [i, corner] of corners.entries()) drawLine(corner, corners[mod(i + params.jump, corners.length)]);

        return points;
    }

    public clone(): PolygonShape {
        return new PolygonShape(`${this.name}-copy`, rfdc()(this.params));
    }
}