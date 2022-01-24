import { ShapeObjectId } from '../definitions/sgl';

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

// #region diff phase のエラー

/**
 * 同期図形の同期対象への参照が正しく行われていない時のエラー。
 */
export interface SyncReferenceIllFormed {
    __kind: 'SyncReferenceIllFormed';
    /**
     * 参照を正しく行っていない同期図形オブジェクトのId
     */
    sourceId: ShapeObjectId;
    reason: IllFormedReferenceReason;
}
export const syncReferenceIllFormed =
    (sourceId: ShapeObjectId, reason: IllFormedReferenceReason): SyncReferenceIllFormed =>
        ({ __kind: 'SyncReferenceIllFormed', sourceId, reason });

/**
 * 同じShapeObjectIdが複数の図形オブジェクト定義に使われてしまっている時のエラー。
 * 
 * diff phase
 */
export interface DuplicateShapeObjectId {
    __kind: 'DuplicateShapeObjectId';
    duplicatedId: ShapeObjectId;
}
export const duplicateShapeObjectId =
    (duplicatedId: ShapeObjectId): DuplicateShapeObjectId =>
        ({ __kind: 'DuplicateShapeObjectId', duplicatedId });

export type DiffPhaseError = SyncReferenceIllFormed | DuplicateShapeObjectId;

// #endregion

export type ModifierTypeCheckPhaseError = never;

export type EvaluationError = never;

export interface NotImplemented {
    __kind: 'NotImplemented';
}

// TODO eliminate this
export const notImplemented: NotImplemented = ({ __kind: 'NotImplemented' });
export type GenericError = NotImplemented;

export type SGLInterpreterError =
    | DiffPhaseError
    | ModifierTypeCheckPhaseError
    | EvaluationError
    | GenericError
    ;
