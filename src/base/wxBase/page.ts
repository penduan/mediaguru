
import { 
  BaseClass, 
  BaseClassInstanceProperties, 
  callMethod, 
  emit, 
  InstanceBaseEvent, 
  InstanceType
} from "../base";
import { 
  EventInstance
} from "api/common/eventInstance";
import { Actions } from "wts/consts";


type PageEventType = "onLoad" | "onShow" | "onHide" | "onReady" | "onUnload";

export interface LinkItemData {
  name: string,
  icon?: string,

  /** 0 为mp-icon 1为td-icon */
  iconType?: 0 | 1
}

export interface LinksData {
  lists: Record<string, LinkItemData> | LinkItemData[]
}

export interface InputHubData {
  focus: boolean,
  title: string,
  placeholder: string,
  confirmtype: string, // @TODO 可以与小程序一致
  done: string,
  actionName: string,
  contribName: string,
  contribData: LinksData,
  value: string,
}

export interface ActionSheetData {

}

export interface ActionData {
  inputhub: InputHubData,
  actionsheet: ActionSheetData
}

export interface PageData {
  actionData?: ActionData
}


class PageBase extends BaseClass<PageEventType> {
  
  readonly _onClickInputHubConfirm = new EventInstance;
  readonly onClickInputHubConfirm = this._onClickInputHubConfirm.event;

  readonly _onInputHubInput = new EventInstance;
  readonly onInputHubInput = this._onInputHubInput.event;

  readonly _onInputHubVisibleChange = new EventInstance;
  readonly onInputHubVisibleChange = this._onInputHubVisibleChange;

  readonly _onClickInputHubCell = new EventInstance;
  readonly onClickInputHubCell = this._onClickInputHubCell.event;

  readonly _onClickActionSheetTap = new EventInstance;
  readonly onClickActionSheetTap = this._onClickActionSheetTap.event;

  readonly _onClickBtn = new EventInstance;
  readonly onClickBtn = this._onClickBtn.event;

  constructor() {
    super(InstanceType.Page);
    PageBase.selfs.add(this);
    
  }

  init() {
    this.addBaseAction();
    this.onClickBtn(this.btnHandler.bind(this));
    this.onInputHubInput((e: CustomEvent) => {
      let value = e.detail.value;
      // @ts-ignore
      let actionData = this.state.actionData as ActionData;
      actionData.inputhub.value = value;
    });

    this.onClickInputHubCell((e: WechatMiniprogram.CustomEvent) => {
      let dataset = e.currentTarget.dataset;
      let action = dataset.action;
      if (action) {
        this.triggerAction(action, dataset);
      }
    });
  }

  addBaseAction() {
    this.registerAction(Actions.inputhub, this.inputHubHandler.bind(this));
    this.registerAction(Actions.actionsheet, this.actionSheetHandler.bind(this));
  }

  inputHubHandler(obj: Optional<InputHubData>) {
    // @ts-ignore
    this.setState({
      "actionData.inputhub": obj
    });
  }

  actionSheetHandler() {

  }

  btnHandler(e: WechatMiniprogram.TouchEvent) {
    let id = e.currentTarget.id;
    this.triggerAction(id);    
  }

  /** @todo 有没有必要控制全局的页面对象？ */
  static selfs = new Set<PageBase>();
  static instances = new Set<PageBase>();

  actions = new Map<any, Function>();

  registerAction(name: any, func: Function) {
    this.actions.set(name, func);
  }

  triggerAction(name: string, ...args: any) {
    let func = this.actions.get(name);
    if (func) {
      func(...args); // TODO 可能需要传递参数
      return 1;
    }
    return 0;
  }

  onLoad = (() => {
    const self_ = this;
    return function (this: PageBase, query: Object) {
      self_.instance = this as any;
      self_.setInstanceProperties();
      PageBase.instances.add(this);
      self_.emit(InstanceBaseEvent.Lifecycle, "onLoad", query);
  }})();

  onShow = (() => {
    const self_ = this;
    return function (this: PageBase) {
      self_.emit(InstanceBaseEvent.Lifecycle, "onShow");
    }
  })();

  onHide = (() => {
    const self_ = this;
    return function (this: PageBase) {
      self_.emit(InstanceBaseEvent.Lifecycle, "onHide");
    }
  })();

  onReady = (() => {
    const self_ = this;
    return function (this: PageBase) {
      self_.emit(InstanceBaseEvent.Lifecycle, "onReady");
    }
  })();

  onUnload = (() => {
    const self_ = this;
    return function (this: PageBase) {
      self_.emit(InstanceBaseEvent.Lifecycle, "onUnload");
    }
  })();

  // 从
  __setState = function(this: PageBase & {setData: any}, data: Record<string, any>) {
    this.setData(data);
  }

  __callMethod = (() => {
    const self_ = this;
    return function (this: PageBase, msg: MessageObject) {
      callMethod(self_, msg);     
    }
  })();

  // 用来从wxs中触发页面事件
  __emit = (() => {
    const self_ = this;
    return function (this: PageBase, msg: MessageObject) {
      emit(self_, msg);
    }
  })();

  // WXS event listener. 貌似不需要
  __on = (() => {
    const self_ = this;
    return function(this: PageBase & { data: Record<string, any>, setData: any }, msg: MessageObject) {
      let { type } = msg.data;
      let num = 0;
      self_.on(type as any, (...args: any[]) => {
        let {eventEmitter = {}} = this.data;
        eventEmitter[type] = [num++, ...args];

        this.setData({eventEmitter});
      });
    }
  })();

  __once = (() => {
    const self_ = this;
    return function(this: PageBase & {data: Record<string, any>, setData: any}, msg: MessageObject) {
      let { type } = msg.data;
      self_.once(type as any, (...args: any[]) => {
        let {eventEmitter = {}} = this.data;
        eventEmitter[type] = [1, ...args];

        this.setData({eventEmitter});
      });
    }
  })();

}

interface IPage {
  new (): PageBase 
  & WechatMiniprogram.Page.InstanceProperties
  & WechatMiniprogram.Page.InstanceMethods<WechatMiniprogram.Page.DataOption>
  & WechatMiniprogram.Page.ILifetime
  & BaseClassInstanceProperties;
  prototype: PageBase;
}

export const PageBaseClass = PageBase as any as IPage;
