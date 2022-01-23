import { Vector2D } from '../../types/Vector2D';

export interface ParticlePoint {
    position: Vector2D;
    initialVelocity: Vector2D;
}

type SODefinitionEvaluationResult = ParticlePoint[];
export type SGLEvaluationResult = SODefinitionEvaluationResult[];
