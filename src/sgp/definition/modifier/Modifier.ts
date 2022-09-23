import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { SGPEvaluationResult } from '../SGP';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../SOPM/SOPMScheme';
import { ShapeObjectDefinitionUid } from '../Uid';
import {
  ParameterizedModifier,
  ModifierTypeCheckError,
} from './ParameterizedModifier';
import { ModifierParameterSet } from './ParameterSet';

export type Modifier = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ModifierParameterSet>(
      inner: ParameterizedModifier<Parameter>
    ) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcast<ParameterSet extends ModifierParameterSet>(
  modifier: ParameterizedModifier<ParameterSet>
): Modifier {
  return {
    patternMatch: <PatternMatchResult>(
      onType: <P extends ModifierParameterSet>(
        inner: ParameterizedModifier<P>
      ) => PatternMatchResult
    ) => onType<ParameterSet>(modifier),
  };
}

export function run(
  modifier: Modifier,
  partialResult: SGPEvaluationResult,
  input: SOPM
): O.Option<SOPM> {
  return modifier.patternMatch((inner) =>
    inner.run(inner.parameters, partialResult, input)
  );
}

export function partialEvaluationResultRequirements(
  modifier: Modifier
): ReadonlySet<ShapeObjectDefinitionUid> {
  return modifier.patternMatch((inner) =>
    inner.partialEvaluationResultRequirements(inner.parameters)
  );
}

export function outputSpec(
  modifier: Modifier,
  inputScheme: SOPMScheme
): E.Either<ModifierTypeCheckError, SOPMScheme> {
  return modifier.patternMatch((inner) => inner.outputSpec(inputScheme));
}
