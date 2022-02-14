import * as E from 'fp-ts/Either';
import * as EE from '../../utils/either';

import { pipe } from 'fp-ts/function';
import { SGP, SGPEvaluationResult } from '../definition/SGP';
import { InterpreterErrorOr } from './errors';
import { expandDiff } from './diff-phase';
import { evaluate } from './eval-phase';
import { typeCheckModifiers } from './typecheck-phase';

export function evaluateSGP(program: SGP): InterpreterErrorOr<SGPEvaluationResult> {
  return pipe(
    E.right(program),
    E.chain(expandDiff),
    EE.chainTap(typeCheckModifiers),
    E.chain(evaluate)
  );
}
