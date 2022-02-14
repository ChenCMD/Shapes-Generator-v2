import * as E from 'fp-ts/Either';
import * as EE from '../../../utils/either';

import { pipe } from 'fp-ts/function';
import { ModifiedShape, SGP, ShapeObjectDefinition } from '../../definition/SGP';
import { DiffExpansionPhaseError, duplicateModifierUid, duplicateShapeObjectUid, InterpreterErrorOr, syncReferenceIllFormed, WhenWasModifierUidDuplicated } from '../errors';
import { ModifierDefinitionUid, ShapeObjectDefinitionUid } from '../../definition/Uid';

type ModifiedShapeDefinition = ShapeObjectDefinition<ModifiedShape>;

/**
 * SGP のうち、 ModifiedShape をもとにした図形定義しか含まないもの。
 * 
 * SGP の評価パイプライン上では、まず最初に SGP が DiffPatchedSGP に
 * expandDiff 関数によって「展開」される。
 * この展開処理を行う部分を diff-expansion phase と呼ぶことにする。
 * 
 * diff-expansion phase では、SGP の中の各 ShapeObject が
 *  - 一意なUidを利用しているか
 *  - SynchronizedShape であれば、同期対象として、
 *    それよりも前に定義された ShapeObject を参照していること
 *  - ModiferのPatchが存在するModifierを参照していること
 *  - 展開の前後を通して、Modifierに(同ShapeObject内で)一意なUidを割り振っているか
 * 
 * などを検査する。
 */
export type DiffPatchedSGP = ReadonlyArray<ModifiedShapeDefinition>;

/**
 * 各{@link ShapeObjectDefinition}が一意な{@link ShapeObjectDefinitionUid}を持っていることを確認する
 */
function checkShapeObjectUidUniqueness(program: SGP): E.Either<DiffExpansionPhaseError, void> {
  const idSoFar: Set<ShapeObjectDefinitionUid> = new Set();
  for (const { definitionUid } of program) {
    if (idSoFar.has(definitionUid)) {
      return E.left(duplicateShapeObjectUid(definitionUid));
    } else {
      idSoFar.add(definitionUid);
    }
  }
  
  return E.right(undefined);
}

/**
 * 各{@link ModifierDefinition}が({@link ShapeObjectDefinition}内で)
 * 一意な{@link ModifierDefinitionUid}を持っていることを確認する
 */
const checkModifierUidUniqueness =
  (when: WhenWasModifierUidDuplicated) => <P extends SGP>(program: P): E.Either<DiffExpansionPhaseError, void> => {
    for (const { definitionUid: soUid, shapeObject } of program) {
      const declaredModifiers =
        shapeObject.__kind === 'ModifiedShape' ?
          shapeObject.modifiers
        : shapeObject.additionalModifiers;

      const modifierIdSoFar: Set<ModifierDefinitionUid> = new Set();

      for (const { definitionUid } of declaredModifiers) {
        if (modifierIdSoFar.has(definitionUid)) {
          return E.left(duplicateModifierUid(definitionUid, soUid, when));
        } else {
          modifierIdSoFar.add(definitionUid);
        }
      }
    }

    return E.right(undefined);
  };

/**
 * 各{@link SynchronizedShape}が有効な図形を参照していることを確認する
 */
function checkSyncObjectReferences(program: SGP): E.Either<DiffExpansionPhaseError, void> {
  const idSoFar: Set<ShapeObjectDefinitionUid> = new Set();

  for (const { definitionUid, shapeObject } of program) {
    if (shapeObject.__kind === 'SynchronizedShape' && !idSoFar.has(shapeObject.targetDefinitionUid)) {
      const isForwardReference = program
        .map(def => def.definitionUid)
        .includes(shapeObject.targetDefinitionUid);
      const reason = isForwardReference ? 'forwardReference' : 'notFound';
      return E.left(syncReferenceIllFormed(definitionUid, reason));
    }

    idSoFar.add(definitionUid);
  }

  return E.right(undefined);
}

function expandCheckedProgram(program: SGP): E.Either<DiffExpansionPhaseError, DiffPatchedSGP> {
  const expandedDefinitions: ModifiedShapeDefinition[] = [];

  // TODO expand definitions in program

  return E.right(expandedDefinitions);
}

/**
 * SGPを展開する。
 * 
 * このメソッドにより展開されたプログラムは、以下を満たす：
 *  - 各{@link ShapeObjectDefinition}が
 *   - {@link ModifiedShape}であり、
 *   - それぞれ一意なUidを持っており、
 *   - 各{@link ModifierDefinition}が、{@link ShapeObjectDefinition}内で一意なUidを持つ
 * 
 * {@link ModifierDefinition}の{@link ShapeObjectDefinition}内でのUidの一意性は
 * SGPの実行には必要のない制約ではある。例えば `[def1, def2]` というプログラムがあり、
 * `def2` が `def1` に同期しているような場合、展開した結果は `[def1, patch(def1, def2)]` 
 * のようなものになる。ここで `patch(def1, def2)` がUidが重複する{@link ModifierDefinition}を持っていようと
 * このプログラムの実行自体にはさほど影響を及ぼさない。しかし、
 * このような状況は明らかにUI上で異常な操作が行われない限り発生しないと考えるのが妥当で、
 * プログラムに対して追加の操作(export/importや編集など)をしたときに、
 * よりユーザーが対処しにくい壊れ方をする可能性があるから、
 * このようなプログラムは無効であるというデザインをしている。
 */
export function expandDiff(program: SGP): InterpreterErrorOr<DiffPatchedSGP> {
  return pipe(
    E.right(program),
    EE.chainTap(checkShapeObjectUidUniqueness),
    EE.chainTap(checkModifierUidUniqueness('onInput')),
    EE.chainTap(checkSyncObjectReferences),
    // この時点で、programの各ShapeObjectDefinitionが一意なUidを持っており、
    // Modifierの列が一意なUidを持っており、
    // さらに各SynchronizedShapeが有効な参照をしていることが保証されている
    E.chain(expandCheckedProgram),
    // 展開後にModifierの各列がUidの一意性を持っている保証はないので、確認する
    EE.chainTap(checkModifierUidUniqueness('afterExpansion')),
  );
}
