import { Modifier } from './Modifier';
import { SomeModifierPatch, SomeShapePatch } from './Patches';
import { Shape } from './Shape';
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
  readonly modifier: Modifier;
}

export type ModifierPipeline = ReadonlyArray<ModifierDefinition>;

export interface ModifiedShape {
  readonly __kind: 'ModifiedShape';
  readonly shape: Shape<SOPM>;
  readonly modifiers: ModifierPipeline;
}

export interface TargetedModifierPatch {
  readonly targetModifierUid: ModifierDefinitionUid;
  readonly patch: SomeModifierPatch;
}

export interface SynchronizedShape {
  readonly __kind: 'SynchronizedShape';
  readonly targetDefinitionUid: ShapeObjectDefinitionUid;
  readonly shapePatch: SomeShapePatch;
  readonly modifierPatches: ReadonlyArray<TargetedModifierPatch>;
  readonly additionalModifiers: ModifierPipeline;
}

export type ShapeObject = ModifiedShape | SynchronizedShape;

export interface ShapeObjectDefinition<SOBound extends ShapeObject> {
  readonly definitionUid: ShapeObjectDefinitionUid;
  readonly shapeObject: SOBound;
}

export type AnyShapeObjectDefinition = ShapeObjectDefinition<ShapeObject>;

export type ShapesGeneratorProgram = ReadonlyArray<AnyShapeObjectDefinition>;

export type SGP = ShapesGeneratorProgram;
