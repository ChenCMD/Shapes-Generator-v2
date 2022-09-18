import * as E from 'fp-ts/lib/Either';
import { SGPEvaluationResult } from '../definition/SGP';
import { coerceToModifierUid, coerceToShapeObjectUid, ShapeObjectDefinitionUid } from '../definition/Uid';
import { DiffPatchedSGP } from './phases/diff-expansion';
import { Shape } from '../definition/shape/Shape';
import { upcast as upcastShape } from '../definition/shape/ShapeWithUnknownParameters';
import { ShapeObjectPropertyMap, SOPM } from '../definition/SOPM/ShapeObjectPropertyMap';
import { SOPMScheme, sopmSchemeWith } from '../definition/SOPM/SOPMScheme';
import { declareVisibility } from '../definition/SOPM/ShapeObjectProperty';
import { insufficientSOPMFields, Modifier } from '../definition/modifier/Modifier';
import { ModifierWithUnknownParameter, upcast as upcastModifier } from '../definition/modifier/ModifierWithUnknownParameters';
import * as O from 'fp-ts/lib/Option';
import { subsetOf } from '../../utils/ReadonlySet';
import { evaluatePatchedSGP } from './interpreter';
import { SGPEvaluationPhaseError } from './errors';
import { EllipseParameters } from '../definition/shape/shapes/Ellipse';
import { SetVisibilityParameters } from '../definition/modifier/modifiers/SetVisibility';

describe('evaluatePatchedSGP', () => {
  interface TestCase {
    program: DiffPatchedSGP;
  }

  // #region shape definitions
  const fakeEllipseParameters: EllipseParameters = ({
    __parameterKind: 'Ellipse',
    pointCount: 1,
    center: { x: 0, y: 0 },
    semiMajorAxis: 1,
    startAngle: 0,
    eccentricity: 1,
    rotation: 0,
    spreadPointsEvenly: true,  
  });

  const invisibleEmptyShape = upcastShape(new class implements Shape<EllipseParameters, SOPM> {
    readonly outputSpec = sopmSchemeWith(false, false);
    readonly parameter = fakeEllipseParameters;
    readonly run = (): ShapeObjectPropertyMap => ({
      particlePoints: [],
      visibility: declareVisibility(false),
      angledVertices: null,
      directedEndpoints: null
    });
  }());
  const visibleShapeWithEmptyAngledVertices = upcastShape(new class implements Shape<EllipseParameters, SOPM> {
    readonly outputSpec = sopmSchemeWith(true, false); 
    readonly parameter = fakeEllipseParameters;
    readonly run = (): ShapeObjectPropertyMap => ({
      particlePoints: [],
      visibility: declareVisibility(true),
      angledVertices: [],
      directedEndpoints: null
    });
  }());
  // #endregion

  // #region modifier definitions
  const fakeSetVisibilityParameters: SetVisibilityParameters = {
    __parameterKind: 'SetVisibility',
    visibility: { __type: 'Visibility', visibility: true }
  }; 
  const removeAngledVerticesModifier = upcastModifier(new class implements Modifier<SetVisibilityParameters> {
    readonly parameters = fakeSetVisibilityParameters;
    readonly outputSpec = (inputScheme: SOPMScheme) =>
      E.right({ ...inputScheme, angledVertices: false });
    readonly partialEvaluationResultRequirements = () => new Set([]);
    readonly run = (p: SetVisibilityParameters, partialResult: SGPEvaluationResult, input: ShapeObjectPropertyMap) =>
      O.some({ ...input, angledVertices: null });
  }());

  const angledVerticesModifier = upcastModifier(new class implements Modifier<SetVisibilityParameters> {
    readonly parameters = fakeSetVisibilityParameters;
    readonly outputSpec = (inputScheme: SOPMScheme) =>
      inputScheme.angledVertices
      ? E.right(inputScheme)
      : E.left(insufficientSOPMFields(new Set(['angledVertices'])));
    readonly partialEvaluationResultRequirements = () => new Set([]);
    readonly run = (p: SetVisibilityParameters, partialResult: SGPEvaluationResult, input: ShapeObjectPropertyMap) =>
      input.angledVertices !== null
      ? O.some(input)
      : O.none;
  }());

  const identityModifierRequiring = (requirements: ReadonlySet<ShapeObjectDefinitionUid>): ModifierWithUnknownParameter =>
    upcastModifier(new class implements Modifier<SetVisibilityParameters> {
      readonly parameters = fakeSetVisibilityParameters;
      readonly outputSpec = (inputScheme: SOPMScheme) => E.right(inputScheme);
      readonly partialEvaluationResultRequirements = () => requirements;
      readonly run = (p: SetVisibilityParameters, partialResult: SGPEvaluationResult, input: ShapeObjectPropertyMap) =>
        subsetOf(new Set(partialResult.map(r => r.originUid)))(requirements)
        ? O.some(input)
        : O.none;
    }());
  // #endregion

  describe('for a valid patched program', () => {
    const validPrograms: ReadonlyArray<TestCase> = [
      // 空のプログラム
      { program: [] },
      // 結果要求の無いModifierが一つ付いたshapeが一つだけあるプログラム
      { program: [
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
      ] },
      // 結果要求が2つめのshapeにあるが、正しく解決されるであろうプログラム
      { program: [
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
            modifiers: [{
              definitionUid: coerceToModifierUid('mod 1'),
              modifier: identityModifierRequiring(new Set([coerceToShapeObjectUid('shape 1')]))
            }]
          }
        },
      ] }
    ];
    
    it.each(validPrograms)('must output a Right value for %o', ({ program }) =>
      expect(evaluatePatchedSGP(program)._tag).toBe('Right')
    );

    it.each(validPrograms)('must output as many SOPMs as there are definitions for %o', ({ program }) => {
      const evalResult = (evaluatePatchedSGP(program) as E.Right<SGPEvaluationResult>).right;
      expect(evalResult.length === validPrograms.length);
    });

    it.each(validPrograms)('must output a SOPM for each object definitions for %o', ({ program }) => {
      const evalResult = (evaluatePatchedSGP(program) as E.Right<SGPEvaluationResult>).right;
      const evalResultUids = evalResult.map(r => r.originUid);
      
      for (const def of program) {
        expect(evalResultUids.includes(def.definitionUid)).toBe(true);
      }
    });
  });

  describe('for a program with failing requirements', () => {
    const programsWithTypeError: ReadonlyArray<TestCase> = [
      // angledVerticesを要求するModifierがangledVerticesを吐かないshapeについたプログラム
      { program: [
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
      ] },
      // angledVerticesを消すModifierの後にangledVerticesを要求するModifierが付いたshapeがあるプログラム
      { program: [
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
              },
            ]
          }
        }
      ] }
    ];

    it.each(programsWithTypeError)('must output a Left value for %o', ({ program }) => {
      expect(evaluatePatchedSGP(program)._tag).toBe('Left');
    });

    it.each(programsWithTypeError)('must output a pre-eval error for %o', ({ program }) => {
      const evalResult = evaluatePatchedSGP(program) as E.Left<SGPEvaluationPhaseError>;

      expect(evalResult.left.__kind).toContain('ModifierTypeError');
    });
  });

  describe('for a program with invalid result references', () => {
    const programsWithInvalidResultReferences: ReadonlyArray<TestCase> = [
      // Modifierが自分自身の結果を要求するようなプログラム
      { program: [
        {
          definitionUid: coerceToShapeObjectUid('shape 11'),
          shapeObject: {
            __kind: 'ModifiedShape',
            shape: visibleShapeWithEmptyAngledVertices,
            modifiers: [
              {
                definitionUid: coerceToModifierUid('mod 11'),
                modifier: identityModifierRequiring(new Set([coerceToShapeObjectUid('shape 11')]))
              }
            ]
          }
        },
      ] },
      // Modifierが存在しない結果を要求するようなプログラム
      { program: [
        {
          definitionUid: coerceToShapeObjectUid('shape 21'),
          shapeObject: {
            __kind: 'ModifiedShape',
            shape: visibleShapeWithEmptyAngledVertices,
            modifiers: [
              {
                definitionUid: coerceToModifierUid('mod 21'),
                modifier: identityModifierRequiring(new Set([coerceToShapeObjectUid('shape 00')]))
              }
            ]
          }
        },
      ] },
    ];

    it.each(programsWithInvalidResultReferences)('must output a Left value for %o', ({ program }) => {
      expect(evaluatePatchedSGP(program)._tag).toBe('Left');
    });

    it.each(programsWithInvalidResultReferences)('must output a pre-eval error for %o', ({ program }) => {
      const evalResult = evaluatePatchedSGP(program) as E.Left<SGPEvaluationPhaseError>;

      expect(evalResult.left.__kind).toContain('ModifierRequirementFailed');
    });
  });
});

export {};
