export interface AppAction {
  loading:(msg: string) => void;
  hide: () => void;
}

const actionHandler = {
  get: (target: object, prop: string) => {
    return console.log.bind(null, prop);
  }
}

export const defaultAction = new Proxy({}, actionHandler) as AppAction;