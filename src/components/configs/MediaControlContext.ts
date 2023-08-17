import { createContext } from "react";

export interface IContext 
{

}

export interface IActionManager
{
  name: string;
  actions: IAction[];

}

export interface MediaContextValue
{
  actionManagerList: IActionManager[];
}

const defaultMediaContext: MediaContextValue = {
  actionManagerList: []
}

export const MediaManagerContext = createContext(defaultMediaContext);