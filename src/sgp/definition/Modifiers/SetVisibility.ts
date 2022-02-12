import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { InsufficientSOPMFields, Modifier } from '../Modifier';
import { patchForUnaryClass } from '../../../utils/ClassPatch';
import { ShapeObjectPropertyMap } from '../SOPM/ShapeObjectPropertyMap';
import { SOPMScheme } from '../SOPM/SOPMScheme';

export type SetVisibilityParameters = {
  readonly visibility: boolean
};

export class SetVisibilityModifier implements Modifier {
  readonly params: SetVisibilityParameters;
  constructor(params: SetVisibilityParameters) {
    this.params = params;
  }

  readonly outputSpec = (onInput: SOPMScheme): E.Either<InsufficientSOPMFields, SOPMScheme> =>
    E.right(onInput);
  readonly run = (input: ShapeObjectPropertyMap): O.Option<ShapeObjectPropertyMap> => 
    O.some(Object.assign({}, input, { visibility: this.params.visibility }));
}

export const SetVisibilityPatch = patchForUnaryClass(SetVisibilityModifier, t => t.params);
