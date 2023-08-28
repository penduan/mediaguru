
import React, { createRef, useContext, useState } from "react";

import { Button as TButton, Popup as TPopup } from "tdesign-react";
import { AddIcon } from "tdesign-icons-react";

import { ActionViewControl } from "./react/ActionViewControl";
import { MediaContextValue, MediaManagerContext } from "./configs/MediaControlContext";

import "./MediaManager.css";
import DockTabBar from "./react/DockTabBar";

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
  const tabBar = useContext(MediaManagerContext).tabBar;

  return (
    <>
      <div className="media-manager__bg" style={{position: "fixed", display: "flex", left: "calc(50vw - 200px)",
        bottom: "18px",
        borderRadius: "32px",
      }}>
        <DockTabBar tabBar={tabBar}></DockTabBar>        
      </div>
      {/* <div className="footer weui-flex">
        <ActionViewControl name="添加媒体" actions={mediaSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="执行动作" actions={actionSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="执行模板" actions={templateSchemes} onAction={() => {}}></ActionViewControl>
        <ActionViewControl name="保存" actions={saveSchemes} onAction={() => {}}></ActionViewControl>
      </div> */}
    </>
  );
}