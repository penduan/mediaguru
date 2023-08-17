import { createContext } from 'react';


interface IControlViewItem
{
  /** 显示的名称 */
  name: string;
  icon: string;
  /** 页面路径 */
  pagePath?: string;
  /** 点击后的控制 */
  content?: any;
}

interface PageContextValue {
  btnList: IControlViewItem[][]
}

const defaultPageContext: PageContextValue = {
  btnList: [
  ]
}


export const PageControlContext = createContext(defaultPageContext);