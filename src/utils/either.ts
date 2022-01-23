import * as E from 'fp-ts/Either';

export function as<C>(c: C): <A, B>(ab: E.Either<A, B>) => E.Either<A, C> {
    return <A, B>(ab: E.Either<A, B>) => E.map(() => c)(ab);
}

export function chainTap<A, B, C>(f: (b: B) => E.Either<A, C>): (ab: E.Either<A, B>) => E.Either<A, B> {
    return E.chain((b: B) => as(b)(f(b)));
}
