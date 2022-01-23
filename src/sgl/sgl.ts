import { newUid, Uid } from './uid';

export type RawParameterValue = number | string;
export type OpaqueParameterSet = { [parameterName: string]: RawParameterValue };

// #region shape definitions
export type ShapeKind = 'ellipse' | 'ellipseInscribedPolygon' | 'lineSegment';

export interface Shape {
    readonly shapeKind: ShapeKind;
    readonly parameters: OpaqueParameterSet;
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

export interface Modifier {
    readonly modifierKind: Modifier;
    readonly parameters: OpaqueParameterSet;
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
    readonly paramDiffs: OpaqueParameterSet;
}

export interface ModifierDiff {
    readonly target: ModifierDefinitionId;
    readonly paramDiffs: OpaqueParameterSet;
}
// #endregion

// #region ShapeObject definitions
export interface ShapeObject {
    readonly __kind: 'synchronized' | 'modifiedShape';
}

export interface SynchronizedShapeObject extends ShapeObject {
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
// #endregion

export type ShapeObjectId = Uid & { readonly __SOIDTag: unique symbol };
export const newShapeObjectId = (): ShapeObjectId => (newUid() as ShapeObjectId);
export const coerceToShapeObjectId = (uid: Uid): ShapeObjectId => (uid as ShapeObjectId);

export interface ShapeObjectDefinition {
    id: ShapeObjectId;
    shapeObject: ShapeObject;
}

export type ShapesGeneratorLanguageProgram = ShapeObjectDefinition[];
