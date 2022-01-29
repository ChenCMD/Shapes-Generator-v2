import { ShapeObject } from '../ShapeObject';
import { SOPMWith } from '../SOPM/ShapeObjectPropertyMap';
import { DetailedSOPMScheme, sopmSchemeWith } from '../SOPM/SOPMScheme';

type CircleSOPM = SOPMWith<true, false>;
export class Circle implements ShapeObject<CircleSOPM> {
  readonly outputSpec: DetailedSOPMScheme<CircleSOPM> = sopmSchemeWith(true, false);

  run(): CircleSOPM {
    throw new Error('Method not implemented.');
  }
}
