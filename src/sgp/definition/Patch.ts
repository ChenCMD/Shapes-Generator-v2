import { Modifier } from './Modifier';
import { ShapeObject } from './ShapeObject';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import * as O from 'fp-ts/Option';

abstract class Patch<Bound, TargetType extends Bound> {
  abstract canBeAppliedTo(x: Bound): x is TargetType;
  abstract patch(x: TargetType): TargetType;

  refineAndPatch(x: TargetType): O.Option<TargetType> {
    return this.canBeAppliedTo(x) ? O.some(this.patch(x)) : O.none;
  }
}

export type ShapeObjectPatch<Target extends ShapeObject<SOPM>> = Patch<ShapeObject<SOPM>, Target>;

export type ModifierPatch<Target extends Modifier> = Patch<Modifier, Target>;
