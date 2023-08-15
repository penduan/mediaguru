import React, { useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { start } from 'repl';
import { MediaContainer } from 'src/components/MediaContainer';
import { MediaManager } from 'src/components/MediaManager';
import Counter from 'src/components/counter';

import './index.css';

import "tdesign-theme-generator";
declare  global {
  namespace JSX {
    interface IntrinsicElements {
        'td-theme-generator': any
        'comp-b': any,
        'comp-c': any
    }
  }
}

type TODOType = any;
interface Media {
  src: string;
  name: string;
  size?: number;
  time?: number;
};

type Medias = Media[];

let func = new Set();

class ActionSchemes
{
  static _mediaAddSchemes = 
  {
    get web() {
      return [

      ]
    },
    get wx() {
      return []
    },
  }


  static getMedia()
  {
    if (process.env.WECHAT) { // tree-shaking support?
      return this._mediaAddSchemes.wx;
    } else {
      return this._mediaAddSchemes.web;
    }
  }

  static getSave()
  {
    return [];
  }

  static getActions()
  {
    return [];
  }

  static getTemplates()
  {
    return [];
  }
}

function MediaInfo()
{
  return (<></>);
}

function MediaInfoList()
{
  return (<></>);
}

function DemoIndex()
{
  let [displayMode, setDisplayMode] = useState(false);
  let [isChoosing, setIsChoosing] = useState(false);
  let [isShowYuantu, setIsShowYuantu] = useState(false);
  let [actions, setActions] = useState([] as any[]);
  let [actionMode, setActionsMode] = useState("");

  let mediasRef = useRef<Medias>([]);

  // const showActions = useCallback((actions: any[], actionMode: any[]) => {
    
  // }, [actions, actionMode]);


  // let startTimeStamp = 0;

  // const headerClickHandle = (e: any) => {
  //   console.log("header click", e);
  //   setDisplayMode(!displayMode);
  // };

  // const mouseDownHandle = (e: any) => {
  //   startTimeStamp = e.timeStamp;
  // }

  // const mouseUpHandle = (handler: (e: any) => void) => (e: any) => {
  //   if (e.timeStamp - startTimeStamp > 300) {
  //     handler(e);
  //     console.log("long press")
  //     e.preventDefault();
  //   }
  // }

  // const footerClickHandle = (e: any) => {
    
  //   const { id } = e.target;
  //   if (id in ActionSchemes)
  //   {
  //     setActions( (ActionSchemes as any)[id]() );
  //     return;
  //   }
  // }

  const onAddMedias = (medias: Medias) => {
    mediasRef.current = medias;
  }

  const onRunActions = (actions: any[]) => {
    console.log("run actions", actions);
  }

  const onSaveMedias = (medias: Medias) => {
    console.log("save medias", medias);
  }

  const onDeletedMedia = (media: Media) => {
    console.log("delete media", media);
  }

  const onEditedMedia = (media: Media) => {
    console.log("update media", media);
  }

  return (
    <>
      <MediaContainer 
        medias={mediasRef.current} 
        onDeletedMedia={onDeletedMedia}
        onEditedMedia={onEditedMedia}
      ></MediaContainer>
      <MediaManager onAdd={onAddMedias} onRun={onRunActions} onSave={onSaveMedias}></MediaManager>
    </>
  )
}

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  ReactDOM.render(<DemoIndex />, container)
}

;('undefined' != typeof wx && wx.getSystemInfoSync) || createApp()
