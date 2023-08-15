 import { EventEmitter } from "./eventEmitter";

export interface IDisposable {
  dispose: () => void;
}

export class EventDisposable extends EventEmitter<any> {

  static delete(disposable: EventDisposable, key: string) {
    disposable.getDisposables().delete(key);
  }

  static clear(disposeable: EventDisposable) {
    disposeable.getDisposables().clear();
  }
  
  static dispose(disposeable: EventDisposable, id: any) {
    disposeable.getDisposables().get(id)?.dispose();
  }

  private _disposes = new Map<symbol | any, IDisposable>();

  private _currentDisposableId = "";

  setDisposableId(value: any) {
    this._currentDisposableId = value;
  }

  clearDisposableId() {
    this._currentDisposableId = "";
  }

  getDisposable(key: string) {
    return this._disposes.get(key);
  }

  getDisposables() {
    return this._disposes;
  }

  set disposable(disposable: IDisposable) {
    if (this._currentDisposableId) {
      if (this._disposes.has(this._currentDisposableId)) {
        let oldDisposable = this._disposes.get(this._currentDisposableId);
        oldDisposable?.dispose();
      }
      this._disposes.set(this._currentDisposableId, disposable);
    } else {
      let id = Symbol();
      this._disposes.set(id, disposable);
    }

    this.clearDisposableId();
  }

  setDisposable() {
    
  }

  dispose() {
    this._disposes.forEach((item) => {
      item.dispose();
    });
  }

}