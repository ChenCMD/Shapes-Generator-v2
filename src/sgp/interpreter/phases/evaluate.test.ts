import * as E from 'fp-ts/lib/Either';
import { ShapeObjectsEvaluationResult } from '../../definition/SGP';
import {
  coerceToModifierUid,
  coerceToShapeObjectUid,
  ShapeObjectDefinitionUid
} from '../../definition/Uid';
import { DiffPatchedSGP } from './diff-expansion';
import { ParameterizedShape } from '../../definition/shape/ParameterizedShape';
import { upcast as upcastShape } from '../../definition/shape/Shape';
import {
  ShapeObjectPropertyMap,
  SOPM
} from '../../definition/SOPM/ShapeObjectPropertyMap';
import { SOPMScheme, sopmSchemeWith } from '../../definition/SOPM/SOPMScheme';
import { declareVisibility } from '../../definition/SOPM/ShapeObjectProperty';
import {
  insufficientSOPMFields,
  ParameterizedModifier
} from '../../definition/modifier/ParameterizedModifier';
import {
  Modifier,
  upcast as upcastModifier
} from '../../definition/modifier/Modifier';
import * as O from 'fp-ts/lib/Option';
import { SGPEvaluationPhaseError } from '../errors';
import {
  EllipseParameters,
  defaultEllipseParameters
} from '../../definition/shape/shapes/Ellipse';
import { SetVisibilityParameters } from '../../definition/modifier/modifiers/SetVisibility';
import { subsetOf } from '../../../util/ReadonlySet';
import { TypeCheckedDiffPatchedSGP, typeCheckModifiers } from './typecheck';
import { evaluate } from './evaluate';

/**
 * テストケースとして与えられる{@link DiffPatchedSGP}が型チェックされているかを確認する
 */
function typecheckOrThrow(program: DiffPatchedSGP): TypeCheckedDiffPatchedSGP {
  const result = typeCheckModifiers(program);

  if (result._tag === 'Left') {
    throw new Error(
      `The given program did not typecheck: ${JSON.stringify(program)}`
    );
  } else {
    return result.right;
  }
}

describe('evaluate', () => {
  interface TestCase {
    program: TypeCheckedDiffPatchedSGP;
  }

  // #region shape definitions
  const invisibleEmptyShape = upcastShape(
    new (class implements ParameterizedShape<EllipseParameters, SOPM> {
      readonly outputSpec = sopmSchemeWith(false, false);
      readonly parameter = defaultEllipseParameters;
      readonly run = (): ShapeObjectPropertyMap => ({
        particlePoints: [],
        visibility: declareVisibility(false),
        angledVertices: null,
        directedEndpoints: null
      });
    })()
  );
  const visibleShapeWithEmptyAngledVertices = upcastShape(
    new (class implements ParameterizedShape<EllipseParameters, SOPM> {
      readonly outputSpec = sopmSchemeWith(true, false);
      readonly parameter = defaultEllipseParameters;
      readonly run = (): ShapeObjectPropertyMap => ({
        particlePoints: [],
        visibility: declareVisibility(true),
        angledVertices: [],
        directedEndpoints: null
      });
    })()
  );
  // #endregion

  // #region modifier definitions
  const fakeSetVisibilityParameters: SetVisibilityParameters = {
    __parameterKind: 'SetVisibility',
    visibility: { __type: 'Visibility', visibility: true }
  };
  const removeAngledVerticesModifier = upcastModifier(
    new (class implements ParameterizedModifier<SetVisibilityParameters> {
      readonly parameters = fakeSetVisibilityParameters;
      readonly outputSpec = (inputScheme: SOPMScheme) =>
        E.right({ ...inputScheme, angledVertices: false });
      readonly partialEvaluationResultRequirements = () => new Set([]);
      readonly run = (
        p: SetVisibilityParameters,
        partialResult: ShapeObjectsEvaluationResult,
        input: ShapeObjectPropertyMap
      ) => O.some({ ...input, angledVertices: null });
    })()
  );

  const angledVerticesModifier = upcastModifier(
    new (class implements ParameterizedModifier<SetVisibilityParameters> {
      readonly parameters = fakeSetVisibilityParameters;
      readonly outputSpec = (inputScheme: SOPMScheme) =>
        inputScheme.angledVertices
          ? E.right(inputScheme)
          : E.left(insufficientSOPMFields(new Set(['angledVertices'])));
      readonly partialEvaluationResultRequirements = () => new Set([]);
      readonly run = (
        p: SetVisibilityParameters,
        partialResult: ShapeObjectsEvaluationResult,
        input: ShapeObjectPropertyMap
      ) => (input.angledVertices !== null ? O.some(input) : O.none);
    })()
  );

  const identityModifierRequiring = (
    requirements: ReadonlySet<ShapeObjectDefinitionUid>
  ): Modifier =>
    upcastModifier(
      new (class implements ParameterizedModifier<SetVisibilityParameters> {
        readonly parameters = fakeSetVisibilityParameters;
        readonly outputSpec = (inputScheme: SOPMScheme) => E.right(inputScheme);
        readonly partialEvaluationResultRequirements = () => requirements;
        readonly run = (
          p: SetVisibilityParameters,
          partialResult: ShapeObjectsEvaluationResult,
          input: ShapeObjectPropertyMap
        ) =>
          subsetOf(new Set(partialResult.map((r) => r.originUid)))(requirements)
            ? O.some(input)
            : O.none;
      })()
    );
  // #endregion

  describe('for a valid patched program', () => {
    const validPrograms: ReadonlyArray<TestCase> = [
      // 空のプログラム
      { program: typecheckOrThrow([]) },
      // 結果要求の無いModifierが一つ付いたshapeが一つだけあるプログラム
      {
        program: typecheckOrThrow([
          {
            definitionUid: coerceToShapeObjectUid('shape 1'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: visibleShapeWithEmptyAngledVertices,
              modifiers: [
                {
                  definitionUid: coerceToModifierUid('mod 1'),
                  modifier: identityModifierRequiring(new Set([]))
                }
              ]
            }
          }
        ])
      },
      // 結果要求が2つめのshapeにあるが、正しく解決されるであろうプログラム
      {
        program: typecheckOrThrow([
          {
            definitionUid: coerceToShapeObjectUid('shape 1'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: visibleShapeWithEmptyAngledVertices,
              modifiers: []
            }
          },
          {
            definitionUid: coerceToShapeObjectUid('shape 2'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: invisibleEmptyShape,
              modifiers: [
                {
                  definitionUid: coerceToModifierUid('mod 1'),
                  modifier: identityModifierRequiring(
                    new Set([coerceToShapeObjectUid('shape 1')])
                  )
                }
              ]
            }
          }
        ])
      }
    ];

    it.each(validPrograms)('must output a Right value for %o', ({ program }) =>
      expect(evaluate(program)._tag).toBe('Right')
    );

    it.each(validPrograms)(
      'must output as many SOPMs as there are definitions for %o',
      ({ program }) => {
        const evalResult = (
          evaluate(program) as E.Right<ShapeObjectsEvaluationResult>
        ).right;
        expect(evalResult.length === validPrograms.length);
      }
    );

    it.each(validPrograms)(
      'must output a SOPM for each object definitions for %o',
      ({ program }) => {
        const evalResult = (
          evaluate(program) as E.Right<ShapeObjectsEvaluationResult>
        ).right;
        const evalResultUids = evalResult.map((r) => r.originUid);

        for (const def of program) {
          expect(evalResultUids.includes(def.definitionUid)).toBe(true);
        }
      }
    );
  });

  describe('for a program with failing requirements', () => {
    const programsWithTypeError: ReadonlyArray<TestCase> = [
      // angledVerticesを要求するModifierがangledVerticesを吐かないshapeについたプログラム
      {
        program: typecheckOrThrow([
          {
            definitionUid: coerceToShapeObjectUid('shape 31'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: invisibleEmptyShape,
              modifiers: [
                {
                  definitionUid: coerceToModifierUid('mod 31'),
                  modifier: angledVerticesModifier
                }
              ]
            }
          }
        ])
      },
      // angledVerticesを消すModifierの後にangledVerticesを要求するModifierが付いたshapeがあるプログラム
      {
        program: typecheckOrThrow([
          {
            definitionUid: coerceToShapeObjectUid('shape 41'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: visibleShapeWithEmptyAngledVertices,
              modifiers: [
                {
                  definitionUid: coerceToModifierUid('mod 41'),
                  modifier: removeAngledVerticesModifier
                },

                {
                  definitionUid: coerceToModifierUid('mod 42'),
                  modifier: angledVerticesModifier
                }
              ]
            }
          }
        ])
      }
    ];

    it.each(programsWithTypeError)(
      'must output a Left value for %o',
      ({ program }) => {
        expect(evaluate(program)._tag).toBe('Left');
      }
    );

    it.each(programsWithTypeError)(
      'must output a pre-eval error for %o',
      ({ program }) => {
        const evalResult = evaluate(program) as E.Left<SGPEvaluationPhaseError>;

        expect(evalResult.left.__kind).toContain('ModifierTypeError');
      }
    );
  });

  describe('for a program with invalid result references', () => {
    const programsWithInvalidResultReferences: ReadonlyArray<TestCase> = [
      // Modifierが自分自身の結果を要求するようなプログラム
      {
        program: typecheckOrThrow([
          {
            definitionUid: coerceToShapeObjectUid('shape 11'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: visibleShapeWithEmptyAngledVertices,
              modifiers: [
                {
                  definitionUid: coerceToModifierUid('mod 11'),
                  modifier: identityModifierRequiring(
                    new Set([coerceToShapeObjectUid('shape 11')])
                  )
                }
              ]
            }
          }
        ])
      },
      // Modifierが存在しない結果を要求するようなプログラム
      {
        program: typecheckOrThrow([
          {
            definitionUid: coerceToShapeObjectUid('shape 21'),
            shapeObject: {
              __kind: 'ModifiedShape',
              shape: visibleShapeWithEmptyAngledVertices,
              modifiers: [
                {
                  definitionUid: coerceToModifierUid('mod 21'),
                  modifier: identityModifierRequiring(
                    new Set([coerceToShapeObjectUid('shape 00')])
                  )
                }
              ]
            }
          }
        ])
      }
    ];

    it.each(programsWithInvalidResultReferences)(
      'must output a Left value for %o',
      ({ program }) => {
        expect(evaluate(program)._tag).toBe('Left');
      }
    );

    it.each(programsWithInvalidResultReferences)(
      'must output a pre-eval error for %o',
      ({ program }) => {
        const evalResult = evaluate(program) as E.Left<SGPEvaluationPhaseError>;

        expect(evalResult.left.__kind).toContain('ModifierRequirementFailed');
      }
    );
  });
});

export {};