import { BaseClass, InstanceBaseEvent, InstanceType, AppEventType } from "../base";
import { IApp } from "../interfaces";

export class AppBaseClass extends BaseClass<AppEventType> implements IApp {
  constructor() {
    super(InstanceType.App);
  }

  onLaunch = (() => {
    const self = this;
    return function (this: AppBaseClass, options: WechatMiniprogram.LaunchOptionsApp) {
      self.instance = this as any;
      self.emit(InstanceBaseEvent.Lifecycle, "onLaunch", options);
    }
  })();

  onShow = (() => {
    const self = this;
    return function (this: AppBaseClass, options: WechatMiniprogram.LaunchOptionsApp) {
      self.emit(InstanceBaseEvent.Lifecycle, "onShow", options);
    }
  })();

  onHide = (() => {
    const self = this;
    return function (this: AppBaseClass) {
      self.emit(InstanceBaseEvent.Lifecycle, "onHide");
    }
  })();

  onError = (() => {
    const self = this;

    return function(this: AppBaseClass, error: string) {
      self.emit(InstanceBaseEvent.Lifecycle, "onError", error);
    }
  })();

  action = {
    loading: (title: string) => wx.showLoading({title}),
    hide: wx.hideLoading
  }
}
