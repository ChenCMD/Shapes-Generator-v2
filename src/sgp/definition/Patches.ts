import * as O from 'fp-ts/Option';
import { ShapeParameters } from './shape/ParameterSet';
import { ModifierParameterSet } from './modifier/ParameterSet';
import { Modifier, upcast as upcastModifier } from './modifier/Modifier';
import { Shape, upcast as upcastShape } from './shape/Shape';

type Patch<Target> = (target: Target) => O.Option<Target>;

export type ShapePatch = Patch<Shape>;

export const shapePatchForKind =
  <Kind extends ShapeParameters['__parameterKind']>(kind: Kind) =>
  (patch: Partial<ShapeParameters> & { __parameterKind: Kind }): ShapePatch =>
  (unknownModifier) =>
    unknownModifier.patternMatch((modifier) => {
      const oldParameter = modifier.parameter;
      if (oldParameter.__parameterKind === kind) {
        const newParameter = { ...oldParameter, ...patch };
        const patchedShape = { ...modifier, parameter: newParameter };
        return O.some(upcastShape(patchedShape));
      } else {
        // patch is not applicable
        return O.none;
      }
    });

export type ModifierPatch = Patch<Modifier>;

export const modifierPatchForKind =
  <Kind extends ModifierParameterSet['__parameterKind']>(kind: Kind) =>
  (
    patch: Partial<ModifierParameterSet> & { __parameterKind: Kind }
  ): ModifierPatch =>
  (unknownModifier) =>
    unknownModifier.patternMatch((modifier) => {
      const oldParameter = modifier.parameters;
      if (oldParameter.__parameterKind === kind) {
        const newParameter = { ...oldParameter, ...patch };
        const patchedShape = { ...modifier, parameter: newParameter };
        return O.some(upcastModifier(patchedShape));
      } else {
        // patch is not applicable
        return O.none;
      }
    });
