import { ModifierWithUnknownParameter } from './modifier/ModifierWithUnknownParameters';
import { ModifierPatch, ShapePatch } from './Patches';
import { ShapeWithUnknownParameter } from './shape/ShapeWithUnknownParameters';
import { SOPM } from './SOPM/ShapeObjectPropertyMap';
import { ModifierDefinitionUid, ShapeObjectDefinitionUid } from './Uid';

export type ShapeObjectEvaluationResult = {
  /**
   * どのShapeObjectDefinitionによってこの結果が生成されたかの参照
   */
  readonly originUid: ShapeObjectDefinitionUid;
  readonly output: SOPM;
};
export type SGPEvaluationResult = ReadonlyArray<ShapeObjectEvaluationResult>;

export interface ModifierDefinition {
  readonly definitionUid: ModifierDefinitionUid;
  readonly modifier: ModifierWithUnknownParameter;
}

export type ModifierPipeline = ReadonlyArray<ModifierDefinition>;

export interface ModifiedShape {
  readonly __kind: 'ModifiedShape';
  readonly shape: ShapeWithUnknownParameter;
  readonly modifiers: ModifierPipeline;
}

export interface TargetedModifierPatch {
  readonly targetModifierUid: ModifierDefinitionUid;
  readonly patch: ModifierPatch;
}

export interface SynchronizedShape {
  readonly __kind: 'SynchronizedShape';
  readonly targetDefinitionUid: ShapeObjectDefinitionUid;
  readonly shapePatch: ShapePatch;
  readonly modifierPatches: ReadonlyArray<TargetedModifierPatch>;
  readonly additionalModifiers: ModifierPipeline;
}

export type ShapeObject = ModifiedShape | SynchronizedShape;

export interface ShapeObjectDefinition<SOBound extends ShapeObject> {
  readonly definitionUid: ShapeObjectDefinitionUid;
  readonly shapeObject: SOBound;
}

export type AnyShapeObjectDefinition = ShapeObjectDefinition<ShapeObject>;
export type SynchronizedShapeDefinition = ShapeObjectDefinition<SynchronizedShape>;
export type ModifiedShapeDefinition = ShapeObjectDefinition<ModifiedShape>;

export type ShapesGeneratorProgram = ReadonlyArray<AnyShapeObjectDefinition>;

export type SGP = ShapesGeneratorProgram;
