import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { SGPEvaluationResult } from '../SGP';
import { SOPM } from '../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../SOPM/SOPMScheme';
import { ShapeObjectDefinitionUid } from '../Uid';
import { ModifierParameterSet } from './ParameterSet';

/**
 * {@link SOPM}のキーのうちnullableなものすべて
 */
type NullableSOPMField = keyof {
  [F in (keyof SOPM) as (null extends SOPM[F] ? F : never)]: unknown
};

export interface InsufficientSOPMFields {
  readonly __kind: 'InsufficientSOPMFields';
  readonly lackingFields: ReadonlySet<NullableSOPMField>;
}
export const insufficientSOPMFields = (lackingFields: ReadonlySet<NullableSOPMField>): InsufficientSOPMFields =>
  ({ __kind: 'InsufficientSOPMFields', lackingFields });

/**
 * 入力SOPMを指定するスキーマがModifierが予期したものでないときに返されるエラーの型
 */
export type ModifierTypeCheckError = InsufficientSOPMFields;

export type Modifier<ParameterSet extends ModifierParameterSet> = {
  /**
   * この{@link Modifier}の動作を制御するパラメータ集合。
   */
  parameters: ParameterSet

  /**
   * {@link inputScheme}が型指定する{@link SOPM}が{@link run}に入力された時に
   * {@link run}が出力するであろう{@link SOPM}を型指定する{@link SOPMScheme}。
   * 
   * {@link inputScheme}で型指定される形の{@link SOPM}が{@link run}に入力された時に
   * {@link run}が{@link SOPM}を出力できないような場合、
   * {@link E.Left}に{@link ModifierTypeCheckError}を返す。
   * 
   * 「型指定」概念については、{@link SOPMScheme}を参照せよ。
   */
  outputSpec(inputScheme: SOPMScheme): E.Either<ModifierTypeCheckError, SOPMScheme>

  /**
   * このModifierが{@link run}に渡される{@link SGPEvaluationResult}に要求する評価結果のキー集合。
   * 
   * 例として、`[def1, def2, def3]` のような形をしたSGPを考える。
   * さらに、`def2` がこの {@link Modifier} を含んでいるとする。
   * すると、この {@link Modifier} は `def1` の評価結果(SOPM)を参照してSOPMの変換を行おうとする可能性がある。
   * そのような場合では、当メソッドは `Set(def1.definitionUid)` を返せばよい。
   * 
   * もし仮に、この {@link Modifier} が `def3` の結果を参照しよとしていたならば、それは無効なプログラムである。
   * このようなプログラムを実行前に検知するため、SGPのインタプリタはこのメソッドから返される情報を元に
   * {@link run} が値を返せるかどうかを判断すべきである。
   */
  partialEvaluationResultRequirements(parameters: ParameterSet): ReadonlySet<ShapeObjectDefinitionUid>

  /**
   * この{@link Modifier}に、部分的な(後述){@link SGPEvaluationResult}と{@link SOPM}を与えて実行する。
   * 
   * このメソッドは、以下の2条件が満たされている限り {@link O.Some} を返さなければならない：
   *  - {@link partialResult} のUid集合が、{@link partialEvaluationResultRequirements}が返す集合を
   *    包含している
   *  - `input` を型指定する{@link SOPMScheme}を`inputScheme`とすると、
   *    `outputSpec(inputScheme)` が {@link E.right} の値になる
   * 
   * また、{@link run} は、{@link outputSpec} と {@link SOPMScheme} 上の整合性がある。
   * すなわち、このinterfaceの実装は次の条件を保証しなければならない：
   *  - `input` を型指定する{@link SOPMScheme}を `inputScheme` とし、
   *  - `run(input)` が `O.some(out: SOPM)` を返し、
   *  - `outputSpec(inputScheme)` が `E.right(outScheme: SOPMScheme)` を返す
   * 
   * ならば、
   *  - `outScheme` は `out` を型指定する
   * 
   * 「型指定」概念については、{@link SOPMScheme}を参照せよ。
   * 
   * SGPのインタプリタは、このメソッドが {@link O.None} を返さないことを、
   * {@link outputSpec} 及び {@link partialEvaluationResultRequirements} の情報を用いて事前に保証すべきである。
   * もしこれを保証したにもかかわらず {@link O.None} が返された場合、
   * それは当Modifierの実装が誤っていると考えるべきで、UIに適切な報告をするよう促すべきである。
   */
  run(parameters: ParameterSet, partialResult: SGPEvaluationResult, input: SOPM): O.Option<SOPM>
};
