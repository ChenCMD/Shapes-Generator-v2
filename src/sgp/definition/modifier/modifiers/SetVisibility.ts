import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { InsufficientSOPMFields, Modifier } from '../Modifier';
import { ShapeObjectPropertyMap } from '../../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../../SOPM/SOPMScheme';
import { SGPEvaluationResult } from '../../SGP';
import { ShapeObjectDefinitionUid } from '../../Uid';
import { modifierPatchForKind } from '../../Patches';
import { Visibility } from '../../SOPM/ShapeObjectProperty';

export type SetVisibilityParameters = {
  readonly __parameterKind: 'SetVisibility';
  readonly visibility: Visibility;
};

export const SetVisibilityModifier = (parameters: SetVisibilityParameters): Modifier<SetVisibilityParameters> => ({
  parameters,
  partialEvaluationResultRequirements: (): ReadonlySet<ShapeObjectDefinitionUid> => new Set(),
  outputSpec: (onInput: SOPMScheme): E.Either<InsufficientSOPMFields, SOPMScheme> =>
    E.right(onInput),
  run: (p: SetVisibilityParameters, _partialResult: SGPEvaluationResult, input: ShapeObjectPropertyMap): O.Option<ShapeObjectPropertyMap> => 
    O.some({ ...input, visibility: p.visibility }),
});

export const SetVisibilityPatch = modifierPatchForKind('SetVisibility');
