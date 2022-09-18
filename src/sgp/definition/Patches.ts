import { PartialEndoFunction } from '../../utils/BoundedPartialFunction';
import { ParameterizedClassPatch } from '../../utils/ClassPatch';
import { Modifier } from './Modifier';
import { ShapeParameters, ShapeWithUnknownParameter, upcastToUnkownParameterShape } from './Shape';
import * as O from 'fp-ts/Option';

export type ShapePatch = PartialEndoFunction<ShapeWithUnknownParameter>;

export const shapePatchForKind = <Kind extends ShapeParameters['__parameterKind']>(kind: Kind) =>
  (patch: Partial<ShapeParameters> & { __parameterKind: Kind }): ShapePatch =>
    unknownShape => unknownShape.patternMatch(shape => {
      const oldParameter = shape.parameter;
      if (oldParameter.__parameterKind === kind) {
        const newParameter = Object.assign({}, oldParameter, patch);
        const patchedShape = { ...shape, parameter: newParameter };
        return O.some(upcastToUnkownParameterShape(patchedShape));
      } else {
        // patch is not applicable
        return O.none;
      }
    });

export type ModifierPatch = PartialEndoFunction<Modifier>;

export function modifierPatch<C extends Modifier, P>(parameterizedPatch: ParameterizedClassPatch<C, P>): (patchParams: Partial<P>) => ModifierPatch {
  return p => parameterizedPatch(p).asPartialFunctionOn<Modifier>();
}
