import uuid from 'uuidjs';

export type Uid = string & { readonly __uid_tag: unique symbol };

export const newUid = (): Uid => (uuid.generate() as Uid);
export const coerceToUid = (str: string): Uid => (str as Uid);
