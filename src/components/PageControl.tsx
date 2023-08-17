import React from "react";

import { IControlViewItem, PageContextValue, PageControlContext } from "./configs/PageControlContext";

import "./PageControl.css";
export function PageControlProvider({
  children,
  context
}:
{
  children: any,
  context: PageContextValue
})
{
 

  return (<>
    <PageControlContext.Provider value={context}>
      {children}
    </PageControlContext.Provider>
  </>);
}

export function ControlItem()
{
  return (<div className="control-item">
    <div className="control-item__icon">
      <i className="fa fa-plus"></i>
    </div>
    <div className="control-item__text">
      <span>Thêm mới</span>
    </div>
  </div>);
}

export function ControlView({
  list,
  children
}: {
  list?: IControlViewItem[],
  children?: any
})
{
  return (
  <div className="control-view">
    { children ? children : (<ControlItem />) }
  </div>);
}

export function PageControl({
  header,
  footer
}:
{
  header?: any,
  footer?: any
})
{

  let controlContext = React.useContext(PageControlContext);
  console.log("PageControl", controlContext);
  return (<>
    <div className="control__bg">
      <ControlView>
        {header}
      </ControlView>
      {
        controlContext.btnLists.map((list, index) => (
          <ControlView list={list} />
        ))
      }
      <ControlView>
        {footer}
      </ControlView>
    </div>
  </>);
}