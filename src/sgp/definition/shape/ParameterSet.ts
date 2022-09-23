import { EllipseParameters } from './shapes/Ellipse';

export type ShapeParameters =
  | EllipseParameters
  | { readonly __parameterKind: never };
