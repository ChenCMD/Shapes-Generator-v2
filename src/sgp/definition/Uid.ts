import uuid from 'uuidjs';

type Uid = string & { readonly __uid_tag: unique symbol };

const newUid = (): Uid => uuid.generate() as Uid;
const coerceToUid = (str: string): Uid => str as Uid;

export type ModifierDefinitionUid = Uid & {
  readonly __modifier_uid_tag: unique symbol;
};
export const newModifierUid = (): ModifierDefinitionUid =>
  newUid() as ModifierDefinitionUid;
export const coerceToModifierUid = (str: string): ModifierDefinitionUid =>
  coerceToUid(str) as ModifierDefinitionUid;

export type ShapeObjectDefinitionUid = Uid & {
  readonly __shapeobject_uid_tag: unique symbol;
};
export const newShapeObjectUid = (): ShapeObjectDefinitionUid =>
  newUid() as ShapeObjectDefinitionUid;
export const coerceToShapeObjectUid = (str: string): ShapeObjectDefinitionUid =>
  coerceToUid(str) as ShapeObjectDefinitionUid;
