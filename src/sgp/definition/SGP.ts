import { Modifier } from './Modifier';
import { SomeModifierPatch, SomeShapePatch } from './Patch';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import { ModifierDefinitionUid, ShapeObjectDefinitionUid } from './Uid';

export interface ModifierDefinition {
  uid: ModifierDefinitionUid;
  modifier: Modifier;
}

export interface ModifiedShape {
  __kind: 'ModifiedShape';
  shape: Shape<SOPM>;
  modifiers: ReadonlyArray<ModifierDefinition>;
}

export interface TargetedModifierPatch {
  targetModifierUid: ModifierDefinitionUid;
  patch: SomeModifierPatch;
}

export interface SynchronizedShape {
  __kind: 'SynchronizedShape';
  targetDefinitionUid: ShapeObjectDefinitionUid;
  shapePatch: SomeShapePatch;
  modifierPatches: ReadonlyArray<TargetedModifierPatch>
}

export type ShapeObject = ModifiedShape | SynchronizedShape;

export interface ShapeObjectDefinition {
  definitionUid: ShapeObjectDefinitionUid;
  shapeObject: ShapeObject;
}

export type ShapesGeneratorProgram = ReadonlyArray<ShapeObjectDefinition>;

export type SGP = ShapesGeneratorProgram;
