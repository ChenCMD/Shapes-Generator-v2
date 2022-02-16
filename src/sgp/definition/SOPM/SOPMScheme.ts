import { ProjectNullabilityToBool } from '../../../utils/bool-to-nullability';
import { SOPM } from './ShapeObjectPropertyMap';

/**
 * {@link SOPM} の各フィールドの型に {@link ProjectNullabilityToBool} を適用したもの。
 * 
 * この型の値は、「ShapeObjectから実際にSOPMを生成して、Modifierの列に流し込む」という
 * Shapes Generator の実行フェーズ (このフェーズのことを
 * Modifierパイプラインフェーズと呼ぶこととする) に**先駆けて**、
 * 「Modifierの列が意味を成す順序で与えられているかを確認」するために利用される
 * (この確認フェーズのことをModifier型チェックフェーズと呼ぶこととする)。
 * 
 * ## 型指定関係について
 * 
 * {@link SOPMScheme}の値 `scheme` と{@link SOPM}の値 `sopm` について、
 * **`scheme` は `sopm` を型指定する** とは以下のように定義される:
 *  - {@link SOPM}のすべてのプロパティ`K`について、
 *    - `scheme[K] === true` と `sopm[K] !== null` が同値
 * 
 * 例えば、
 * 
 * ```TS
 * ({
 *   particlePoints: true,
 *   visibility: true,
 *   angledVertices: false,
 *   directedEndpoints: true,
 * })
 * ```
 * 
 * は、
 * 
 * ```TS
 * ({
 *   particlePoints: [],
 *   visibility: true,
 *   angledVertices: null,
 *   directedEndpoints: [],
 * })
 * ```
 * 
 * を型指定する。
 * 
 * 型指定の概念は、ModifierやShapeObjectインターフェースの契約に現れるため、
 * そちらも参照されたい。
 * 
 * ## Modifier型チェックフェーズの必要性について
 * 
 * Modifier型チェックフェーズが必要とされる背景としては、
 *  - Modifierパイプラインフェーズでは比較的重い処理を行う場合がある
 *    - 例えば楕円の曲線長を計算したり、GLSLシェーダーで書かれたベクトル場に
 *      SOPMが持つ点集合を流し込んだりするような処理まで想定している
 *  - どのModifierの後にどのModifierが適用できるかというのが非自明
 * 
 * といった点がある。このような事情から、Modifierの列が「実行可能」であるかどうかの
 * 軽量なチェックがあれば、
 *  1. UI上のエラー表示
 *  2. 正しい順序でModifierを組み上げることを強制するUI
 *  3. 様々な図形定義をユーザーがごちゃごちゃ動かしても、
 *     エラーにならなさそうな場合にのみSOPMを再計算する仕組み
 * 
 * 等の実装において便利だと考えられる。上のリストのうち(1)と(2)は一見
 * 矛盾する要求のように思えるが、一度正しい順序でModifierパイプラインを組み上げたとしても、
 * 間に「図形複製」等の機能が挟まっていた場合、中間の図形定義にModifierを追加/削除することで、
 * それを複製する図形のModifierパイプラインが破損する可能性があるといった点に注意。
 */
export type SOPMScheme = {
  readonly [P in keyof SOPM]: ProjectNullabilityToBool<SOPM[P]>;
};

/**
 * {@link SOPM} の部分型 {@link M} の各フィールドの型に {@link ProjectNullabilityToBool} を適用したもの。
 * 
 * @remarks
 * 
 * この型は {@link SOPMScheme} の部分型であり、0個以上の `boolean` のフィールドが
 * リテラル型に置き換わっているものと考えてよい。どのフィールドが置き換わっているかは、
 * {@link M} がフィールドのnullabilityをどれだけ精密に指定しているかに依存する。
 * 
 * この型は、主に{@link ShapeObject}の実装の整合性を取るのに用いられる。
 */
export type DetailedSOPMScheme<M extends SOPM> = SOPMScheme & {
  readonly [P in keyof M]: ProjectNullabilityToBool<M[P]>;
};

type SOPMSchemeWith<
  AngledVerticesPresence extends boolean,
  DirectedEndpointsPresence extends boolean
> = SOPMScheme & {
  readonly angledVertices: AngledVerticesPresence
  readonly directedEndpoints: DirectedEndpointsPresence
};

/**
 * {@link SOPMScheme} の値を簡単に生成するための関数。
 * 引数はそれぞれどのフィールドの存在を予期するかを表す。
 * 
 * この関数は、引数にリテラルを渡すことで返り値の型({@link SOPMScheme}の部分型)
 * がより具体的になるように型宣言されている。
 */
export const sopmSchemeWith = <
  AngledVerticesPresence extends boolean,
  DirectedEndpointsPresence extends boolean
>(angledVerticesPresence: AngledVerticesPresence,
  directedEndpointsPresence: DirectedEndpointsPresence): SOPMSchemeWith<AngledVerticesPresence, DirectedEndpointsPresence> => ({
    particlePoints: true,
    visibility: true,
    angledVertices: angledVerticesPresence,
    directedEndpoints: directedEndpointsPresence,
  });
