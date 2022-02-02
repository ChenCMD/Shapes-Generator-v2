import { Modifier } from './Modifier';
import { SomeModifierPatch, SomeShapePatch } from './Patch';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import { Uid } from './Uid';

export interface ModifierDefinition {
  uid: Uid;
  modifier: Modifier;
}

export interface ModifiedShape {
  __kind: 'ModifiedShape';
  shape: Shape<SOPM>;
  modifiers: ReadonlyArray<ModifierDefinition>;
}

export interface TargetedModifierPatch {
  targetModifierUid: Uid;
  patch: SomeModifierPatch;
}

export interface SynchronizedShape {
  __kind: 'SynchronizedShape';
  targetDefinitionUid: Uid
  shapePatch: SomeShapePatch;
  modifierPatches: ReadonlyArray<TargetedModifierPatch>
}

export type ShapeObject = ModifiedShape | SynchronizedShape;

export interface ShapeObjectDefinition {
  definitionUid: Uid;
  shapeObject: ShapeObject;
}

export type ShapesGeneratorProgram = ReadonlyArray<ShapeObjectDefinition>;

export type SGP = ShapesGeneratorProgram;
