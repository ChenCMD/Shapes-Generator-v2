import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import * as S from '../SOPM/SOPMScheme';
import { ShapeParameters } from './ParameterSet';

export type ParameterizedShape<Parameter extends ShapeParameters, Output extends SOPM> = {
  /**
   * {@link run}が出力する{@link SOPM}を型指定する{@link S.DetailedSOPMScheme}。
   * 
   * 「型指定」概念については、{@link S.SOPMScheme}を参照せよ。
   */
  readonly outputSpec: S.DetailedSOPMScheme<Output>

  /**
   * この{@link ParameterizedShape}の動作を制御するパラメータ。
   */
  readonly parameter: Parameter;

  /**
   * この{@link ParameterizedShape}の出力である{@link SOPM}。
   * 
   * {@link run}は、{@link outputSpec}と{@link SOPMScheme}上の整合性がある。すなわち、
   * このinterfaceの実装は {@link outputSpec} が {@link run} の結果を
   * 型指定することを保証しなければならない。
   * 
   * 「型指定」概念については、{@link S.SOPMScheme}を参照せよ。
   */
  readonly run: (p: Parameter) => Output
};
