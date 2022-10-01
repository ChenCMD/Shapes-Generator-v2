import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as EE from '../../../util/either';

import { pipe } from 'fp-ts/function';
import {
  ModifiedShape,
  ModifiedShapeDefinition,
  ModifierPipeline,
  SGP,
  SynchronizedShapeDefinition,
  TargetedModifierPatch
} from '../../definition/SGP';
import {
  DiffExpansionPhaseError,
  duplicateModifierUid,
  duplicateShapeObjectUid,
  modifierPatchTargetNotFound,
  modifierPatchUnapplicable,
  shapePatchUnapplicable,
  syncReferenceIllFormed,
  WhenWasModifierUidDuplicated
} from '../errors';
import {
  ModifierDefinitionUid,
  ShapeObjectDefinitionUid
} from '../../definition/Uid';
import { assert } from 'console';

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

export type DiffExpansionPhaseErrorOr<A> = E.Either<DiffExpansionPhaseError, A>;

/**
 * 各{@link ShapeObjectDefinition}が一意な{@link ShapeObjectDefinitionUid}を持っていることを確認する
 */
function checkShapeObjectUidUniqueness(
  program: SGP
): DiffExpansionPhaseErrorOr<void> {
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
  (when: WhenWasModifierUidDuplicated) =>
  <P extends SGP>(program: P): DiffExpansionPhaseErrorOr<void> => {
    for (const { definitionUid: soUid, shapeObject } of program) {
      const declaredModifiers =
        shapeObject.__kind === 'ModifiedShape'
          ? shapeObject.modifiers
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
function checkSyncObjectReferences(
  program: SGP
): DiffExpansionPhaseErrorOr<void> {
  const idSoFar: Set<ShapeObjectDefinitionUid> = new Set();

  for (const { definitionUid, shapeObject } of program) {
    if (
      shapeObject.__kind === 'SynchronizedShape' &&
      !idSoFar.has(shapeObject.targetDefinitionUid)
    ) {
      const isForwardReference = program
        .map((def) => def.definitionUid)
        .includes(shapeObject.targetDefinitionUid);
      const reason = isForwardReference ? 'forwardReference' : 'notFound';
      return E.left(syncReferenceIllFormed(definitionUid, reason));
    }

    idSoFar.add(definitionUid);
  }

  return E.right(undefined);
}

/**
 * Modifierへのパッチ {@link modifierPatch} を、Modifierパイプライン {@link pipeline} に適用する。
 *
 * パッチの適用対象が見つからなかった場合は、パイプラインが変更されずにそのまま返る。
 * 適用対象が見つかったが、適用が不可能だった場合には {@link O.none} が返る。
 */
function patchModifierPipeline(
  pipeline: ModifierPipeline,
  modifierPatch: TargetedModifierPatch
): O.Option<ModifierPipeline> {
  const { targetModifierUid, patch } = modifierPatch;

  return pipe(
    pipeline,
    O.traverseArray((patchTarget) =>
      patchTarget.definitionUid === targetModifierUid
        ? pipe(
            patchTarget.modifier,
            patch,
            O.map((m) => ({
              definitionUid: patchTarget.definitionUid,
              modifier: m
            }))
          )
        : O.some(patchTarget)
    )
  );
}

/**
 * パッチ定義 {@link patchDef} を {@link ModifiedShapeDefinition} に適用する。
 */
function patchShapeObject(
  targetDef: ModifiedShapeDefinition,
  patchDef: SynchronizedShapeDefinition
): DiffExpansionPhaseErrorOr<ModifiedShape> {
  const { shape: targetShape, modifiers: targetModifiers } =
    targetDef.shapeObject;
  const { modifierPatches, shapePatch, additionalModifiers } =
    patchDef.shapeObject;

  const patchedShape = shapePatch(targetShape);
  if (patchedShape._tag === 'None') {
    return E.left(
      shapePatchUnapplicable(targetDef.definitionUid, patchDef.definitionUid)
    );
  }

  let patchedModifiers = targetModifiers;
  for (const modifierPatch of modifierPatches) {
    if (
      patchedModifiers.find(
        (m) => m.definitionUid === modifierPatch.targetModifierUid
      ) === undefined
    ) {
      return E.left(
        modifierPatchTargetNotFound(
          modifierPatch.targetModifierUid,
          targetDef.definitionUid
        )
      );
    }

    const patchResult = patchModifierPipeline(patchedModifiers, modifierPatch);
    if (patchResult._tag === 'None') {
      return E.left(
        modifierPatchUnapplicable(
          targetDef.definitionUid,
          modifierPatch.targetModifierUid,
          patchDef.definitionUid
        )
      );
    } else {
      patchedModifiers = patchResult.value;
    }
  }

  return E.right({
    __kind: 'ModifiedShape',
    shape: patchedShape.value,
    modifiers: patchedModifiers.concat(additionalModifiers)
  });
}

/**
 * SGPを展開する。
 *
 * この関数は、事前条件として、同期図形のUid参照が前方参照になっていないことを求める。
 */
function expandCheckedProgram(
  program: SGP
): DiffExpansionPhaseErrorOr<DiffPatchedSGP> {
  const expandedDefinitions: ModifiedShapeDefinition[] = [];

  for (const { definitionUid, shapeObject } of program) {
    if (shapeObject.__kind === 'SynchronizedShape') {
      const targetCandidates = expandedDefinitions.filter(
        (d) => d.definitionUid === shapeObject.targetDefinitionUid
      );
      // 事前条件により一意に定まるはず
      assert(targetCandidates.length === 1);
      const target = targetCandidates[0];

      const patchedShapeObject = patchShapeObject(target, {
        definitionUid,
        shapeObject
      });

      if (patchedShapeObject._tag === 'Right') {
        expandedDefinitions.push({
          definitionUid,
          shapeObject: patchedShapeObject.right
        });
      } else {
        return patchedShapeObject as E.Left<DiffExpansionPhaseError>;
      }
    } else {
      expandedDefinitions.push({ definitionUid, shapeObject });
    }
  }

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
export function expandDiff(
  program: SGP
): DiffExpansionPhaseErrorOr<DiffPatchedSGP> {
  return pipe(
    E.right(program),
    EE.chainTap(checkShapeObjectUidUniqueness),
    EE.chainTap(checkModifierUidUniqueness('onInput')),
    EE.chainTap(checkSyncObjectReferences),
    // この時点で、programの各ShapeObjectDefinitionが一意なUidを持っており、
    // Modifierが各ShapeObjectDefinition内で一意なUidを持っており、
    // さらに各SynchronizedShapeが有効な参照をしていることが保証されている
    E.chain(expandCheckedProgram),
    // 展開後にModifierの各列がUidの一意性を持っている保証はないので、確認する
    EE.chainTap(checkModifierUidUniqueness('afterExpansion'))
  );
}
