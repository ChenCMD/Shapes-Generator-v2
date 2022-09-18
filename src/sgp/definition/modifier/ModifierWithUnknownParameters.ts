import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { SGPEvaluationResult } from '../SGP';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../SOPM/SOPMScheme';
import { ShapeObjectDefinitionUid } from '../Uid';
import { Modifier, ModifierTypeCheckError } from './Modifier';
import { ModifierParameterSet } from './ParameterSet';

export type ModifierWithUnknownParameter = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ModifierParameterSet>(modifier: Modifier<Parameter>) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcast<ParameterSet extends ModifierParameterSet>(modifier: Modifier<ParameterSet>): ModifierWithUnknownParameter {
  return {
    patternMatch: <PatternMatchResult>(onType: <P extends ModifierParameterSet>(_modifier: Modifier<P>) => PatternMatchResult) =>
      onType<ParameterSet>(modifier)
  };
}

export function run(unknownModifier: ModifierWithUnknownParameter, partialResult: SGPEvaluationResult, input: SOPM): O.Option<SOPM> {
  return unknownModifier.patternMatch(modifier => modifier.run(modifier.parameters, partialResult, input));
}

export function partialEvaluationResultRequirements(unknownModifier: ModifierWithUnknownParameter): ReadonlySet<ShapeObjectDefinitionUid> {
  return unknownModifier.patternMatch(modifier => modifier.partialEvaluationResultRequirements(modifier.parameters));
}

export function outputSpec(unknownModifier: ModifierWithUnknownParameter, inputScheme: SOPMScheme): E.Either<ModifierTypeCheckError, SOPMScheme> {
  return unknownModifier.patternMatch(modifier => modifier.outputSpec(inputScheme));
}
