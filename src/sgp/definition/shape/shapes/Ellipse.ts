import { shapePatchForKind } from '../../Patches';
import { ParameterizedShape } from '../ParameterizedShape';
import { SOPMWith } from '../../SOPM/ShapeObjectPropertyMap';
import { sopmSchemeWith } from '../../SOPM/SOPMScheme';

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
    throw new Error('Method not implemented.');
  }
});

export const EllipsePatch = shapePatchForKind('Ellipse');
