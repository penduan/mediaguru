
/**
 * 
 * 实现一个键表的二分查找/插入算法
 * 方便针对时序数据查找遍历和找个
 */


export type ICompareFn<T> = (a: T, b: T) => 1 | 0 | -1;

/**
 * @see https://github.com/google/closure-library/blob/master/closure/goog/array/array.js
 * @returns Found index,otherwise return search ended index(negative number).
 */
export function binarySearch<T extends Object>(searchStr: T, orderedArray: T[], compareFn?: ICompareFn<T>
): number {
  if (!compareFn) {
    compareFn = (a: T, b: T) => a.toString().localeCompare("" + b) as 1 | 0 | -1;
  }

  let left = 0;
  let right = orderedArray.length;
  let found;

  while(left < right) {
    const middle = left + ((right - left) >>> 1);
    let compareResult = compareFn(searchStr, orderedArray[middle]);
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }

  return  found ? left : -left - 1;
}

export function binaryInsert<T extends Object>(insertStr: T, orderedArray: T[], compareFn?: ICompareFn<T>
): boolean {

  const foundIndex = binarySearch(insertStr, orderedArray, compareFn);
  if (foundIndex < 0) { // Not found.
    orderedArray.splice(Math.abs(foundIndex) - 1, 0, insertStr);
  }
  return true;
}

export function binaryRemove<T extends Object>(removeStr: T, orderedArray: T[]) {
  const foundIndex = binarySearch(removeStr, orderedArray);
  if (foundIndex < 0) return; // Nothing.
  orderedArray.splice(foundIndex, 1);
  return;
}

/** 结束位置包含自身 */
export function binarySlice<T extends Object>(start: T, end: T, orderedArray: T[], compareFn?: ICompareFn<T>) {
  let foundStart = binarySearch(start, orderedArray, compareFn);
  if (foundStart < 0) {
    console.warn("Used an uncached key for 'start' argument.");
    foundStart = 0;
  }

  let foundEnd = binarySearch(end, orderedArray, compareFn);
  if (foundEnd < 0) {
    console.warn("Used an uncached key for 'end' argument.");
    foundEnd = orderedArray.length;
  } else {// 包含自身
    foundEnd += 1;
  }

  return orderedArray.slice(foundStart, foundEnd);
}

// TODO 在miniprogram环境中没有TextEncoder对象，需要适配。
const textEncoder = new TextEncoder();

/**
 * 数据转换会是一个耗时操作
 * 在未做任何优化/特殊对待的情况下运行`npm test`比较:
 *    insert data count: ~2000.
 *    - a.localeCompare(b) -> ~11ms
 *    - this(): ~58ms
 * @todo 模型是否需要完善,能否满足当前的使用场景?
 */
export function compareFnLikeCMemcmp<T>(a: T, b: T) {
  let newA: Uint8Array | Array<number>;
  let newB: Uint8Array | Array<number>;

  if (typeof a === "string" && typeof b === "string") {
    newA = textEncoder.encode(a);
    newB = textEncoder.encode(b);
  } else {
    newA = new Uint8Array(a as Array<number>);
    newB = new Uint8Array(b as Array<number>);
  }

  const minLen = Math.min(newA.byteLength, newB.byteLength);

  for (let i = 0; i < minLen; i++) {
    if (newA[i] < newB[i]) {
      return  -1;
    } else if (newA[i] > newB[i]) {
      return 1;      
    }
  }

  if (newA.byteLength < newB.byteLength) {
    return -1;
  } else if (newA.byteLength > newB.byteLength) {
    return 1;
  }
  
  return 0;
}


