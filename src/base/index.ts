// Base 人口

import { AppBaseClass as WXApp } from "./wxBase/app";
import { AppBaseClass as WEBApp } from "./webBase/app";
import { IApp } from "./interfaces";


let App_
if (process.env.WECHAT) {
  App_ = WXApp
} else {
  App_ = WEBApp
}

interface AppConstructor {
  new (): IApp;
  prototype: IApp;
}

export let AppBaseClass = App_ as AppConstructor;
