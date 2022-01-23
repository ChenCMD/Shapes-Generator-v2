export type DiffPhaseError = never;
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
