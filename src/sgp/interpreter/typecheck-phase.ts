import * as E from 'fp-ts/Either';

import { DiffPatchedSGP } from './diff-phase';
import { InterpreterErrorOr, notImplemented } from './errors';

export function typeCheckModifiers(program: DiffPatchedSGP): InterpreterErrorOr<void> {
  return E.left(notImplemented);
}
