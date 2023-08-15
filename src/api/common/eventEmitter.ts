export const DEFAULT_EVENT_NAME = "default.event";

export class EventEmitter<T> {

  protected _events = new Map< T | "default.event" | number, { handler: Function, once: boolean}[] | undefined>();
  
  hold: boolean = false;

  emit(eventName: T | "default.event" | number, ...args: any[]) {
    const eventHandlers = this._events.get(eventName);

    if (!this.hold && eventHandlers) {
      eventHandlers.forEach((eventObj) => {
        eventObj.handler(...args);
        if (eventObj.once) eventObj.handler = () => {}
      });
    }
  }

  fire(...args: any[]) {
    this.emit(DEFAULT_EVENT_NAME, ...args);
  }

  off(eventName: T, handler?: Function) {
    const hasEventHandler = this._events.has(eventName);
    if (!hasEventHandler) return;
    if (!handler) this._events.delete(eventName);

    const eventHandlers = this._events.get(eventName)!;
    this._events.set(eventName, eventHandlers.filter(eventObj => eventObj.handler !== handler));
  }

  offAll() {
    this._events.clear();
  }

  on(event: Function, handler?: Function): void;
  on(eventName: T , handler: Function): void;
  on(something: T | Function, handler: Function, once: boolean): void
  on(something: any, handler?: Function, once: boolean = false): void {
    let eventHandlers: {handler: Function, once: boolean}[];
    let eventName;
    if (typeof something === "string" || typeof something === "number") {
      eventName = something;
    } else {
      eventName = DEFAULT_EVENT_NAME;
      handler = something;
    }

    eventHandlers = this._events.get(eventName as any) || [];
    eventHandlers.push({handler: handler || (() => {}), once: !!once});
    this._events.set(eventName as any, eventHandlers);
    
  }

  once(event: Function, handler?: Function): void;
  once(eventName: T | string | number, handler: Function): void;
  once(something: any, handler: Function = () => {}): void {
    this.on(something, handler, true);
  }
}