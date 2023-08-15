import { binaryInsert, binaryRemove, binarySearch, compareFnLikeCMemcmp } from "./array";
import { ILocalStorage, LocalStorage } from "./storage";


interface IDBIterator {
  /** 检索到seek指向的索引位置 */
  pointer: number,
  /** iterator限制 */
  limit?: number,
}

interface KeyValue {
  key: string,
  value: any,
}

type IteratorPointer = Symbol;
/**
 * # 使用说明
 * 也可以使用`leveldb-wasm`来实现.
 * 由于浏览器的储存底层已经使用了LevelDB/RocksDB实现.
 * 所以在一些场景下,没有必要再使用leveldb-wasm这种接口作为实
 * 现层, 可以依赖浏览器的储存API来实现简单的类LevelDB API操作.
 * 可依赖API(chrome.storage.local,localstorage,IndexedDB)
 */
export class LikeLevelDB {

  /** 储存前缀 */
  private path: string = "";
  private memTable?: string[];

  storageApi: ILocalStorage<any> = new LocalStorage<any>();

  private flushMemtable() {
    this.storageApi.set(this.path, this.memTable);
  }

  async open(path: string) {
    this.path = path;
    this.memTable = [];
    let table = await this.storageApi.get(path);
    if (table && path in table) {
      this.memTable = table[path];
    }
    return this;
  }
  
  async get(key: string | number) {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");
    if (typeof key == "number") {
      key = "" + key;
    }

    if (binarySearch(key, this.memTable) < 0) {
      return undefined;
    } else {
      let result = await this.storageApi.get(key);
      return result![key];
    }
  }

  async put(key: string | number, value: any) {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");

    if (typeof key === "number") {
      key = "" + key;
    }

    binaryInsert(key, this.memTable, compareFnLikeCMemcmp);

    // TODO 是否需要事务支持?
    await this.storageApi.set(key, value);
    await this.flushMemtable();

    return true;
  }

  async remove(key: string | number) {
    if (!this.memTable) throw new Error("First,need to open a database.");

    if (typeof key === "number") {
      key = "" + key;
    }

    this.storageApi.remove(key);
    binaryRemove(key, this.memTable);
    await this.flushMemtable();
    return true;
  }

  createIterator(): IDBIterator {
   return  {
      pointer: 0
    }
  }

  seek(iterator: IDBIterator, start: string) 
  {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");
    let index = binarySearch(start, this.memTable);
    if (index < 0) throw new Error("Unknown key.");
    iterator.pointer = index;
  }

  seekToFirstOrLast(iterator: IDBIterator, toFirst: boolean = true) {
    if (!this.memTable) throw new Error("First,need to open a database.");
    let index = toFirst ? 0 : this.memTable.length - 1;
    iterator.pointer = index;
  }

  async getKeyValue(key: string) {
    let obj = await this.storageApi.get(key);
    let value = obj ? obj[key] : "";
    return { key, value }
  }

  async next(iterator: IDBIterator) {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");
    if (!this.count) return null; 

    if (iterator.pointer >= this.count) return null;

    if (iterator.limit && iterator.limit < iterator.pointer) 
      return null;

    let key = this.memTable[iterator.pointer];
    iterator.pointer++;
    return this.getKeyValue(key);
    
  }
  async prev(iterator: IDBIterator) {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");
    if (!this.count) return null; 
    
    if (iterator.pointer < 0) return null;

    if (iterator.limit && iterator.limit > iterator.pointer) 
      return null;

    let key = this.memTable[iterator.pointer];
    iterator.pointer--;
    return this.getKeyValue(key);
  }

  setIteratorLimit(iterator: IDBIterator, limit: string) {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");

    let keyIndex = binarySearch(limit, this.memTable);

    if (keyIndex > -1) {
      iterator.limit = keyIndex;
    }
  }

  get count() {
    if (this.memTable === undefined) throw new Error("First,need to open a database.");
    return this.memTable.length;
  }

}
