import { Point } from './types/Point';
import { Vector2D } from './types/Vector2D';
import * as E from 'fp-ts/Either';

export function toRadians(degree: number): number {
  return degree * (Math.PI / 180);
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function round(n: number, places = 1): number {
  const base = 10 ** places;
  return Math.round(n * base) / base;
}

export function ceil(n: number, places = 1): number {
  const base = 10 ** places;
  return Math.ceil(n * base) / base;
}

export function floor(n: number, places = 1): number {
  const base = 10 ** places;
  return Math.floor(n * base) / base;
}

export function rotateMatrix2D({ x, y }: Point, rotation: number): Point {
  const radian = toRadians(rotation);
  return {
    x: x * Math.cos(radian) - y * Math.sin(radian),
    y: x * Math.sin(radian) + y * Math.cos(radian)
  };
}

export interface ParameterizedPoint {
  parameter: number;
  point: Vector2D;
}

export type SampleDenselyOptions = {
  maximumRangeGap?: number;
  minimumDomainGap?: number;
};

/**
 * 連続関数 `(xAt, yAt)` の `[0, 1]` 区間上をサンプリングする。
 * 与えられた関数が連続でない場合処理の終了が保証されない。
 *
 * 返される配列 `arr` は以下の性質を満たす：
 *  - `arr` は `t` でソートされている
 *  - `arr` の最初の要素の `t` は `0` で、 最後の要素の `t` は `1` である
 *  - `arr` の隣り合う二要素 `p1`, `p2` は以下の二条件のうちいずれかを満たす：
 *    - 二点間の距離が `maximumRangeGap` よりも小さい
 *    - `p2.t - p1.t < minimumDomainGap`
 */
export function sampleDensely(
  pointAt: (parameter: number) => Vector2D,
  options: SampleDenselyOptions = {}
): ParameterizedPoint[] {
  const maximumRangeGap = options.maximumRangeGap ?? 0.1;
  const minimumDomainGap = options.minimumDomainGap ?? 0.001;

  const sampleAt = (parameter: number): ParameterizedPoint => ({
    parameter,
    point: pointAt(parameter)
  });

  const sufficientlyClose = (p1: ParameterizedPoint, p2: ParameterizedPoint) =>
    (p2.point.x - p1.point.x) ** 2 + (p2.point.y - p1.point.y) ** 2 <
      maximumRangeGap ** 2 ||
    Math.abs(p1.parameter - p2.parameter) < minimumDomainGap;

  const midTOf = (p1: ParameterizedPoint, p2: ParameterizedPoint) =>
    (p1.parameter + p2.parameter) / 2.0;

  const results: ParameterizedPoint[] = [sampleAt(0.0)];
  let nextSampleT: number | undefined = 1.0;
  const sampledAhead: ParameterizedPoint[] = [];

  while (true) {
    const lastResult = results[results.length - 1];

    if (nextSampleT !== undefined) {
      const nextSample = sampleAt(nextSampleT);

      if (sufficientlyClose(lastResult, nextSample)) {
        results.push(nextSample);
        nextSampleT = undefined;
      } else {
        nextSampleT = midTOf(lastResult, nextSample);
        sampledAhead.push(nextSample);
      }
    } else if (sampledAhead.length !== 0) {
      const nextSampleAhead = sampledAhead.pop()!;

      if (sufficientlyClose(lastResult, nextSampleAhead)) {
        results.push(nextSampleAhead);
      } else {
        nextSampleT = midTOf(lastResult, nextSampleAhead);
        sampledAhead.push(nextSampleAhead);
      }
    } else {
      return results;
    }
  }
}

/**
 * {@link pathNodes} で定義されるパス上に {@link interpolatedPoints} 個の
 * 点を、パス上等間隔になるように配置する。
 *
 * @param pathNodes パスを定義する頂点の配列
 * @param interpolatedPoints パス上に配置する点の数。 1 以上である必要がある。
 * @param includeLastEndpoint 点を配置するとき、
 *        {@link pathNodes} の最後の点に重なる点を置くかどうか。
 *        これを `false` に設定すると、{@link interpolatedPoints} を 1 増やし、
 *        {@link includeLastEndpoint} を `false` にし、最後の点を削除したのと
 *        同じ結果が得られる。
 * @returns パス上等間隔になるように配置された点列
 */
export function spreadPointsOverPath(
  pathNodes: Vector2D[],
  interpolatedPoints: number,
  includeLastEndpoint = false
): E.Either<Error, Vector2D[]> {
  type NodeWithDistance = Vector2D & { distance: number };

  if (interpolatedPoints < 1)
    return E.left(
      new Error(
        `interpolatedPoints must be positive, got ${interpolatedPoints}`
      )
    );

  // p1とp2の距離を返す関数
  const distanceBetween = (p1: Vector2D, p2: Vector2D) =>
    Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

  // 各パスノードのdistance(p_iとp_i+1の距離)を計算する即時関数
  const nodesWithDistances = (() => {
    const points: NodeWithDistance[] = [{ ...pathNodes[0], distance: 0.0 }];
    let distanceSoFar = 0.0;
    for (let i = 0; i + 1 < pathNodes.length; i++) {
      distanceSoFar += distanceBetween(pathNodes[i], pathNodes[i + 1]);
      points.push({ ...pathNodes[i + 1], distance: distanceSoFar });
    }
    return points;
  })();

  const linearlyInterpolate = (
    p1: NodeWithDistance,
    p2: NodeWithDistance,
    targetDistance: number
  ) => {
    if (p1.distance === p2.distance) return p1;

    const ratio = (targetDistance - p1.distance) / (p2.distance - p1.distance);

    return {
      x: ratio * (p2.x - p1.x) + p1.x,
      y: ratio * (p2.y - p1.y) + p1.y
    };
  };

  // パスをたどった時の総距離
  const totalDistance =
    nodesWithDistances[nodesWithDistances.length - 1].distance;
  // 点を配置するときの1点辺りの距離
  const distanceCoveredByOneResultPoint =
    totalDistance / (interpolatedPoints + (includeLastEndpoint ? 1 : 0));

  const result: Vector2D[] = [];

  let nodeIndexLowerBound = 0;
  for (let i = 0; i < interpolatedPoints; i++) {
    const targetDistance = distanceCoveredByOneResultPoint * i;

    while (
      nodeIndexLowerBound < nodesWithDistances.length - 2 &&
      nodesWithDistances[nodeIndexLowerBound + 1].distance < targetDistance
    ) {
      nodeIndexLowerBound++;
    }

    const p1 = nodesWithDistances[nodeIndexLowerBound];
    const p2 = nodesWithDistances[nodeIndexLowerBound + 1];
    result.push(linearlyInterpolate(p1, p2, targetDistance));
  }

  return E.right(result);
}
