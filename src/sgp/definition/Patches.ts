import { PartialEndoFunction } from '../../utils/BoundedPartialFunction';
import { ParameterizedClassPatch } from '../../utils/ClassPatch';
import { Modifier } from './Modifier';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';

export type ShapePatch = PartialEndoFunction<Shape<SOPM>>;

export function shapePatch<C extends Shape<SOPM>, P>(parameterizedPatch: ParameterizedClassPatch<C, P>): (patchParams: Partial<P>) => ShapePatch {
  return p => parameterizedPatch(p).asPartialFunctionOn<Shape<SOPM>>();
}

export type ModifierPatch = PartialEndoFunction<Modifier>;

export function modifierPatch<C extends Modifier, P>(parameterizedPatch: ParameterizedClassPatch<C, P>): (patchParams: Partial<P>) => ModifierPatch {
  return p => parameterizedPatch(p).asPartialFunctionOn<Modifier>();
}
