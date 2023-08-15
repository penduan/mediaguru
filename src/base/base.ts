import { EventEmitter } from "api/common/eventEmitter";
import logManager, { DEV } from "../devConfig";

export enum InstanceType {
  App,
  Page,
  Component,
  ComponentPage,
  Behavior
}

export const InstanceName: Record<InstanceType, string> = {
  [InstanceType.App]: "App",
  [InstanceType.Page]: "Page",
  [InstanceType.Component]: "Component",
  [InstanceType.ComponentPage]: "ComponentPage",
  [InstanceType.Behavior]: "Behavior"
}

export type AppEventType = "onLaunch" 
  | "onShow" 
  | "onHide" 
  | "onError"


export const enum InstanceBaseEvent {
  Lifecycle,
  Common
}

export class BaseClass<T extends string> extends EventEmitter<T | InstanceBaseEvent> {
  
  constructor(public _instanceType: InstanceType) {
    super();
    this._tag = InstanceName[_instanceType];

    this.registerLifecycleEvent();
    this.registerInstanceEventHandler();
  }

  readonly _logApi = logManager;
  readonly _tag: string;
  
  instance: WechatMiniprogram.Component.TrivialInstance = this as any;

  protected registerLifecycleEvent() {
    this.on(InstanceBaseEvent.Lifecycle, (lifecycle: any, options: any) => {
      if (DEV) this.log("Lifecycle ->", lifecycle, options);
      this.emit(lifecycle, options);
    });
  }

  protected registerInstanceEventHandler() {
    this.on(InstanceBaseEvent.Common, (eventName: T, options: any) => {
      if (DEV) this.log("Lifecycle ->", eventName, options);
      this.emit(eventName, options);
    });
  }

  /**
   * 应用在小程序的组件和页面中
   */
  setInstanceProperties() {
    Object.defineProperties(this, {
      state: {
        get:() => this.instance.data,
        configurable: true,
      },
      setState: {
        get:() => this.instance.setData.bind(this.instance),
        configurable: true,
      },
      is: {
        get:() => this.instance.is,
        configurable: true,
      }
    });
  }

  log(...args: any[]) {
    this._logApi.log(`%c[${this._tag}]`, "color: gray;", ...args);
  }

  info(...args: any[]) {
    // @ts-ignore
    this._logApi.info(`%c[${this._tag}]`, "color: gray;", ...args);
  }

  warn(...args: any[]) {
    this._logApi.warn(`[${this._tag}]`, ...args);
  }

  /** @todo 当出错是应该获取更多的信息
   *    例：用户设备信息，设备基础信息，系统设备，设备授权信息
   *    小程序版本信息，当前页面和启动场景信息) */
  error(...args: any[]) {
    let infoArr:any[] = [];
    this._logApi.error1(this._tag, {infoArr}, ...args)
  }
  
}


export interface BaseClassInstanceProperties {
  is: string;
  state: Record<string, any>;
  setState: (
    state: Partial<WechatMiniprogram.IAnyObject> & WechatMiniprogram.IAnyObject, 
    callback?: (() => void) | undefined,
  ) => void;
}

export function callMethod(instance: any, msg: MessageObject) {
  let {type, value} = msg.data;
  if (
    !Reflect.has(instance, type) 
    || "function" !== typeof instance[type]
  ) return instance.warn("No found the method.", type);
  instance[type](...value);
}

export function emit(instance: any, msg: MessageObject) {
  let {type, value} = msg.data;
  if (Reflect.has(instance, type)) instance["_" + type].emit(...value);
  instance.emit(type as any, ...value);
}