import { EventEmitter, DEFAULT_EVENT_NAME } from "./eventEmitter";

let componentInstancesMap_: Map<any, any>;

export class EventInstance extends EventEmitter<"event" | any> {

  static setComponentInstanceMap(map: Map<any, any>) {
    componentInstancesMap_ = map;
  }

  static get event() {
    return new EventInstance().event;
  }

  static get event1() {
    return new EventInstance().event1;
  }
  
  remove(handler: Function) {
    this.off(DEFAULT_EVENT_NAME, handler);
  }

  get event() {
    const that = this;
    return function (...args:any[]) {
      if (typeof args[0] == "function") { 
        that.on(args[0]);
      } else {
        that.fire(...args);
      }
    }
  }

  /**
   * 应用在微信小程序的多实例组件中 - 为了解决多实例的事件触发问题
   */ 
  get event1() {
    const that = this;
    return function(this: any, ...args: any[]) {
      if (typeof args[0] == "function") {
        that.on(args[0]);
      } else {
        if (!componentInstancesMap_.has(this)) return;
        let componentClass = componentInstancesMap_.get(this)!;
        that.fire(componentClass, ...args);
      }
    }
  }
}