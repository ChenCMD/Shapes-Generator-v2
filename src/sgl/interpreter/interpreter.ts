import * as E from 'fp-ts/Either';
import * as EE from '../../utils/either';

import { pipe } from 'fp-ts/function';
import { ModifiedShapeObject, SGLProgram, ShapeObjectDefinition } from '../definitions/sgl';
import { SGLInterpreterError, notImplemented } from './errors';
import { SGLEvaluationResult } from './result';

/**
 * SGLProgram のうち、 ModifiedShapeObject をもとにした図形定義しか含まないもの。
 * 
 * SGLの評価パイプライン上では、まず最初に SGLProgram が DiffPatchedSGLProgram に
 * expandDiff 関数によって「展開」される。この展開処理を diff phase と呼ぶことにする。
 * 
 * diff phase 内では、SGLProgram の中の SynchronizedShapeObject がそれよりも前に定義された
 * ShapeObject を参照していることを検証し、そうでなければエラー、
 * そうであれば SynchronizedShapeObject が保持していた差分を適用する。
 * 
 * 差分適用は単純に Object.assign により行われる。
 * diff phase においては、差分適用の結果がプログラムとして妥当か等の検査は一切しない。
 */
type DiffPatchedSGLProgram = ShapeObjectDefinition<ModifiedShapeObject>[];

type ErrorOr<A> = E.Either<SGLInterpreterError, A>;

function expandDiff(program: SGLProgram): ErrorOr<DiffPatchedSGLProgram> {
    return E.left(notImplemented);
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
