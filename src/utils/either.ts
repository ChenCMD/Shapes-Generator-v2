import * as E from 'fp-ts/Either';

export function as<C>(c: C): <A, B>(ab: E.Either<A, B>) => E.Either<A, C> {
  return <A, B>(ab: E.Either<A, B>) => E.map(() => c)(ab);
}

export function chainTapW<A2, B, C>(f: (b: B) => E.Either<A2, C>): <A>(ab: E.Either<A, B>) => E.Either<A | A2, B> {
  return E.chainW((b: B) => as(b)(f(b)));
}

export function chainTap<A, B, C>(f: (b: B) => E.Either<A, C>): (ab: E.Either<A, B>) => E.Either<A, B> {
  return chainTapW(f);
}
