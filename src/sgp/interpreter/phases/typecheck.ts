import * as E from 'fp-ts/Either';
import * as EE from '../../../utils/either';
import * as RA from 'fp-ts/ReadonlyArray';
import { subsetOf } from '../../../utils/ReadonlySet';

import { DiffPatchedSGP } from './diff-expansion';
import { modifierRequirementFailed, ModifierTypeCheckPhaseError, modifierTypeError } from '../errors';
import { pipe } from 'fp-ts/function';
import { ModifiedShapeDefinition } from '../../definition/SGP';
import { ShapeObjectDefinitionUid } from '../../definition/Uid';
import { outputSpecOfUnknownParameterShape } from '../../definition/Shape';

type TypeCheckErrorOrVoid = E.Either<ModifierTypeCheckPhaseError, void>;

function typeCheckPipeline(def: ModifiedShapeDefinition): TypeCheckErrorOrVoid {
  const { definitionUid: shapeDefinitionUid, shapeObject } = def;

  let overallOutput = outputSpecOfUnknownParameterShape(shapeObject.shape);
  for (const { definitionUid: modifierDefinitionUid, modifier } of shapeObject.modifiers) {
    const output = modifier.outputSpec(overallOutput);
    if (output._tag === 'Left') {
      return E.left(modifierTypeError(shapeDefinitionUid, modifierDefinitionUid));
    } else {
      overallOutput = output.right;
    }
  }

  return E.right(undefined);
}

function typeCheckPipelinesOfProgram(program: DiffPatchedSGP): TypeCheckErrorOrVoid {
  return pipe(
    program,
    RA.traverse(E.Applicative)(typeCheckPipeline),
    EE.as(undefined)
  );
}

function typeCheckModifierRequirements(definitionsSoFar: ReadonlySet<ShapeObjectDefinitionUid>, shape: ModifiedShapeDefinition): TypeCheckErrorOrVoid {
  return pipe(
    shape.shapeObject.modifiers,
    RA.traverse(E.Applicative)(({ definitionUid: modifierDefinitionUid, modifier }) =>
      pipe(
        modifier.partialEvaluationResultRequirements(),
        subsetOf(definitionsSoFar),
        (isSubset: boolean) => isSubset
          ? E.right(undefined)
          : E.left(modifierRequirementFailed(shape.definitionUid, modifierDefinitionUid))
      )
    ),
    EE.as(undefined)
  );
}

function typeCheckModifierRequirementsOfProgram(program: DiffPatchedSGP): TypeCheckErrorOrVoid {
  const definitionsSoFar: Set<ShapeObjectDefinitionUid> = new Set();
  for (const def of program) {
    const checkResult = typeCheckModifierRequirements(definitionsSoFar, def);
    if (checkResult._tag === 'Left') {
      return checkResult;
    } else {
      definitionsSoFar.add(def.definitionUid);
    }
  }

  return E.right(undefined);
}

export function typeCheckModifiers(program: DiffPatchedSGP): TypeCheckErrorOrVoid {
  return pipe(
    E.right(program),
    EE.chainTap(typeCheckModifierRequirementsOfProgram),
    EE.chainTap(typeCheckPipelinesOfProgram),
    EE.as(undefined)
  );
}
