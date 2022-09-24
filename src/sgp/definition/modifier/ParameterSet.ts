import { SetVisibilityParameters } from './modifiers/SetVisibility';

export type ModifierParameterSet =
  | SetVisibilityParameters
  | { readonly __parameterKind: never };
