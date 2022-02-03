import { Modifier } from './Modifier';
import { SomeModifierPatch, SomeShapePatch } from './Patch';
import { Shape } from './Shape';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import { ModifierDefinitionUid, ShapeObjectDefinitionUid } from './Uid';

export interface ModifierDefinition {
  readonly uid: ModifierDefinitionUid;
  readonly modifier: Modifier;
}

export interface ModifiedShape {
  readonly __kind: 'ModifiedShape';
  readonly shape: Shape<SOPM>;
  readonly modifiers: ReadonlyArray<ModifierDefinition>;
}

export interface TargetedModifierPatch {
  readonly targetModifierUid: ModifierDefinitionUid;
  readonly patch: SomeModifierPatch;
}

export interface SynchronizedShape {
  readonly __kind: 'SynchronizedShape';
  readonly targetDefinitionUid: ShapeObjectDefinitionUid;
  readonly shapePatch: SomeShapePatch;
  readonly modifierPatches: ReadonlyArray<TargetedModifierPatch>
}

export type ShapeObject = ModifiedShape | SynchronizedShape;

export interface ShapeObjectDefinition {
  readonly definitionUid: ShapeObjectDefinitionUid;
  readonly shapeObject: ShapeObject;
}

export type ShapesGeneratorProgram = ReadonlyArray<ShapeObjectDefinition>;

export type SGP = ShapesGeneratorProgram;
