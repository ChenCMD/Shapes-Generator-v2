import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { SGPEvaluationResult } from '../SGP';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../SOPM/SOPMScheme';
import { ShapeObjectDefinitionUid } from '../Uid';
import { ParameterizedModifier, ModifierTypeCheckError } from './ParameterizedModifier';
import { ModifierParameterSet } from './ParameterSet';

export type Modifier = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ModifierParameterSet>(modifier: ParameterizedModifier<Parameter>) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcast<ParameterSet extends ModifierParameterSet>(modifier: ParameterizedModifier<ParameterSet>): Modifier {
  return {
    patternMatch: <PatternMatchResult>(onType: <P extends ModifierParameterSet>(_modifier: ParameterizedModifier<P>) => PatternMatchResult) =>
      onType<ParameterSet>(modifier)
  };
}

export function run(unknownModifier: Modifier, partialResult: SGPEvaluationResult, input: SOPM): O.Option<SOPM> {
  return unknownModifier.patternMatch(modifier => modifier.run(modifier.parameters, partialResult, input));
}

export function partialEvaluationResultRequirements(unknownModifier: Modifier): ReadonlySet<ShapeObjectDefinitionUid> {
  return unknownModifier.patternMatch(modifier => modifier.partialEvaluationResultRequirements(modifier.parameters));
}

export function outputSpec(unknownModifier: Modifier, inputScheme: SOPMScheme): E.Either<ModifierTypeCheckError, SOPMScheme> {
  return unknownModifier.patternMatch(modifier => modifier.outputSpec(inputScheme));
}
