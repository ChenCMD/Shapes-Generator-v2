import * as E from 'fp-ts/Either';

import { SGPEvaluationResult } from '../../definition/SGP';
import { InterpreterErrorOr, notImplemented } from '../errors';
import { DiffPatchedSGP } from './diff-expansion';

export function evaluate(program: DiffPatchedSGP): InterpreterErrorOr<SGPEvaluationResult> {
  return E.left(notImplemented);
}
