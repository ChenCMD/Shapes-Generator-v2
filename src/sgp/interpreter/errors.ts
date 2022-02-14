import * as E from 'fp-ts/Either';

import { ModifierDefinitionUid, ShapeObjectDefinitionUid } from '../definition/Uid';

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
export const syncReferenceIllFormed =
  (sourceId: ShapeObjectDefinitionUid, reason: IllFormedReferenceReason): SyncReferenceIllFormed =>
    ({ __kind: 'SyncReferenceIllFormed', sourceId, reason });

/**
* 同じShapeObjectIdが複数の図形オブジェクト定義に使われてしまっている時のエラー。
*/
export interface DuplicateShapeObjectUid {
  readonly __kind: 'DuplicateShapeObjectUid';
  readonly duplicatedId: ShapeObjectDefinitionUid;
}
export const duplicateShapeObjectUid =
  (duplicatedId: ShapeObjectDefinitionUid): DuplicateShapeObjectUid =>
    ({ __kind: 'DuplicateShapeObjectUid', duplicatedId });

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
export const duplicateModifierUid =
  (duplicatedModifierUid: ModifierDefinitionUid, modifierOwnerUid: ShapeObjectDefinitionUid, when: WhenWasModifierUidDuplicated): DuplicateModifierUid =>
    ({ __kind: 'DuplicateModifierUid', duplicatedModifierUid, modifierOwnerUid, when });

export type DiffExpansionPhaseError =
  | SyncReferenceIllFormed
  | DuplicateShapeObjectUid
  | DuplicateModifierUid
  ;

// #endregion

// #region typecheck phase のエラー

export type ModifierTypeCheckPhaseError = never;

// #endregion

// #region evaluate phase のエラー

export interface ModifierReturnedNoneWhenEvaluated {
  readonly __kind: 'ModifierReturnedNoneWhenEvaluated';
  readonly ownerShapeObjectUid: ShapeObjectDefinitionUid;
  readonly modifierUid: ModifierDefinitionUid;
}

export const modifierReturnedNoneWhenEvaluated =
  (ownerShapeObjectUid: ShapeObjectDefinitionUid, modifierUid: ModifierDefinitionUid): ModifierReturnedNoneWhenEvaluated =>
    ({ __kind: 'ModifierReturnedNoneWhenEvaluated', ownerShapeObjectUid, modifierUid });

export type EvaluationError =
  | ModifierReturnedNoneWhenEvaluated
  ;

// #endregion

export interface NotImplemented {
    __kind: 'NotImplemented';
}

// TODO eliminate this
export const notImplemented: NotImplemented = ({ __kind: 'NotImplemented' });
export type GenericError = NotImplemented;

export type SGPInterpreterError =
  | DiffExpansionPhaseError
  | ModifierTypeCheckPhaseError
  | EvaluationError
  | GenericError
  ;

export type InterpreterErrorOr<A> = E.Either<SGPInterpreterError, A>;
