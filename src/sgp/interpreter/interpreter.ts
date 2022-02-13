import * as E from 'fp-ts/Either';
import * as EE from '../../utils/either';

import { pipe } from 'fp-ts/function';
import { ModifiedShape, SGP, ShapeObjectDefinition, SGPEvaluationResult } from '../definition/SGP';
import { DiffExpansionPhaseError, duplicateShapeObjectUid, notImplemented, SGPInterpreterError, syncReferenceIllFormed } from './errors';
import { ShapeObjectDefinitionUid } from '../definition/Uid';

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
type DiffPatchedSGP = ReadonlyArray<ShapeObjectDefinition<ModifiedShape>>;

type ErrorOr<A> = E.Either<SGPInterpreterError, A>;

// #region diff phase 

function checkSyncObjectReferences(program: SGP): E.Either<DiffExpansionPhaseError, void> {
  const idSoFar: Set<ShapeObjectDefinitionUid> = new Set();

  for (const soDef of program) {
    const { definitionUid, shapeObject } = soDef;

    if (idSoFar.has(definitionUid)) {
      return E.left(duplicateShapeObjectUid(definitionUid));
    } else if (shapeObject.__kind === 'SynchronizedShape' && !idSoFar.has(shapeObject.targetDefinitionUid)) {
      const isForwardReference = program
        .map(sod => sod.definitionUid)
        .includes(shapeObject.targetDefinitionUid);
      const reason = isForwardReference ? 'forwardReference' : 'notFound';
      return E.left(syncReferenceIllFormed(definitionUid, reason));
    }

    idSoFar.add(definitionUid);
  }

  return E.right(undefined);
}

function expandCheckedProgram(program: SGP): DiffPatchedSGP {
  throw Error('Not implemented!');
}

/**
 * SGPを展開する。
 * 
 * このメソッドにより展開されたプログラムは、以下を満たす：
 *  - 各{@link ShapeObjectDefinition}が
 *   - {@link ModifiedShape}であり、
 *   - それぞれ一意なUidを持っており、
 *   - 各{@link ModifierDefinition}が、{@link ShapeObjectDefinition}内で一意なUidを持つ
 */
function expandDiff(program: SGP): ErrorOr<DiffPatchedSGP> {
  return pipe(
    E.right(program),
    EE.chainTap(checkSyncObjectReferences),
    E.map(expandCheckedProgram)
  );
}

// #endregion

function typeCheckModifiers(program: DiffPatchedSGP): ErrorOr<void> {
  return E.left(notImplemented);
}

function validateShapeObjectDefinitionReferences(program: DiffPatchedSGP): ErrorOr<void> {
  return E.left(notImplemented);
}

function evaluate(program: DiffPatchedSGP): ErrorOr<SGPEvaluationResult> {
  return E.left(notImplemented);
}

export function evaluateSGP(program: SGP): ErrorOr<SGPEvaluationResult> {
  return pipe(
    E.right(program),
    E.chain(expandDiff),
    EE.chainTap(typeCheckModifiers),
    EE.chainTap(validateShapeObjectDefinitionReferences),
    E.chain(evaluate)
  );
}
