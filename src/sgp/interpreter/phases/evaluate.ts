import * as E from 'fp-ts/Either';

import { SGPEvaluationResult, ShapeObjectEvaluationResult } from '../../definition/SGP';
import { InterpreterErrorOr, modifierReturnedNoneWhenEvaluated } from '../errors';
import { DiffPatchedSGP } from './diff-expansion';

export function evaluate(program: DiffPatchedSGP): InterpreterErrorOr<SGPEvaluationResult> {
  const resultSoFar: ShapeObjectEvaluationResult[] = [];

  for (const { definitionUid: shapeObjectUid, shapeObject } of program) {
    let outputSopm = shapeObject.shape.run();
    for (const { definitionUid: modifierUid, modifier } of shapeObject.modifiers) {
      const modifierResult = modifier.run(resultSoFar, outputSopm);

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
