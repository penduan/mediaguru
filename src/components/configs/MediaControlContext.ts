 import React, { createContext } from "react";

export interface IContext 
{

}

export interface DockProps
{
 // 
}

export interface ITabBarProps
{
  name: string;
  icon: React.ReactElement;
  context?: React.ReactElement;
  action?: () => void;
}

export interface MediaContextValue
{
  tabBar: ITabBarProps[];
}

const defaultMediaContext: MediaContextValue = {
  tabBar: []
}

export const MediaManagerContext = createContext(defaultMediaContext);