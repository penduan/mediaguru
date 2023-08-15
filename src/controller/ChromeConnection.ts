import { EventInstance } from "src/api/common/eventInstance";
import { registerEventDisposable } from "src/api/extension/eventDispatcher";

export class ChromeConnections {

  private _onMessage = new EventInstance();
  public onMessage = this._onMessage.event;
  
  disableConnection: Function;

  protected connects =  new Map<chrome.runtime.Port, Function[]>();

  constructor() {
    this.disableConnection = registerEventDisposable(chrome.runtime.onConnect, this.connectionCallback.bind(this)).dispose;
  }

  private connectionCallback(port: chrome.runtime.Port) {
    this.portInit(port);
    this.addPortListeners(port);

  }

  private portInit(port: chrome.runtime.Port) {
    let connectCallbacks: Function[] = [];
    this.connects.set(port, connectCallbacks);

    connectCallbacks.push(() => this.connects.delete(port));
  }

  private addPortListeners(port: chrome.runtime.Port) {
    let connectCallbacks = this.connects.get(port)!;

    // port onMessage
    connectCallbacks.push(registerEventDisposable(port.onMessage, this.messageCallback.bind(this)).dispose);
    // port onDisconnect
    connectCallbacks.push(registerEventDisposable(port.onDisconnect, this.disconnectPortCallback.bind(this)).dispose);
  }

  private messageCallback(message: MessageObject, port: chrome.runtime.Port) {
    this.onMessage(message, port);
  }

  private disconnectPortCallback(port: chrome.runtime.Port) {
    let currentPort = this.connects.get(port);
    if (currentPort) {
      currentPort.forEach((callback) => callback());
    }
  }

}

