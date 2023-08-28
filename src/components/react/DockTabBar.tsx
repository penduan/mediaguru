
/**
 * 用来呈现按钮点击后的扩展Dock
 */

import React, { createRef, useCallback, useMemo, useState } from 'react';

import { Popup as TPopup, Button as TButton } from 'tdesign-react';
import { ITabBarProps } from '../configs/MediaControlContext';
import "./DockTabBar.css";

export default function DockTabBar({tabBar}: {
  tabBar: ITabBarProps[],
})
{
  const [showingIndex, setShowingIndex] = useState(0);
  const [showing, setShowing] = useState(true);
  const attachRef = createRef<any>();

  const tabBarBtns = tabBar.map((item, index) => 
    (
      <TButton key={index} className="tab-bar_control-item" onClick={
        (e) => {
          if (index == showingIndex) setShowing(!showing);
          else setShowingIndex(index);
          showing && item.action && item.action();
        }
      } variant='text' 
        data-index={index} 
        style={{padding: "0 16px"}} 
        icon={item.icon} 
        shape="round"
      >
        {showingIndex == index && showing ? item.name : ""}
      </TButton>
    )
  );
  
  return (<TPopup hideEmptyPopup={undefined} >
    <div style={{position: "relative"}} ref={attachRef}></div>
    <div className="tab-bar_content">
      {showing && tabBar[showingIndex]?.context}
    </div>
    <div className="tab-bar_control">
      {tabBarBtns}
    </div>
  </TPopup>);
}