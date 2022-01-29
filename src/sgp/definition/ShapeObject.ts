import { SOPM } from './ShapeObjectPropertyMap';
import { DetailedSOPMScheme } from './SOPMScheme';

export interface ShapeObject<Output extends SOPM> {
  /**
   * {@link run}が出力するであろう{@link SOPM}の形を指定するSOPMScheme。
   * 
   * FIXME: 「SOPMSchemeで指定される形のSOPM」が未定義。
   * FIXME: 「Modifierの型付けphase」においてこの情報が使われるため、
   * できるだけ正確な`SOPMScheme`を報告すべきというのをちゃんと書く
   */
  readonly outputSpec: DetailedSOPMScheme<Output>

  /**
   * この{@link ShapeObject}の出力である{@link SOPM}。
   * 
   * {@link run}は、{@link outputSpec}と{@link SOPMScheme}上の整合性がある。すなわち、
   * このinterfaceの実装は次の条件を保証しなければならない：
   * 
   * {@link SOPM}のすべてのプロパティ`K`について、
   *  - `outputSpec[K] === true` ならば `run()[K] !== null` が成り立つ
   */
  run(): Output
}
