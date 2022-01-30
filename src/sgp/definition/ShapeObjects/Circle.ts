import { Vector2D } from '../../../types/Vector2D';
import { ShapeObjectPatch } from '../Patch';
import { ShapeObject } from '../ShapeObject';
import { ShapeObjectPropertyMap, SOPMWith } from '../SOPM/ShapeObjectPropertyMap';
import { DetailedSOPMScheme, sopmSchemeWith } from '../SOPM/SOPMScheme';

type CircleSOPM = SOPMWith<true, false>;
type CircleParameters = {
  count: number;
  center: Vector2D;
  radius: number;
  startAngle: number;
  eccentricity: number;
  rotation: number;
  spreadPointsEvenly: boolean;
};

export class Circle implements ShapeObject<CircleSOPM> {
  readonly outputSpec: DetailedSOPMScheme<CircleSOPM> = sopmSchemeWith(true, false);
  readonly params: CircleParameters;
  constructor(params: CircleParameters) {
    this.params = params;
  }

  run(): CircleSOPM {
    throw new Error('Method not implemented.');
  }
}

export class CirclePatch extends ShapeObjectPatch<Circle> {
  readonly patchParams: Partial<CircleParameters>;
  constructor(patchParams: Partial<CircleParameters>) {
    super();
    this.patchParams = patchParams;
  }

  canBeAppliedTo = (x: ShapeObject<ShapeObjectPropertyMap>): x is Circle => x instanceof Circle;
  patch = (x: Circle): Circle => new Circle(Object.assign({}, x.params, this.patchParams));
}
