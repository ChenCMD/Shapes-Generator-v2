import * as S from '../SOPM/SOPMScheme';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { ShapeParameters } from './ParameterSet';
import { Shape } from './Shape';

export type ShapeWithUnknownParameter = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ShapeParameters, Output extends SOPM>(shape: Shape<Parameter, Output>) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcast<
  Parameter extends ShapeParameters,
  Output extends SOPM
>(shape: Shape<Parameter, Output>): ShapeWithUnknownParameter {
  return {
    patternMatch: <PatternMatchResult>(onType: <P extends ShapeParameters, O extends SOPM>(_shape: Shape<P, O>) => PatternMatchResult) =>
      onType<Parameter, Output>(shape)
  };
}

export function run(unknownParameterShape: ShapeWithUnknownParameter): SOPM {
  return unknownParameterShape.patternMatch(shape => shape.run(shape.parameter));
}

export function outputSpec(unknownParameterShape: ShapeWithUnknownParameter): S.SOPMScheme {
  return unknownParameterShape.patternMatch(shape => shape.outputSpec);
}
