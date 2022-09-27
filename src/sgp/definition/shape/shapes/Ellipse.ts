import { shapePatchForKind } from '../../Patches';
import { ParameterizedShape } from '../ParameterizedShape';
import { SOPMWith } from '../../SOPM/ShapeObjectPropertyMap';
import { sopmSchemeWith } from '../../SOPM/SOPMScheme';
import { Vector2D } from '../../../../util/types/Vector2D';

export type EllipseParameters = {
  readonly __parameterKind: 'Ellipse';
  readonly pointCount: number;
  readonly center: Vector2D;
  readonly semiMajorAxis: number;
  readonly startAngle: number;
  readonly eccentricity: number;
  readonly rotation: number;
  readonly spreadPointsEvenly: boolean;
};

type EllipseSOPM = SOPMWith<true, false>;

export const Ellipse = (
  parameter: EllipseParameters
): ParameterizedShape<EllipseParameters, EllipseSOPM> => ({
  outputSpec: sopmSchemeWith(true, false),
  parameter,
  run: (p: EllipseParameters) => {
    throw new Error('Method not implemented.');
  }
});

export const EllipsePatch = shapePatchForKind('Ellipse');
