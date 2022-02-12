import { SomeBPFn } from '../../utils/BoundedPartialFunction';
import { Modifier } from './Modifier';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';

export type SomeShapePatch = SomeBPFn<Shape<SOPM>>;
export type SomeModifierPatch = SomeBPFn<Modifier>;
