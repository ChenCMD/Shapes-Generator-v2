import { Vector2D } from '../../../types/Vector2D';
import { ShapeObjectPatch } from '../Patch';
import { ShapeObject } from '../ShapeObject';
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

export class Ellipse implements ShapeObject<EllipseSOPM> {
  readonly outputSpec: DetailedSOPMScheme<EllipseSOPM> = sopmSchemeWith(true, false);
  readonly params: EllipseParameters;
  constructor(params: EllipseParameters) {
    this.params = params;
  }

  run(): EllipseSOPM {
    throw new Error('Method not implemented.');
  }
}

export class EllipsePatch extends ShapeObjectPatch<Ellipse> {
  readonly patchParams: Partial<EllipseParameters>;
  constructor(patchParams: Partial<EllipseParameters>) {
    super();
    this.patchParams = patchParams;
  }

  canBeAppliedTo = (x: ShapeObject<ShapeObjectPropertyMap>): x is Ellipse => x instanceof Ellipse;
  patch = (x: Ellipse): Ellipse => new Ellipse(Object.assign({}, x.params, this.patchParams));
}
