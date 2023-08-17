
import React from "react";

import { AddIcon } from "tdesign-icons-react";

import { ActionViewControl } from "./react/ActionViewControl";
import { MediaContextValue, MediaManagerContext } from "./configs/MediaControlContext";

const mediaSchemes: any[] = [
  {name: "测试", description: "Hello World"},
  {name: "测试", description: "Hello World"},
  {name: "测试", description: "Hello World"},
  {name: "测试", description: "Hello World"},
];
const actionSchemes: any[] = [];
const templateSchemes: any[] = [];
const saveSchemes: any[] = [];

export function MediaManagerProvider({ props, children }: { 
  props: MediaContextValue,
  children: React.ReactNode,
}) 
{
  return (
    <MediaManagerContext.Provider value={props}>
      {children}
    </MediaManagerContext.Provider>
  );
}

/**
 * 管理与控制媒体内容actions
 * @returns 
 */
export function MediaManager({ onAdd, onRun, onSave }: {
  onAdd: (medias: any[]) => void,
  onRun: (actions: any[]) => void,
  onSave: (medias: any[]) => void,
})
{
  let mediaContext = React.useContext(MediaManagerContext);
  return (
    <div className="media-manager__bg">
      <AddIcon />
      <div className="footer weui-flex">
        <ActionViewControl name="添加媒体" actions={mediaSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="执行动作" actions={actionSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="执行模板" actions={templateSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="保存" actions={saveSchemes} onAction={() => {}}></ActionViewControl>
      </div>
    </div>
  );
}