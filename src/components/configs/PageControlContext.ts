import { createContext } from 'react';


export interface IControlViewItem
{
  /** 显示的名称 */
  name: string;
  icon: string;
  /** 页面路径 */
  pagePath?: string;
  /** 点击后的控制 */
  content?: any;
}

export interface PageContextValue {
  btnLists: IControlViewItem[][]
}

const defaultPageContext: PageContextValue = {
  btnLists: [
  ]
}

export const PageControlContext = createContext(defaultPageContext);