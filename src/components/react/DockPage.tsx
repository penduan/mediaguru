
/**
 * 用来呈现按钮点击后的扩展内容
 */

import React, { useState } from 'react';

import { Popup as TPopup } from 'tdesign-react';

export function DockPage({ btnNode, content }: {
  btnNode: React.ReactNode,
  content: React.ReactNode,
  onClickBtn:  () =>  void
})
{
  let [show, setShow] = useState(false);

  return (<TPopup content={content} hideEmptyPopup={undefined} >
    <div>
      {btnNode}
    </div>
  </TPopup>);
}