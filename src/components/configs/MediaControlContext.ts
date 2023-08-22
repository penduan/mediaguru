 import { createContext } from "react";

export interface IContext 
{

}

export interface DockProps
{
 // 
}

export interface IActionManager
{
  name: string;
  dockProps: DockProps[];
}

export interface MediaContextValue
{
  actionManagerList: IActionManager[];
}

const defaultMediaContext: MediaContextValue = {
  actionManagerList: []
}



export const MediaManagerContext = createContext(defaultMediaContext);