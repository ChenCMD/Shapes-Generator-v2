import * as S from '../SOPM/SOPMScheme';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { ShapeParameters } from './ParameterSet';
import { ParameterizedShape } from './ParameterizedShape';

export type Shape = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ShapeParameters, Output extends SOPM>(
      inner: ParameterizedShape<Parameter, Output>
    ) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcast<Parameter extends ShapeParameters, Output extends SOPM>(
  shape: ParameterizedShape<Parameter, Output>
): Shape {
  return {
    patternMatch: <PatternMatchResult>(
      onType: <P extends ShapeParameters, O extends SOPM>(
        inner: ParameterizedShape<P, O>
      ) => PatternMatchResult
    ) => onType<Parameter, Output>(shape),
  };
}

export function run(shape: Shape): SOPM {
  return shape.patternMatch((inner) => inner.run(inner.parameter));
}

export function outputSpec(shape: Shape): S.SOPMScheme {
  return shape.patternMatch((inner) => inner.outputSpec);
}
