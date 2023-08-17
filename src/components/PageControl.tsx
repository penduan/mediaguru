import React from "react";

import { PageControlContext } from "./configs/PageControlContext";

// export function PageControlProvider({
//   children
// }:
// {
//   children: any
// })
// {
 

//   return (<>
//     <PageControlContext.Provider value={pageControl}>
//       {children}
//     </PageControlContext.Provider>
//   </>);
// }

export function ControlView()
{
  console.log("ControlView");
  return (<>
    <div>Hello World</div>
  </>);
}

export function PageControl({
  children
}:
{
  children?: any
})
{

  let controlContext = React.useContext(PageControlContext);
  console.log("PageControl", controlContext);
  return (<>
    <div className="page-control">
      {children}
      {controlContext.btnList.map((item, index) => (
        <ControlView />
      ))
      }
    </div>
  </>);
}