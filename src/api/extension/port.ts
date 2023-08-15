import { IPort } from "src/api/common/port";
import { registerEventDisposable } from "./eventDispatcher";
import { EventDisposable } from "../common/disposable";

/**
 * Browser extension connection port.
 */
export class ExtensionPort extends EventDisposable implements IPort {

  #port?: chrome.runtime.Port;

  ondisconnect?: ((port: IPort) => void) | undefined;
  onmessage?: (msg: MessageObject, port: IPort) => void;
  
  constructor(readonly name: string) {
    super();
  }

  connect() {
    try {
      this.#port = chrome.runtime.connect(this.name);
    } catch(e) {
      console.error(e);
      return false;
    }

    this.registerEvent();

    return true;
  }

  registerEvent() {
    this.disposable = registerEventDisposable(this.#port!.onMessage, (msg: MessageObject, port) => {  
      if (this.onmessage) this.onmessage(msg, this); 
      else console.error("No register port `onmessage` handler.", this.name);
    });

    this.disposable = registerEventDisposable(this.#port!.onDisconnect, (port) => {
      this.#port = undefined;
      if (this.ondisconnect) this.ondisconnect(this);
    });
  }

  reconnect() {
    return this.connect();
  }

  postMessage(msg: MessageObject) {
    if (!this.#port) this.reconnect();

    try {
      this.#port!.postMessage(msg);
    } catch(e) {
      console.error(e);
      return false;
    }

    return true;
  }

  protected setPort(port: chrome.runtime.Port) {
    this.#port = port;
    this.registerEvent();
  }

  disconnect() {
    this.#port?.disconnect();
  }

  dispose() {
    this.disconnect();
  }

  static Instance(port: chrome.runtime.Port) {
    return new PortInstance(port);
  }
}

export class PortInstance extends ExtensionPort {
  constructor(port: chrome.runtime.Port) {
    super(port.name);
    this.setPort(port);
  }

  reconnect() {
    console.warn("Port instance not support reconnect!");
    return false;
  }
}