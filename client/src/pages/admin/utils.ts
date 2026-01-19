import { toRaw } from 'vue';

const toRawIfObject = (val: any) => {
  return typeof val === 'object' && val !== null ? toRaw(val) : val;
};

export const isEqual = (val1: any, val2: any): boolean => {
  // Simple strict equality for primitives
  const isPrimitiveEqual = val1 === val2;

  // JSON stringify hack for objects (like coords) to compare by value, not reference
  // Unwrap proxies for object comparison
  const isObjectEqual =
    JSON.stringify(toRawIfObject(val1)) === JSON.stringify(toRawIfObject(val2));

  // Array check
  const isArrayEqual: boolean =
    Array.isArray(val1) && Array.isArray(val2)
      ? val1.length === val2.length &&
        val1.every((item, index) => isEqual(item, val2[index]))
      : false;

  return isPrimitiveEqual || isObjectEqual || isArrayEqual;
};
