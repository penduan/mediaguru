import React, { useState } from 'react';


export function ActionItem({ action, onClick }: { action: any, onClick: (action: any) => void }) {
  return (
    <div onClick={onClick}>
      <div>{action.name}</div>
      <div>{action.description}</div>
    </div>
  );
}

export function ActionsView({ actions, onAction, show }: {
  actions: any[],
  show: boolean,
  onAction: (action: any) => void,
}) {  
  if (!show) return <></>; 
  return (<div className="fixed">
    {
      actions.map((action, index) => (
        <ActionItem action={action} onClick={() => onAction(action)}></ActionItem>
      ))
    }
  </div>);
}

/**
 * Action view control
 */
export function ActionViewControl({ name, actions, onAction, children }: {
  name: string,
  actions: any[],
  children?: any,
  onAction: (action: any) => void,
}) {
  let [showing, setShowing] = useState(false);

  const toggleShowing = () => {
    setShowing(!showing);
  }

  return (
    <>
      <div style={{display: 'inline'}} onClick={toggleShowing}>
        {children || (<button>{name}</button>)}
      </div>
      <ActionsView show={showing} actions={actions} onAction={onAction}></ActionsView>
    </>
  );
}