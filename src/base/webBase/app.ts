import { isExt, isWeb, isWebWorker } from "src/api/common/env";
import { AppAction, defaultAction } from "src/api/common/action";
import { extPortAction } from "src/api/extension/action";

import { AppEventType, BaseClass, InstanceType } from "../base";
import { IApp } from "../interfaces";
import { webWeuiAction } from "src/api/browser/action";

export class AppBaseClass extends BaseClass<AppEventType> implements IApp {
  
  action: AppAction;

  constructor() {
    super(InstanceType.App);

    this.registerAppEvent();

    this.action = isWeb 
      ? webWeuiAction 
      : isExt 
        ? extPortAction 
        : defaultAction;
  }

  /**
   * 需要应用在web和web worker两种环境?
   */
  registerAppEvent() {
    
  }
}