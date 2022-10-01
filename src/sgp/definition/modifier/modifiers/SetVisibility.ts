import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import {
  InsufficientSOPMFields,
  ParameterizedModifier
} from '../ParameterizedModifier';
import { ShapeObjectPropertyMap } from '../../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../../SOPM/SOPMScheme';
import { ShapeObjectsEvaluationResult } from '../../SGP';
import { modifierPatchForKind } from '../../Patches';
import { Visibility } from '../../SOPM/ShapeObjectProperty';

export type SetVisibilityParameters = {
  readonly __parameterKind: 'SetVisibility';
  readonly visibility: Visibility;
};

export const SetVisibilityModifier = (
  parameters: SetVisibilityParameters
): ParameterizedModifier<SetVisibilityParameters> => ({
  parameters,
  partialEvaluationResultRequirements: () => new Set(),
  outputSpec: (onInput: SOPMScheme) => E.right(onInput),

  run: (
    p: SetVisibilityParameters,
    _partialResult: ShapeObjectsEvaluationResult,
    input: ShapeObjectPropertyMap
  ) => O.some({ ...input, visibility: p.visibility })
});

export const SetVisibilityPatch = modifierPatchForKind('SetVisibility');
