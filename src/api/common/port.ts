import { EventDisposable, IDisposable } from "api/common/disposable";

/**
 * 与chrome.runtime.Port类似 - 用来与其他载体进行链接通讯
 */
export interface IPort extends IDisposable {

  name: string;

  connect: () => boolean;
  reconnect: () => boolean;

  postMessage: (value: MessageObject, other?: any) => boolean;

  disconnect: () => void;

  onmessage?: (msg: MessageObject, port: IPort) => void;
  ondisconnect?: (port: IPort) => void;

}

export interface IPortConstructor {
  new (name: string): IPort;
}

export interface IMiniPort {
  postMessage: (value: MessageObject, other?: any) => boolean;
  dispose: () => void;
}

export function convertToPortInstance<T extends FunctionConstructor>(
  obj: T, 
  port: {
    postMessage: (msg: MessageObject, other?: any) => void
  },
  overrideList: string[]
): any {
  
  let instance = Object.create(obj.prototype);
  overrideList.forEach((name) => {
    instance.__proto__[name] = (...args: any[]) => {
      port.postMessage({
        data: { type: name, value: args }
      });
    }
  });

  return instance;
}

export class WebWorkerPort extends EventDisposable implements IPort {

  constructor(readonly name: string) {
    super();
    this.scriptSrc = name;
  }

  ondisconnect?: ((port: IPort) => void) | undefined;
  onmessage?: (msg: MessageObject, port: IPort) => void;

  scriptSrc= "";

  #worker?: Worker;

  connect() {
    try {
      this.#worker = new Worker(this.scriptSrc);
      this.emit("connected", this.#worker);
    } catch(e) {
      console.error(e);
      return false;
    }

    this.#worker!.onmessage = (ev) => {
      let data = ev.data as MessageObject;
      if (this.onmessage) this.onmessage(data, this);
      else console.error("No register port `onmessage` handler.", this.scriptSrc);
    }

    this.disposable = {
      dispose: () => {
        this.#worker!.onmessage = null;
      }
    }

    return true;
  }

  reconnect() {
    return this.connect();
  }

  get worker() {
    return this.#worker;
  }

  postMessage(msg: MessageObject) {
    if (!this.#worker) this.reconnect();

    try {
      this.#worker!.postMessage(msg);
    } catch(e) {
      console.error("Web worker post message error.", this.name);
      return false;
    }
    return true;
  }

  disconnect() {
    console.info("Destory the current worker.", this.name);
    this.#worker?.terminate();
  }

  dispose() {
    this.disconnect();
  }

}

/** @todo 需要完善 */
export class DefaultPort implements IPort  {
  name = "defaultPort";
  connect() {
    console.warn("calling DefaultPort.prototype.connect().");
    return true; 
  }

  reconnect() {
    console.warn("Calling DefaultPort.prototype.reconnect()");
    return true;
  }

  postMessage(msg: MessageObject) {
    console.warn("Calling DefaultPort.prototype.postMessage() -> ", msg);
    return true;
  }
  
  disconnect() {

  }

  dispose() {}
}