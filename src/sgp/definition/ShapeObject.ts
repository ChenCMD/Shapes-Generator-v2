import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import * as S from './SOPM/SOPMScheme';

export interface ShapeObject<Output extends SOPM> {
  /**
   * {@link run}が出力する{@link SOPM}を型指定する{@link S.DetailedSOPMScheme}。
   * 
   * 型指定については、{@link S.SOPMScheme}を参照せよ。
   */
  readonly outputSpec: S.DetailedSOPMScheme<Output>

  /**
   * この{@link ShapeObject}の出力である{@link SOPM}。
   * 
   * {@link run}は、{@link outputSpec}と{@link SOPMScheme}上の整合性がある。すなわち、
   * このinterfaceの実装は {@link outputSpec} が {@link run} の結果を
   * 型指定することを保証しなければならない。
   * 
   * 型指定については、{@link S.SOPMScheme}を参照せよ。
   */
  run(): Output
}
