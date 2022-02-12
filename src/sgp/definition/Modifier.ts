import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from './SOPM/SOPMScheme';

/**
 * {@link SOPM}のキーのうちnullableなものすべて
 */
type NullableSOPMField = keyof {
  [F in (keyof SOPM) as (null extends SOPM[F] ? never : F)]: unknown
};

export interface InsufficientSOPMFields {
  readonly __kind: 'InsufficientSOPMFields';
  readonly lackingFields: ReadonlySet<NullableSOPMField>;
}

/**
 * 入力SOPMを指定するスキーマがModifierが予期したものでないときに返されるエラーの型
 */
export type ModifierTypeCheckError = InsufficientSOPMFields;

// TODO Modifierはプログラムの一部の実行結果を利用して動作するため、SOPM上の関数だと表現しきれない。
//      「どのShapeObject達のSOPMを利用するか」という情報を宣言させこれを実行前型チェックに利用し、
//      そのShapeObject達の実行結果のSOPMと共に実行できるようにすべき。
export interface Modifier {
  /**
   * {@link onInput}が型指定する{@link SOPM}が{@link run}に入力された時に
   * {@link run}が出力するであろう{@link SOPM}を型指定する{@link SOPMScheme}。
   * 
   * {@link onInput}で型指定される形の{@link SOPM}が{@link run}に入力された時に
   * {@link run}が{@link SOPM}を出力できないような場合、
   * {@link E.Left}に{@link ModifierTypeCheckError}を返す。
   * 
   * 「型指定」概念については、{@link SOPMScheme}を参照せよ。
   */
  outputSpec(onInput: SOPMScheme): E.Either<ModifierTypeCheckError, SOPMScheme>

  /**
   * この{@link Modifier}に{@link SOPM}を与えて実行する。
   * 
   * {@link run} は、{@link outputSpec} と {@link SOPMScheme} 上の整合性がある。
   * すなわち、このinterfaceの実装は次の条件を保証しなければならない：
   * 
   * `input` を型指定する{@link SOPMScheme}を`inputScheme`とすると、
   *  - `outputSpec(inputScheme)` が {@link E.Left} であるならば {@link run} は {@link O.None} を出力する
   *  - `outputSpec(inputScheme)` が {@link E.right} で `outScheme: SOPMScheme` を含むならば、
   *    `run(input)` は `out: SOPM` を含む {@link O.Some} を返し、
   *    `outScheme` は `out` を型指定する
   * 
   * 「型指定」概念については、{@link SOPMScheme}を参照せよ。
   */
  run(input: SOPM): O.Option<SOPM>
}
