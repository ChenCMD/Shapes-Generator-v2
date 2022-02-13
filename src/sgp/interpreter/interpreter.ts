import * as E from 'fp-ts/Either';
import * as EE from '../../utils/either';

import { pipe } from 'fp-ts/function';
import { SGP, SGPEvaluationResult } from '../definition/SGP';
import { notImplemented, SGPInterpreterError } from './errors';
import { expandDiff, DiffPatchedSGP } from './diff-phase';

type InterpreterErrorOr<A> = E.Either<SGPInterpreterError, A>;

function typeCheckModifiers(program: DiffPatchedSGP): InterpreterErrorOr<void> {
  return E.left(notImplemented);
}

function evaluate(program: DiffPatchedSGP): InterpreterErrorOr<SGPEvaluationResult> {
  return E.left(notImplemented);
}

export function evaluateSGP(program: SGP): InterpreterErrorOr<SGPEvaluationResult> {
  return pipe(
    E.right(program),
    E.chain(expandDiff),
    EE.chainTap(typeCheckModifiers),
    E.chain(evaluate)
  );
}
