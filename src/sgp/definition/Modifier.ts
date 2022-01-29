import { SOPM } from './ShapeObjectPropertyMap';
import { SOPMScheme } from './SOPMScheme';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

export type ModifierTypeError = never; // TODO specify this

export interface Modifier {
  /**
   * {@link onInput}で指定される形の{@link SOPM}が{@link run}に入力された時に
   * {@link run}が出力するであろう{@link SOPM}の形である{@link SOPMScheme}。
   * 
   * FIXME: 「SOPMSchemeで指定される形のSOPM」が未定義。
   * FIXME: 「Modifierの型付けphase」においてこの情報が使われるため、
   * できるだけ正確な`SOPMScheme`を報告すべきというのをちゃんと書く
   */
  outputSpec(onInput: SOPMScheme): E.Either<ModifierTypeError, SOPMScheme>

  /**
   * この{@link Modifier}に{@link SOPM}を与えて実行する。
   * 
   * {@link run} は、{@link outputSpec} と {@link SOPMScheme} 上の整合性がある。
   * すなわち、このinterfaceの実装は次の条件を保証しなければならない：
   * 
   * `input` を指定する{@link SOPMScheme}を`inputScheme`とすると、
   *  - `outputSpec(inputScheme)` が {@link E.Left} であるならば {@link run} は {@link O.None} を出力する
   *  - `outputSpec(inputScheme)` が {@link E.right} で `s: SOPMScheme` を含むならば、
   *    
   *    {@link SOPM} のすべてのプロパティ `K` について、
   *    `outputSpec(inputScheme)[K] === true` ならば `run(input)[K] !== null` が成り立つ
   */
  run(input: SOPM): O.Option<SOPM>
}
