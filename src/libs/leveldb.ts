import type { Deps } from "src/api/common/deps";
import { EventEmitter } from "src/api/common/eventEmitter";
import ldbModule from "wasm/leveldb";

export class LevelDB extends EventEmitter<any> {
  depsName = Symbol();

  _Module: TODOType = {};

  constructor(deps?: Deps) {
    super();

    if (deps) deps.addDeps(this.depsName);

    ldbModule(this._Module).then((Module: TODOType) => {
      if (deps) deps.removeDeps(this.depsName);
      this._Module = Module;
    });
  }

  getLevelDB(path: string) {
    return new this._Module['LevelDB']();
  }
}
