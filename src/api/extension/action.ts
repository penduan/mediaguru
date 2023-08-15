import type { AppAction } from "../common/action";

declare global {
  module globalThis {
    var port: chrome.runtime.Port | undefined;
  }
}


function portPostMessage(port: chrome.runtime.Port, type: string, ...args: any) {
  let msg: MessageObject = {
    data: {
      type,
      value: args
    }
  }
  port.postMessage(msg);
}

const actionHandler = {
  get: (target: object, prop: string) => {
    if (globalThis.port) {
      return portPostMessage.bind(null, globalThis.port, "action." + prop);
    } else {
      return console.log.bind(null, prop);
    }
  }
}


export const extPortAction = new Proxy({}, actionHandler) as AppAction;