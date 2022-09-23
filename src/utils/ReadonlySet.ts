/**
 * 第一パラメータが第二パラメータを包含しているかを判定する。
 */
export const subsetOf =
  <A>(as: ReadonlySet<A>) =>
  <B extends A>(bs: ReadonlySet<B>): boolean => {
    for (const b of bs) {
      if (!as.has(b)) {
        return false;
      }
    }
    return true;
  };
