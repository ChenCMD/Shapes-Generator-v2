import * as E from 'fp-ts/Either';
import { runUnknownParameterModifier } from '../../definition/Modifier';

import { SGPEvaluationResult, ShapeObjectEvaluationResult } from '../../definition/SGP';
import { runUnknownParameterShape } from '../../definition/Shape';
import { EvaluationError, modifierReturnedNoneWhenEvaluated } from '../errors';
import { DiffPatchedSGP } from './diff-expansion';

export type EvaluationErrorOr<A> = E.Either<EvaluationError, A>;

/**
 * 型チェックに通った {@link DiffPatchedSGP} を実行する。
 * 
 * このフェーズでエラーが返ってくる場合は、Modifierの実装が誤っているか、
 * 型チェッカの実装が誤っているような場合のいずれかなので、ユーザーにバグ報告を促すこと。
 */
export function evaluate(program: DiffPatchedSGP): EvaluationErrorOr<SGPEvaluationResult> {
  const resultSoFar: ShapeObjectEvaluationResult[] = [];

  for (const { definitionUid: shapeObjectUid, shapeObject } of program) {
    let outputSopm = runUnknownParameterShape(shapeObject.shape);
    for (const { definitionUid: modifierUid, modifier } of shapeObject.modifiers) {
      const modifierResult = runUnknownParameterModifier(modifier, resultSoFar, outputSopm);

      if (modifierResult._tag === 'Some') {
        outputSopm = modifierResult.value;
      } else {
        return E.left(modifierReturnedNoneWhenEvaluated(shapeObjectUid, modifierUid));
      }
    }

    resultSoFar.push({
      originUid: shapeObjectUid,
      output: outputSopm,
    });
  }

  return E.right(resultSoFar);
}
