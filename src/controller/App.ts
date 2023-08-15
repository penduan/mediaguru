import { AppBaseClass } from "src/base";
import { Deps } from "src/api/common/deps";
import { GitController } from "./Git";

declare global {
  module globalThis {
    var _app: AppClass;
  }
}

/**
 * App main controller
 */
export default class AppClass extends AppBaseClass {
  
  isWeChat = !!process.env.WECHAT;

  deps: Deps;
  git: GitController;

  constructor() {
    super();

    this.deps = new Deps();
    this.action.loading("loading");
    this.git = new GitController(this.deps);

    this.deps.awaitDeps().then(() => {
      this.action.hide();
    })

  }
}

export function getAppInstance() {
  if (process.env.WECHAT) {
    return getApp<AppClass>();
  } else {
    return _app;
  }
}

if (process.env.WECHAT) {
  App(new AppClass());
} else {
  globalThis._app = new AppClass();
}