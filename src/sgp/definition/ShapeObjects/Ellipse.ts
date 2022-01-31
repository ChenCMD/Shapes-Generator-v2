import { Vector2D } from '../../../types/Vector2D';
import { ShapePatch } from '../Patch';
import { Shape } from '../Shape';
import { ShapeObjectPropertyMap, SOPMWith } from '../SOPM/ShapeObjectPropertyMap';
import { DetailedSOPMScheme, sopmSchemeWith } from '../SOPM/SOPMScheme';

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

export class EllipsePatch extends ShapePatch<Ellipse> {
  readonly patchParams: Partial<EllipseParameters>;
  constructor(patchParams: Partial<EllipseParameters>) {
    super();
    this.patchParams = patchParams;
  }

  readonly canBeAppliedTo = (x: Shape<ShapeObjectPropertyMap>): x is Ellipse =>
    x instanceof Ellipse;
  readonly patch = (x: Ellipse): Ellipse =>
    new Ellipse(Object.assign({}, x.params, this.patchParams));
}
