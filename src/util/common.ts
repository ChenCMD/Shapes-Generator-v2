export function camelCaseToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function toFracString(n: number | string): string {
  const str = String(n);
  const match = str.match(
    /^([+-]?)0*((?:[1-9][0-9]*)?)(?:\.([0-9]*[1-9]|)0*)?(?:[eE]([+-]?[0-9]+))?$/
  );
  if (!match) {
    if (typeof n === 'number') {
      return str;
    } else {
      throw new Error(`Invalid Number: "${str}"`);
    }
  }

  const sign = match[1] === '-' ? '-' : '';
  const mantissa_int = match[2];
  const mantissa_frac = match[3] || '';
  const exponent = Number(match[4]);

  const mkResponse = (res: string) =>
    sign +
    res
      .replace(/^0(?:(?!\.|$))+/, '')
      .replace(/(?:\.0+|(\.[0-9]*[1-9])0+)$/, '$1');
  if (exponent) {
    if (mantissa_int.length <= 0) {
      return '0';
    }

    const mantissa_str = mantissa_int + mantissa_frac;
    const mantissa_int_len = mantissa_int.length + exponent;
    if (mantissa_int.length <= mantissa_int_len) {
      return mkResponse(mantissa_str.padEnd(mantissa_int_len, '0'));
    }
    if (mantissa_int_len > 0) {
      return mkResponse(
        `${mantissa_str.slice(0, mantissa_int_len)}.${mantissa_str.slice(
          mantissa_int_len
        )}`
      );
    }
    return mkResponse(`0.${'0'.repeat(-mantissa_int_len)}${mantissa_str}`);
  }
  if (mantissa_frac) {
    return mkResponse(`${mantissa_int || '0'}.${mantissa_frac}`);
  }
  if (mantissa_int) {
    return mkResponse(mantissa_int);
  }
  return '0';
}

export function objEntries<K extends PropertyKey, V>(obj: { [k in K]: V }): [
  K,
  V
][] {
  const res: [K, V][] = [];
  for (const k of Object.getOwnPropertyNames(obj) as K[]) {
    res.push([k, obj[k]]);
  }
  return res;
}

export function reverseObjProperty<T extends { [k in PropertyKey]: unknown }>(
  obj: T
): T {
  for (const k of Object.getOwnPropertyNames(obj) as (keyof T)[]) {
    if (typeof obj[k] === 'number') {
      obj[k] = -obj[k] as T[keyof T];
    }
  }
  return obj;
}

// export function reasonShowPropsAreEqual<P extends { [k: string]: unknown }>(prevProps: Readonly<P>, nextProps: Readonly<P>): boolean {
//     for (const k of Object.keys(prevProps) as (keyof P)[]) {
//         if (!Object.is(prevProps[k], nextProps[k])) {
//             console.log('ReRender curse:', k, '|', prevProps[k], '=>', nextProps[k]);
//             return false;
//         }
//     }
//     return true;
// }
