import { Modifier } from './Modifier';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import { BoundedPartialFunction, SomeBPFn } from '../../utils/BoundedPartialFunction';

export abstract class ShapePatch<Target extends Shape<SOPM>>
  extends BoundedPartialFunction<Shape<SOPM>, Target> {}

export type SomeShapePatch = SomeBPFn<Shape<SOPM>>;

export abstract class ModifierPatch<Target extends Modifier>
  extends BoundedPartialFunction<Modifier, Target> {}

export type SomeModifierPatch = SomeBPFn<Modifier>;
