
/**
 * 用来呈现按钮点击后的扩展Dock
 */

import React, { createRef, useMemo, useState } from 'react';

import { Popup as TPopup, Button as TButton } from 'tdesign-react';
import { ITabBarProps } from '../configs/MediaControlContext';

export default function DockTabBar({tabBar}: {
  tabBar: ITabBarProps[]
})
{
  let [showingIndex, setShowingIndex] = useState(0);
  const attachRef = createRef<any>();

  const tabBarBtns = useMemo(() => (tabBar.map((item, index) => (<TButton variant='text' data-index={index} style={{padding: "0 16px"}} icon={item.icon} shape="round">
    {showingIndex == index ? item.name : ""}
  </TButton>))), [tabBar, showingIndex]);
  
  return (<TPopup hideEmptyPopup={undefined} >
    <div style={{position: "relative"}} ref={attachRef}></div>
    <div onClick={(e) => setShowingIndex(+e.target.dataset.index)}>
      {tabBarBtns}
    </div>
  </TPopup>);
}