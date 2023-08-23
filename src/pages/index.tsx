import React, { StrictMode, useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { MediaContainer } from 'src/components/MediaContainer';
import { MediaManager, MediaManagerProvider } from 'src/components/MediaManager';
import { AddIcon } from "tdesign-icons-react";

import Counter from 'src/components/counter';

import './index.css';

import "tdesign-theme-generator";
import { PageControl, PageControlProvider } from 'src/components/PageControl';
import { PageControlContext } from 'src/components/configs/PageControlContext';
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
      <MediaManagerProvider props={{tabBar: [{name: "测试", icon: <AddIcon />}, {name: "测试1", icon: <AddIcon />}]}}>
        <MediaManager onAdd={onAddMedias} onRun={onRunActions} onSave={onSaveMedias}></MediaManager>
      </MediaManagerProvider>
      <PageControlProvider context={{btnLists: [[{name: "用户中心", icon: "icon",}]]}}>
        <PageControl header="abc" footer="footer" />  
      </PageControlProvider>
      <td-theme-generator drawerVisible={[true, 2]} showSetting={[true,"Hello"]} />
    </>
  )
}

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  ReactDOM.render(
    <StrictMode>
      <DemoIndex />
    </StrictMode>
  , container)
}

;('undefined' != typeof wx && wx.getSystemInfoSync) || createApp()
