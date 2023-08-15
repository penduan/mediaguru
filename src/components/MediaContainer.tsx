
import React from 'react';
import { DisplayManager } from './DisplayManager';
import { MediaList } from './react/MediaList';

export function MediaContainer({medias = [], onDeletedMedia, onEditedMedia}: {
  medias?: any[],
  onDeletedMedia?: (media: any) => void,
  onEditedMedia?: (media: any) => void,
})
{
  return (
    <>
      <DisplayManager></DisplayManager>
      <div className="content weui-flex">
        <MediaList medias={medias} onDeletedMedia={onDeletedMedia} onEditedMedia={onEditedMedia}></MediaList>
      </div>
    </>);
}