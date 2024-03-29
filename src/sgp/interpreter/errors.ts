import * as E from 'fp-ts/Either';

import {
  ModifierDefinitionUid,
  ShapeObjectDefinitionUid
} from '../definition/Uid';

// #region diff phase のエラー

/**
 * 図形オブジェクトへの参照がなぜ正しくないかの理由。
 *
 * 図形オブジェクトへの参照は同期図形にもmodifierのパラメータにも現れるが、
 * いずれの場合においても、参照が不正な理由は
 *  - 前方参照(まだ定義されていない図形オブジェクトを参照)しているか
 *  - 存在しない図形オブジェクトを参照しているか
 *
 * のどちらかである。
 */
export type IllFormedReferenceReason = 'forwardReference' | 'notFound';

/**
 * 同期図形の同期対象への参照が正しく行われていない時のエラー。
 */
export interface SyncReferenceIllFormed {
  readonly __kind: 'SyncReferenceIllFormed';
  /**
   * 参照を正しく行っていない同期図形オブジェクトの Uid
   */
  readonly sourceId: ShapeObjectDefinitionUid;
  readonly reason: IllFormedReferenceReason;
}
export const syncReferenceIllFormed = (
  sourceId: ShapeObjectDefinitionUid,
  reason: IllFormedReferenceReason
): SyncReferenceIllFormed => ({
  __kind: 'SyncReferenceIllFormed',
  sourceId,
  reason
});

/**
 * 同じShapeObjectIdが複数の図形オブジェクト定義に使われてしまっている時のエラー。
 */
export interface DuplicateShapeObjectUid {
  readonly __kind: 'DuplicateShapeObjectUid';
  readonly duplicatedId: ShapeObjectDefinitionUid;
}
export const duplicateShapeObjectUid = (
  duplicatedId: ShapeObjectDefinitionUid
): DuplicateShapeObjectUid => ({
  __kind: 'DuplicateShapeObjectUid',
  duplicatedId
});

/**
 * どの段階でModifierのUidが重複していたか。
 *  - `'onInput'` の場合、入力されたプログラムの `shapeObject` の内一つが、
 *  - `'afterExpansion'` の場合、展開後の `shapeObject` の内一つが、
 * 二つの異なるModifierで同じUidを持つものを含んでいたことを示す。
 */
export type WhenWasModifierUidDuplicated = 'onInput' | 'afterExpansion';

export interface DuplicateModifierUid {
  readonly __kind: 'DuplicateModifierUid';
  readonly duplicatedModifierUid: ModifierDefinitionUid;
  readonly modifierOwnerUid: ShapeObjectDefinitionUid;
  readonly when: WhenWasModifierUidDuplicated;
}
export const duplicateModifierUid = (
  duplicatedModifierUid: ModifierDefinitionUid,
  modifierOwnerUid: ShapeObjectDefinitionUid,
  when: WhenWasModifierUidDuplicated
): DuplicateModifierUid => ({
  __kind: 'DuplicateModifierUid',
  duplicatedModifierUid,
  modifierOwnerUid,
  when
});

export interface ShapePatchUnapplicable {
  readonly __kind: 'ShapePatchUnapplicable';
  readonly patchedShapeObjectUid: ShapeObjectDefinitionUid;
  readonly patchShapeObjectUid: ShapeObjectDefinitionUid;
}
export const shapePatchUnapplicable = (
  patchedShapeObjectUid: ShapeObjectDefinitionUid,
  patchShapeObjectUid: ShapeObjectDefinitionUid
): ShapePatchUnapplicable => ({
  __kind: 'ShapePatchUnapplicable',
  patchedShapeObjectUid,
  patchShapeObjectUid
});

export interface ModifierPatchUnapplicable {
  readonly __kind: 'ModifierPatchUnapplicable';
  readonly patchedShapeObjectUid: ShapeObjectDefinitionUid;
  readonly patchedModifierUid: ModifierDefinitionUid;
  readonly patchShapeObjectUid: ShapeObjectDefinitionUid;
}
export const modifierPatchUnapplicable = (
  patchedShapeObjectUid: ShapeObjectDefinitionUid,
  patchedModifierUid: ModifierDefinitionUid,
  patchShapeObjectUid: ShapeObjectDefinitionUid
): ModifierPatchUnapplicable => ({
  __kind: 'ModifierPatchUnapplicable',
  patchedShapeObjectUid,
  patchedModifierUid,
  patchShapeObjectUid
});

export interface ModifierPatchTargetNotFound {
  readonly __kind: 'ModifierPatchTargetNotFound';
  readonly patchTarget: ModifierDefinitionUid;
  readonly patchSource: ShapeObjectDefinitionUid;
}
export const modifierPatchTargetNotFound = (
  patchTarget: ModifierDefinitionUid,
  patchSource: ShapeObjectDefinitionUid
): ModifierPatchTargetNotFound => ({
  __kind: 'ModifierPatchTargetNotFound',
  patchTarget,
  patchSource
});

export type DiffExpansionPhaseError =
  | SyncReferenceIllFormed
  | DuplicateShapeObjectUid
  | DuplicateModifierUid
  | ShapePatchUnapplicable
  | ModifierPatchUnapplicable
  | ModifierPatchTargetNotFound;

// #endregion

// #region typecheck phase のエラー

export interface ModifierTypeError {
  readonly __kind: 'ModifierTypeError';
  readonly shapeObjectDefinitionUid: ShapeObjectDefinitionUid;
  readonly modifierDefinitionUid: ModifierDefinitionUid;
}
export const modifierTypeError = (
  shapeObjectDefinitionUid: ShapeObjectDefinitionUid,
  modifierDefinitionUid: ModifierDefinitionUid
): ModifierTypeError => ({
  __kind: 'ModifierTypeError',
  shapeObjectDefinitionUid,
  modifierDefinitionUid
});

export interface ModifierRequirementFailed {
  readonly __kind: 'ModifierRequirementFailed';
  readonly shapeObjectDefinitionUid: ShapeObjectDefinitionUid;
  readonly modifierDefinitionUid: ModifierDefinitionUid;
}
export const modifierRequirementFailed = (
  shapeObjectDefinitionUid: ShapeObjectDefinitionUid,
  modifierDefinitionUid: ModifierDefinitionUid
): ModifierRequirementFailed => ({
  __kind: 'ModifierRequirementFailed',
  shapeObjectDefinitionUid,
  modifierDefinitionUid
});

export type ModifierTypeCheckPhaseError =
  | ModifierTypeError
  | ModifierRequirementFailed;

// #endregion

// #region evaluate phase のエラー

export interface ModifierReturnedNoneWhenEvaluated {
  readonly __kind: 'ModifierReturnedNoneWhenEvaluated';
  readonly ownerShapeObjectUid: ShapeObjectDefinitionUid;
  readonly modifierUid: ModifierDefinitionUid;
}

export const modifierReturnedNoneWhenEvaluated = (
  ownerShapeObjectUid: ShapeObjectDefinitionUid,
  modifierUid: ModifierDefinitionUid
): ModifierReturnedNoneWhenEvaluated => ({
  __kind: 'ModifierReturnedNoneWhenEvaluated',
  ownerShapeObjectUid,
  modifierUid
});

export type EvaluationError = ModifierReturnedNoneWhenEvaluated;

// #endregion

export type SGPEvaluationPhaseError =
  | ModifierTypeCheckPhaseError
  | EvaluationError;

export type SGPEvaluationPhaseErrorOr<A> = E.Either<SGPEvaluationPhaseError, A>;
