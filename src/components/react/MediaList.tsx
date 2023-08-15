
import React from 'react';


export function MediaItem({ media }: {
  media: any,
  onDeletedMedia?: (media: any) => void,
  onEditedMedia?: (media: any) => void,
})
{
  return (<>
    <img src={media.src} alt="" />
    <div className="info">
      <div className="name">{media.name}</div>
      <div className="size">{media.size}</div>
      <div className="time">{media.time}</div>
    </div>
  </>);
}

export function MediaList({ medias }: {
  medias: any[],
  onDeletedMedia?: (media: any) => void,
  onEditedMedia?: (media: any) => void,
}) {
  return (<div className='media-list'>
    {
      medias.map((item, index) => (
        <div className="media-item">
          <MediaItem media={item} key={index}></MediaItem>
        </div>
      ))
    }
  </div>);
}