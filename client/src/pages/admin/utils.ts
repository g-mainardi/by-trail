import { toRaw } from 'vue';

const toRawIfObject = (val: any) => {
  return typeof val === 'object' && val !== null ? toRaw(val) : val;
};

export const isEqual = (val1: any, val2: any): boolean => {
  // Fast path: simple strict equality for primitives and identical references
  if (val1 === val2) {
    return true;
  }

  // Array check with recursive deep comparison
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) {
      return false;
    }

    return val1.every((item, index) => isEqual(item, val2[index]));
  }

  // Object check (excluding arrays): compare by value, not reference
  if (
    val1 !== null &&
    val2 !== null &&
    typeof val1 === 'object' &&
    typeof val2 === 'object'
  ) {
    // Unwrap proxies for object comparison
    const raw1 = toRawIfObject(val1);
    const raw2 = toRawIfObject(val2);

    return JSON.stringify(raw1) === JSON.stringify(raw2);
  }

  // Fallback: values are not equal
  return false;
};
