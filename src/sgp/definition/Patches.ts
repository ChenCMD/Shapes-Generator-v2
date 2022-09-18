import { ModifierWithUnknownParameter, upcastToUnkownParameterModifier } from './modifier/Modifier';
import { ShapeWithUnknownParameter, upcastToUnkownParameterShape } from './shape/Shape';
import * as O from 'fp-ts/Option';
import { ShapeParameters } from './shape/ParameterSet';
import { ModifierParameterSet } from './modifier/ParameterSet';

type Patch<Target> = (target: Target) => O.Option<Target>;

export type ShapePatch = Patch<ShapeWithUnknownParameter>;

export const shapePatchForKind = <Kind extends ShapeParameters['__parameterKind']>(kind: Kind) =>
  (patch: Partial<ShapeParameters> & { __parameterKind: Kind }): ShapePatch =>
    unknownModifier => unknownModifier.patternMatch(modifier => {
      const oldParameter = modifier.parameter;
      if (oldParameter.__parameterKind === kind) {
        const newParameter = Object.assign({}, oldParameter, patch);
        const patchedShape = { ...modifier, parameter: newParameter };
        return O.some(upcastToUnkownParameterShape(patchedShape));
      } else {
        // patch is not applicable
        return O.none;
      }
    });

export type ModifierPatch = Patch<ModifierWithUnknownParameter>;

export const modifierPatchForKind = <Kind extends ModifierParameterSet['__parameterKind']>(kind: Kind) =>
  (patch: Partial<ModifierParameterSet> & { __parameterKind: Kind }): ModifierPatch =>
    unknownModifier => unknownModifier.patternMatch(modifier => {
      const oldParameter = modifier.parameters;
      if (oldParameter.__parameterKind === kind) {
        const newParameter = Object.assign({}, oldParameter, patch);
        const patchedShape = { ...modifier, parameter: newParameter };
        return O.some(upcastToUnkownParameterModifier(patchedShape));
      } else {
        // patch is not applicable
        return O.none;
      }
    });
