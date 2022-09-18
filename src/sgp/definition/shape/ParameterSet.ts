import { EllipseParameters } from './shapes/Ellipse';

export type ShapeParameters = EllipseParameters | { __parameterKind: never };
