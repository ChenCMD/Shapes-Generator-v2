import * as S from '../SOPM/SOPMScheme';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { ShapeParameters } from './ParameterSet';
import { ParameterizedShape } from './ParameterizedShape';

export type Shape = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ShapeParameters, Output extends SOPM>(shape: ParameterizedShape<Parameter, Output>) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcast<
  Parameter extends ShapeParameters,
  Output extends SOPM
>(shape: ParameterizedShape<Parameter, Output>): Shape {
  return {
    patternMatch: <PatternMatchResult>(onType: <P extends ShapeParameters, O extends SOPM>(_shape: ParameterizedShape<P, O>) => PatternMatchResult) =>
      onType<Parameter, Output>(shape)
  };
}

export function run(unknownParameterShape: Shape): SOPM {
  return unknownParameterShape.patternMatch(shape => shape.run(shape.parameter));
}

export function outputSpec(unknownParameterShape: Shape): S.SOPMScheme {
  return unknownParameterShape.patternMatch(shape => shape.outputSpec);
}
