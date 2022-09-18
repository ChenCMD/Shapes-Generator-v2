import { EllipseParameters } from './ShapeObjects/Ellipse';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import * as S from './SOPM/SOPMScheme';

export type ShapeParameters = EllipseParameters | { __parameterKind: 'ABC', someRandomParam: number };

export interface Shape<Parameter extends ShapeParameters, Output extends SOPM> {
  /**
   * {@link run}が出力する{@link SOPM}を型指定する{@link S.DetailedSOPMScheme}。
   * 
   * 「型指定」概念については、{@link S.SOPMScheme}を参照せよ。
   */
  readonly outputSpec: S.DetailedSOPMScheme<Output>

  readonly parameter: Parameter;

  /**
   * この{@link Shape}の出力である{@link SOPM}。
   * 
   * {@link run}は、{@link outputSpec}と{@link SOPMScheme}上の整合性がある。すなわち、
   * このinterfaceの実装は {@link outputSpec} が {@link run} の結果を
   * 型指定することを保証しなければならない。
   * 
   * 「型指定」概念については、{@link S.SOPMScheme}を参照せよ。
   */
  readonly run: (p: Parameter) => Output
}

export type ShapeWithUnknownParameter = {
  readonly patternMatch: <PatternMatchResult>(
    onType: <Parameter extends ShapeParameters, Output extends SOPM>(shape: Shape<Parameter, Output>) => PatternMatchResult
  ) => PatternMatchResult;
};

export function upcastToUnkownParameterShape<
  Parameter extends ShapeParameters,
  Output extends SOPM
>(shape: Shape<Parameter, Output>): ShapeWithUnknownParameter {
  return {
    patternMatch: <PatternMatchResult>(onType: <P extends ShapeParameters, O extends SOPM>(_shape: Shape<P, O>) => PatternMatchResult) =>
      onType<Parameter, Output>(shape)
  };
}

export function runUnknownParameterShape(unknownParameterShape: ShapeWithUnknownParameter): SOPM {
  return unknownParameterShape.patternMatch(shape => shape.run(shape.parameter));
}

export function outputSpecOfUnknownParameterShape(unknownParameterShape: ShapeWithUnknownParameter): S.SOPMScheme {
  return unknownParameterShape.patternMatch(shape => shape.outputSpec);
}
