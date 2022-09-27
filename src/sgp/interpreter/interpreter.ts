import * as E from 'fp-ts/Either';
import * as EE from '../../util/either';

import { pipe } from 'fp-ts/function';
import { SGPEvaluationResult } from '../definition/SGP';
import { SGPEvaluationPhaseErrorOr } from './errors';
import { DiffPatchedSGP } from './phases/diff-expansion';
import { evaluate } from './phases/evaluate';
import { typeCheckModifiers } from './phases/typecheck';

/**
 * SGPを展開する。
 */
export { expandDiff } from './phases/diff-expansion';

/**
 * 展開済みのSGPを型チェックに掛けたうえで実行する。
 */
export function evaluatePatchedSGP(
  program: DiffPatchedSGP
): SGPEvaluationPhaseErrorOr<SGPEvaluationResult> {
  return pipe(
    E.right(program),
    EE.chainTapW(typeCheckModifiers),
    E.chainW(evaluate)
  );
}
