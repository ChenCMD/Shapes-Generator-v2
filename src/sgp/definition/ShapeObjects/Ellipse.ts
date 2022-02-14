import { Vector2D } from '../../../types/Vector2D';
import { patchForUnaryClass } from '../../../utils/ClassPatch';
import { Shape } from '../Shape';
import { SOPMWith } from '../SOPM/ShapeObjectPropertyMap';
import { DetailedSOPMScheme, sopmSchemeWith } from '../SOPM/SOPMScheme';
import { shapePatch } from '../Patches';

type EllipseSOPM = SOPMWith<true, false>;
export type EllipseParameters = {
  readonly pointCount: number;
  readonly center: Vector2D;
  readonly semiMajorAxis: number;
  readonly startAngle: number;
  readonly eccentricity: number;
  readonly rotation: number;
  readonly spreadPointsEvenly: boolean;
};

export class Ellipse implements Shape<EllipseSOPM> {
  readonly outputSpec: DetailedSOPMScheme<EllipseSOPM> = sopmSchemeWith(true, false);
  readonly params: EllipseParameters;
  constructor(params: EllipseParameters) {
    this.params = params;
  }

  run(): EllipseSOPM {
    throw new Error('Method not implemented.');
  }
}

export const EllipsePatch = shapePatch(patchForUnaryClass(Ellipse, t => t.params));
