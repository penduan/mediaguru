import { Deps } from "src/api/common/deps";
import { EventEmitter } from "src/api/common/eventEmitter";
import lg2Module from "wasm/lg2";

export const enum LG2Event {
  blame = 1,
  branch_get,
  clone_process,
  clone_sideband_process,
  config_get,
  git_processor_end,
  log_data,
  ls_files,
  status_short,
  tag_get
}

export class Lg2 extends EventEmitter<LG2Event> {

  depsName = Symbol();

  _Module: TODOType = {};

  constructor(deps?: Deps) {
    super();

    if (deps) deps.addDeps(this.depsName);


    /** callMain end. */
    this._addModuleEvent("onGitProcessorEnd", LG2Event.git_processor_end);

    /** blame command */
    this._addModuleEvent("onBlame", LG2Event.blame);
    
    /** branch command */
    this._addModuleEvent("onBranchGet", LG2Event.branch_get);

    /** clone command */
    this._addModuleEvent("onCloneProcess", LG2Event.clone_process);
    this._addModuleEvent("onCloneSidebandProcess", LG2Event.clone_sideband_process);

    /** config command */
    this._addModuleEvent("onConfigGet", LG2Event.config_get);
    
    /** log command */
    this._addModuleEvent("onLogData", LG2Event.log_data);

    /** ls-files command */
    this._addModuleEvent("onLsFiles", LG2Event.ls_files);

    /** status command */
    this._addModuleEvent("onStatusShort", LG2Event.ls_files);

    /** tag command */
    this._addModuleEvent("onTagGet", LG2Event.ls_files);

    lg2Module(this._Module).then((Module: TODOType) => {
      if (deps) deps.removeDeps(this.depsName);
      this._Module = Module;
    });
  }

  _addModuleEvent(eventName: string, selfEvent: LG2Event) {
    this._Module[eventName] = this.emit.bind(this, selfEvent);
  }

  waitCMD(args: string[]| string) {
    if (typeof args === "string") {
      args = args.split(" ") as string[];
    }

    if (args[0] === "git") {
      args.shift();
    }

    let promise = new Promise((resolve, reject) => {
      this.once(LG2Event.git_processor_end, resolve);

      // TODO quit support. if trigger git_processor_end command resolve success, otherwise rejection.
      // this.once(LG2Event.quit, reject);
    });

    this._Module.callMain(args);

    return promise;

  }

}