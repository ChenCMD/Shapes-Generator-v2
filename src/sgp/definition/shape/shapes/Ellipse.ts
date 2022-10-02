import { shapePatchForKind } from '../../Patches';
import { ParameterizedShape } from '../ParameterizedShape';
import { SOPMWith } from '../../SOPM/ShapeObjectPropertyMap';
import { sopmSchemeWith } from '../../SOPM/SOPMScheme';
import { Vector2D, NormalizedVector2D } from '../../../../util/types/Vector2D';
import { ParameterizedPoint, sampleDensely } from '../../../../util/math';
import {
  ParticlePoint,
  AngledVertex,
  visibility
} from '../../SOPM/ShapeObjectProperty';

export type EllipseParameters = {
  readonly __parameterKind: 'Ellipse';
  readonly pointCount: number;
  readonly semiMajorAxis: number;
  readonly minorMajorAxesRatio: number;
  readonly startAngleInRadian: number;
  readonly spreadPointsEvenly: boolean;
};

export const defaultEllipseParameters: EllipseParameters = {
  __parameterKind: 'Ellipse',
  pointCount: 12,
  semiMajorAxis: 1,
  minorMajorAxesRatio: 1,
  startAngleInRadian: 0,
  spreadPointsEvenly: true
};

type EllipseSOPM = SOPMWith<true, false>;

export const Ellipse = (
  parameter: EllipseParameters
): ParameterizedShape<EllipseParameters, EllipseSOPM> => ({
  outputSpec: sopmSchemeWith(true, false),
  parameter,
  run: (p: EllipseParameters) => {
    const semiMinorAxis = p.semiMajorAxis * p.minorMajorAxesRatio;

    // 楕円の媒介変数表示 (0 ≤ t ≤ 1)。
    // semiMajorAxis と minorMajorAxesRatio によってサイズが決まり、
    // startAngleInRadian によって、点の角度にオフセットが掛かる。
    const parameterizedCurve = (t: number): Vector2D => {
      const angle = t * 2 * Math.PI + p.startAngleInRadian;

      return {
        x: p.semiMajorAxis * Math.cos(angle),
        y: semiMinorAxis * Math.sin(angle)
      };
    };

    // parameterizedCurve の像の点における、外向きの法線ベクトル
    const outwardNormalAt = (pointOnEllipse: Vector2D): NormalizedVector2D => {
      throw new Error('not implemented');
    };

    const pointsOnEllipse: Vector2D[] = (() => {
      const sampledPathNodes = sampleDensely(parameterizedCurve);
    })();

    const particlePoints: ParticlePoint[] = pointsOnEllipse.map((point) => ({
      __type: 'ParticlePoint',
      point,
      velocity: { x: 0, y: 0 }
    }));

    const angledVertices: AngledVertex[] = pointsOnEllipse.map((point) => ({
      __type: 'AngledVertex',
      point,
      direction: outwardNormalAt(point)
    }));

    return {
      particlePoints,
      angledVertices,
      visibility: visibility(true),
      directedEndpoints: null
    };
  }
});

export const EllipsePatch = shapePatchForKind('Ellipse');
