import React from "react";
import { ActionViewControl } from "./react/ActionViewControl";

const Settings: any[] = [

];

export function DisplayManager()
{
  const onClickIcon = (e: any) => {
  
  }

  return (
    <>
      <div className="header weui-flex" onClick={onClickIcon}>
        <button id="choose">筛选</button>
        <button id="switchDisplayMode">切换展示方式</button>
        <button id="showYuantu">显示原图</button>
        <ActionViewControl name="设置" actions={ Settings } onAction={() => {}}>
          <button>设置</button>
        </ActionViewControl>
      </div>    
    </>
  ); 
}