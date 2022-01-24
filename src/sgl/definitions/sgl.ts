import { newUid, Uid } from './uid';

export type OpaqueParameterSet<P> = { [parameterName: string]: P };

// #region shape definitions
export type ShapeKind = 'ellipse' | 'ellipseInscribedPolygon' | 'lineSegment';
export type RawShapeParameterValue = number | string | boolean;
export type ShapeParameterSet = OpaqueParameterSet<RawShapeParameterValue>;

export interface Shape {
    readonly shapeKind: ShapeKind;
    readonly parameters: ShapeParameterSet;
}
// #endregion

// #region modifier definitions
export type ModifierKind =
    | 'applyInitialVelocities'
    | 'setVisibility'
    | 'deletePoints'
    | 'affineTransform'
    | 'replicateOtherOriginAtParticlePoints'
    | 'replicateOtherOriginAtAngledVertices'
    | 'replicateInitialPointAtOtherParticlePoints'
    ;

export type RawModifierParameterValue = number | string | boolean;
export type ModifierParameterSet = OpaqueParameterSet<RawModifierParameterValue>;

export interface Modifier {
    readonly modifierKind: ModifierKind;
    readonly parameters: ModifierParameterSet;
}

export type ModifierDefinitionId = Uid & { readonly __SOIDTag: unique symbol };
export const newModifierId = (): ModifierDefinitionId => (newUid() as ModifierDefinitionId);
export const coerceToModifierId = (uid: Uid): ModifierDefinitionId => (uid as ModifierDefinitionId);

export interface ModifierDefinition {
    readonly id: ModifierDefinitionId;
    readonly modifier: Modifier;
}
// #endregion

// #region ShapeObject diff definitions
export interface ShapeDiff {
    readonly paramDiffs: ShapeParameterSet;
}

export interface ModifierDiff {
    readonly target: ModifierDefinitionId;
    readonly paramDiffs: ModifierParameterSet;
}
// #endregion

// #region ShapeObject definitions
export interface SynchronizedShapeObject {
    readonly __kind: 'synchronized';
    readonly uid: ShapeObjectId;

    readonly shapeDiff: ShapeDiff;
    readonly modifierDiffs: ModifierDiff[];
}

export interface ModifiedShapeObject {
    readonly __kind: 'modifiedShape';
    readonly shape: Shape;
    readonly modifierDefinitions: ModifierDefinition[];
}

export type ShapeObject = SynchronizedShapeObject | ModifiedShapeObject;

export type ShapeObjectId = Uid & { readonly __SOIDTag: unique symbol };
export const newShapeObjectId = (): ShapeObjectId => (newUid() as ShapeObjectId);
export const coerceToShapeObjectId = (uid: Uid): ShapeObjectId => (uid as ShapeObjectId);

export interface ShapeObjectDefinition<O extends ShapeObject> {
    id: ShapeObjectId;
    shapeObject: O;
}
// #endregion

/**
 * UIから入力される、Shapes Generator Language のプログラム。
 * これらは図形オブジェクト定義の列である。
 */
export type SGLProgram = ShapeObjectDefinition<ShapeObject>[];
