
import React, { useState } from "react";

import { Button as TButton } from "tdesign-react";
import { AddIcon } from "tdesign-icons-react";

import { ActionViewControl } from "./react/ActionViewControl";
import { MediaContextValue, MediaManagerContext } from "./configs/MediaControlContext";

import "./MediaManager.css";

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
  const [show, setShow] = useState(false);
  

  return (
    <>
      <div className="media-manager__bg" style={{position: "fixed", display: "flex", left: "calc(50vw - 200px)",
        bottom: "18px",
        height: "64px",
        borderRadius: "32px",
        transition: "width .3s ease 0"
      }}>
        <TButton className="btn" variant="text" onClick={() => setShow(!show)} style={{padding: "0 16px"}} icon={show ? (<AddIcon />) : undefined} shape="round">
        {show ? "测试" : (<AddIcon />)}
        </TButton>
        <div className="btn"><AddIcon /></div>
      </div>
      <div className="footer weui-flex">
        <ActionViewControl name="添加媒体" actions={mediaSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="执行动作" actions={actionSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="执行模板" actions={templateSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="保存" actions={saveSchemes} onAction={() => {}}></ActionViewControl>
      </div>
    </>
  );
}