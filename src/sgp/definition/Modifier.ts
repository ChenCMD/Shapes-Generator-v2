import { SOPM } from './ShapeObjectPropertyMap';
import { SOPMScheme } from './SOPMScheme';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

export type ModifierTypeError = never; // TODO specify this

export interface Modifier {
  /**
   * {@link onInput}が型指定する{@link SOPM}が{@link run}に入力された時に
   * {@link run}が出力するであろう{@link SOPM}を型指定する{@link SOPMScheme}。
   * 
   * {@link onInput}で型指定される形の{@link SOPM}が{@link run}に入力された時に
   * {@link run}が{@link SOPM}を出力できないような場合、
   * {@link E.Left}に{@link ModifierTypeError}を返す。
   * 
   * FIXME: 「SOPMSchemeがSOPMを型指定する」という関係が未定義
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
   *     - `outputSpec(inputScheme)[K] === true`
   *     - `run(input)[K] !== null`
   * 
   *    が同値
   */
  run(input: SOPM): O.Option<SOPM>
}
