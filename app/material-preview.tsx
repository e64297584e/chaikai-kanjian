'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { ArrowDownToLine, Layers3, RotateCcw, X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Material } from '@/lib/material-search';
import HandViewer from './viewer';

export default function MaterialPreview({item,open,onOpenChange,returnFocus}:{item:Material|null;open:boolean;onOpenChange:(open:boolean)=>void;returnFocus:RefObject<HTMLElement|null>}) {
 const frame=useRef<HTMLDivElement>(null);
 const drag=useRef<{x:number;y:number;left:number;top:number;moved:boolean}|null>(null);
 const [zoom,setZoom]=useState(1);
 const [fit,setFit]=useState(.25);
 const [dimensions,setDimensions]=useState({width:1080,height:1920});
 const [imageState,setImageState]=useState<'loading'|'ready'|'error'>('loading');
 const [expanded,setExpanded]=useState(false);
 const [reset,setReset]=useState(0);
 const isImage=item?.format==='JPG';
 useEffect(()=>{if(open){setZoom(1);setExpanded(false);setReset(value=>value+1);setImageState('loading');if(frame.current){frame.current.scrollLeft=0;frame.current.scrollTop=0}}},[open,item?.id]);
 useEffect(()=>{
  if(!open||!isImage||!frame.current)return;
  const element=frame.current;
  const resize=()=>setFit(Math.min((element.clientWidth-32)/dimensions.width,(element.clientHeight-32)/dimensions.height,1));
  const observer=new ResizeObserver(resize);observer.observe(element);resize();return()=>observer.disconnect();
 },[open,isImage,dimensions]);
 const adjustZoom=(change:number)=>setZoom(value=>Math.max(1,Math.min(8,value+change)));
 const labels:Record<string,string>={source_id:'来源编号',name:'英文名称',concept_id:'概念编号',vertex_count:'顶点数',triangle_count:'三角形数'};
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="material-dialog" showCloseButton={false} finalFocus={returnFocus} onKeyDown={event=>{if(isImage&&(event.key==='+'||event.key==='=')){event.preventDefault();adjustZoom(.5)}if(isImage&&event.key==='-'){event.preventDefault();adjustZoom(-.5)}}}>
  {item&&<><div className="preview-heading"><div><DialogTitle className="preview-title">{item.title}</DialogTitle><DialogDescription className="preview-description">{item.format} · {item.size} · {item.license}{isImage?' · 点击图片放大，拖动或滚动查看细节':item.format==='CSV'?' · 完整部件清单':' · 拖动旋转，点击查看部件'}</DialogDescription></div><DialogClose render={<Button variant="ghost" className="preview-close" aria-label="关闭预览"/>}><X size={22}/></DialogClose></div>
  {isImage?<><div className="preview-toolbar" aria-label="图片缩放工具"><Button variant="outline" aria-label="缩小图片" disabled={zoom<=1} onClick={()=>adjustZoom(-.5)}><ZoomOut size={18}/></Button><span aria-live="polite">{Math.round(fit*zoom*100)}%</span><Button variant="outline" aria-label="放大图片" disabled={zoom>=8} onClick={()=>adjustZoom(.5)}><ZoomIn size={18}/></Button><Button variant="outline" onClick={()=>setZoom(1)}><Maximize size={16}/>适应窗口</Button><Button variant="outline" onClick={()=>setZoom(Math.min(8,1/fit))}>原始尺寸</Button></div>
   <div className={`image-frame ${zoom>1?'is-zoomed':''}`} ref={frame} onPointerDown={event=>{if(event.pointerType!=='mouse'||zoom<=1)return;drag.current={x:event.clientX,y:event.clientY,left:event.currentTarget.scrollLeft,top:event.currentTarget.scrollTop,moved:false}}} onPointerMove={event=>{const start=drag.current;if(!start||!event.buttons)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.hypot(dx,dy)>4){start.moved=true;event.currentTarget.setPointerCapture(event.pointerId)}event.currentTarget.scrollLeft=start.left-dx;event.currentTarget.scrollTop=start.top-dy}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}} onPointerCancel={()=>{drag.current=null}}>
    <div className="image-scroll-space" style={{width:dimensions.width*fit*zoom+32,height:dimensions.height*fit*zoom+32}}><button className="full-image-button" aria-label={zoom===1?'放大查看排列墙':'恢复完整图片'} onClick={()=>{if(!drag.current?.moved)setZoom(value=>value===1?2:1);drag.current=null}}><img src={item.href} alt={item.previewAlt} draggable={false} style={{width:dimensions.width*fit*zoom,height:dimensions.height*fit*zoom}} onLoad={event=>{setDimensions({width:event.currentTarget.naturalWidth,height:event.currentTarget.naturalHeight});setImageState('ready')}} onError={()=>setImageState('error')}/></button></div>
    {imageState!=='ready'&&<p className="image-load-status" role="status">{imageState==='loading'?'正在加载完整图片…':'图片暂时无法加载，请关闭预览后重试。'}</p>}
   </div></>:item.format==='CSV'?<div className="table-preview"><table><caption>共 {item.table?.rows.length??0} 个部件 · 与下载清单一致</caption><thead><tr>{item.table?.columns.map(column=><th key={column} scope="col">{labels[column]??column}</th>)}</tr></thead><tbody>{item.table?.rows.map((row,index)=><tr key={row[0]??index}>{row.map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>:<div className="model-preview"><HandViewer expanded={expanded} reset={reset}/><div className="model-preview-tools"><Button variant="outline" aria-pressed={expanded} onClick={()=>setExpanded(value=>!value)}><Layers3/>{expanded?'重新组合':'展开结构'}</Button><Button variant="outline" onClick={()=>{setExpanded(false);setReset(value=>value+1)}}><RotateCcw/>重置视角</Button></div></div>}
   <div className="preview-footer"><span>{item.id} · {item.source}</span><a className="preview-download" href={item.href} download><ArrowDownToLine size={17}/>下载{isImage?'原图':item.format==='CSV'?'清单':'模型'}<small>{item.format}</small></a></div></>}
 </DialogContent></Dialog>;
}
