
import weui from "weui.js";
import type { AppAction } from "../common/action";

let loadingObj: any;

export const webWeuiAction: AppAction = {
  loading: (text: string) => {
    weui.loading()
  },
  hide: () => {
    loadingObj && loadingObj.hide();
    loadingObj = undefined;
  }
}