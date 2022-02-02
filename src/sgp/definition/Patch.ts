import { Modifier } from './Modifier';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import * as O from 'fp-ts/Option';

abstract class Patch<Bound, TargetType extends Bound> {
  abstract canBeAppliedTo(x: Bound): x is TargetType;
  abstract patch(x: TargetType): TargetType;

  refineAndPatch(x: Bound): O.Option<TargetType> {
    return this.canBeAppliedTo(x) ? O.some(this.patch(x)) : O.none;
  }
}

export abstract class ShapePatch<Target extends Shape<SOPM>>
  extends Patch<Shape<SOPM>, Target> {}

export abstract class ModifierPatch<Target extends Modifier>
  extends Patch<Modifier, Target> {}
