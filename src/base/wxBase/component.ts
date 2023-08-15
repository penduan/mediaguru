
import { BaseClass, BaseClassInstanceProperties, callMethod, InstanceType } from "../base";

type ComponentEventType = "created" | "attached" | "ready" | "moved" | "detached";

/**
 * @todo 需要验证是否能够支持
 * 用来储存已注册的微信原生组件的实例
 */
export const componentInstances = new Map<ComponentBase, ComponentBase>();

/**
 * 组件实例映射信息<引用组件路径,组件实例数量>
 */
export const registedComponentPaths = new Map<string, number>();

abstract class ComponentBase extends BaseClass<ComponentEventType> {
  constructor(public Constructor: any) {
    super(InstanceType.Component);
  }

  init() {
    const self_ = this.methods;
    this.methods = {...this, ...self_};
  }

  lifetimes = {
    created: (() => {
      let self_ = this;
      return function (this: ComponentBase){
        let num;
        // @ts-ignore
        if (num = registedComponentPaths.get(this.is)) {
          self_ = new self_.Constructor();
          num++;
          // @ts-ignore
          registedComponentPaths.set(this.is, num);
        } else {
          // @ts-ignore
          registedComponentPaths.set(this.is, 1);
        }
        
        // @ts-ignore
        self_.instance = this;
        self_.setInstanceProperties();
        componentInstances.set(this, self_);
        self_.emit("created");
      };
    })(),
    attached(this: ComponentBase) {
      let self_ = componentInstances.get(this);
      if (self_) {
        self_.emit("attached");
      }
    },
    ready(this: ComponentBase){
      let self_ = componentInstances.get(this);
      if (self_) {
        self_.emit("ready");
      }
    },
    moved(this: ComponentBase) {
      let self_ = componentInstances.get(this);
      if (self_) {
      self_.emit("moved");
      }
    },
    detached(this: ComponentBase) {
      let self_ = componentInstances.get(this);
      if (self_) {
        self_.emit("detached");
        componentInstances.delete(self_);
        // @ts-ignore
        let num = registedComponentPaths.get(this.is);
        if (num) {
          num--;
          // @ts-ignore
          registedComponentPaths.set(this.is, num);
        }
      }
    },
  }

  methods = {
    __setState(this: ComponentBase & {setData: any}, args: Record<string, any>) {
      this.setData(args);
    },
  
    __callMethod(this: ComponentBase, msg: MessageObject) {
      let self_ = componentInstances.get(this);
      if (self_) {
        callMethod(self_, msg);
      }
    },
  
    __emit(this: ComponentBase, msg: MessageObject) {
      let self_ = componentInstances.get(this);
      if (self_) {
        callMethod(self_, msg);
      }
    }
  }

}


interface IComponent {
  new (Constructor: any): ComponentBase
    & WechatMiniprogram.Component.InstanceProperties
    & WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.Component.DataOption>
    & WechatMiniprogram.Component.Property<WechatMiniprogram.Component.PropertyOption>
    & WechatMiniprogram.Component.Data<WechatMiniprogram.Component.DataOption>
    & WechatMiniprogram.Component.Method<WechatMiniprogram.Component.MethodOption>
    & WechatMiniprogram.Component.Lifetimes
    & WechatMiniprogram.Component.OtherOption
    & BaseClassInstanceProperties;
  prototype: ComponentBase;
}

class BehaviorBase extends BaseClass<string> {
  constructor() {
    super(InstanceType.Behavior);
  }
}

interface IBehavior extends IComponent {}

class ComponentPageBase extends BaseClass<string> {
  constructor() {
    super(InstanceType.ComponentPage);
  }
}

interface IComponentPage {
  new (): ComponentPageBase 
    & WechatMiniprogram.Component.InstanceProperties
    & WechatMiniprogram.Component.Property<WechatMiniprogram.Component.PropertyOption>
    & WechatMiniprogram.Component.Data<WechatMiniprogram.Component.DataOption>
    & WechatMiniprogram.Component.Method<WechatMiniprogram.Component.MethodOption, true>
    & WechatMiniprogram.Component.Lifetimes
    & WechatMiniprogram.Page.ILifetime
    & WechatMiniprogram.Component.OtherOption;
  prototype: ComponentPageBase;
}


export const ComponentBaseClass = ComponentBase as any as IComponent & ComponentBase;

export const BehaviorBaseClass = BehaviorBase as any as IBehavior;

export const ComponentPageBaseClass = ComponentPageBase as any as IComponentPage;
