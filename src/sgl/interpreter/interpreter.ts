import * as E from 'fp-ts/Either';
import * as EE from '../../utils/either';

import { pipe } from 'fp-ts/function';
import { ModifiedShapeObject, SGLProgram, ShapeObjectDefinition, ShapeObjectId } from '../definitions/sgl';
import { SGLInterpreterError, notImplemented, DiffPhaseError, duplicateShapeObjectId, syncReferenceIllFormed } from './errors';
import { SGLEvaluationResult } from './result';

/**
 * SGLProgram のうち、 ModifiedShapeObject をもとにした図形定義しか含まないもの。
 * 
 * SGLの評価パイプライン上では、まず最初に SGLProgram が DiffPatchedSGLProgram に
 * expandDiff 関数によって「展開」される。この展開処理を diff phase と呼ぶことにする。
 * 
 * diff phase では、SGLProgram の中の各 ShapeObject が
 *  - 一意なIdを利用しているか
 *  - SynchronizedShapeObject であれば、同期対象として、
 *    それよりも前に定義された ShapeObject を参照していること
 * 
 * を検査する。検査に通らなければエラー、通れば
 * SynchronizedShapeObject が保持していた差分を適用する。
 * 
 * 差分適用は単純に Object.assign により行われる。
 * diff phase においては、差分適用の結果がプログラムとして妥当か等の検査は一切しない。
 */
type DiffPatchedSGLProgram = ShapeObjectDefinition<ModifiedShapeObject>[];

type ErrorOr<A> = E.Either<SGLInterpreterError, A>;

function checkDiffPhaseInput(program: SGLProgram): E.Either<DiffPhaseError, void> {
    const idSoFar: Set<ShapeObjectId> = new Set();
    for (const soDef of program) {
        const { id, shapeObject } = soDef;

        if (idSoFar.has(id)) {
            return E.left(duplicateShapeObjectId(id));
        } else if (shapeObject.__kind === 'synchronized' && !idSoFar.has(shapeObject.targetUid)) {
            const isForwardReference = program.map(sod => sod.id).includes(shapeObject.targetUid);
            const reason = isForwardReference ? 'forwardReference' : 'notFound';
            return E.left(syncReferenceIllFormed(id, reason));
        }
        idSoFar.add(id);
    }    

    return E.right(undefined);
}

function expandCheckedProgram(program: SGLProgram): DiffPatchedSGLProgram {
    throw Error('Not implemented!');
}

function expandDiff(program: SGLProgram): E.Either<DiffPhaseError, DiffPatchedSGLProgram> {
    // 展開に際してエラーが起きないかをまず確認し、大丈夫そうであれば差分を適用していく
    return pipe(
        E.right(program),
        EE.chainTap(checkDiffPhaseInput),
        E.map(expandCheckedProgram)
    );
}

function typeCheckModifiers(program: DiffPatchedSGLProgram): ErrorOr<void> {
    return E.left(notImplemented);
}

function validateShapeObjectDefinitionReferences(program: DiffPatchedSGLProgram): ErrorOr<void> {
    return E.left(notImplemented);
}

function evaluate(program: DiffPatchedSGLProgram): ErrorOr<SGLEvaluationResult> {
    return E.left(notImplemented);
}

export function evaluateSGLProgram(program: SGLProgram): ErrorOr<SGLEvaluationResult> {
    return pipe(
        E.right(program),
        E.chain(expandDiff),
        EE.chainTap(typeCheckModifiers),
        EE.chainTap(validateShapeObjectDefinitionReferences),
        E.chain(evaluate)
    );
}
