'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Box, ChevronDown, FileSpreadsheet, Layers3, MoveUpRight, Play, RotateCcw, Search, ShieldCheck, SlidersHorizontal, ScanSearch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import catalog from '@/public/downloads/material-catalog.json';
import { emptyFilters, filterMaterials, type Material, type MaterialFilters } from '@/lib/material-search';
import HandViewer from './viewer';
import MaterialPreview from './material-preview';

const materials = catalog.materials;
const categories = ['all', ...new Set(materials.map(item => item.category))];
const sections = [{id:'explore',label:'探索模型'},{id:'downloads',label:'素材库'},{id:'film',label:'观看作品'},{id:'sources',label:'使用说明'}];

function FilterSelect({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(value:string)=>void}) {
 const items=[{value:'all',label:`全部${label}`},...options.map(option=>({value:option,label:option}))];
 return <Select value={value} onValueChange={next=>onChange(next??'all')} items={items}><SelectTrigger className="filter-select" aria-label={`按${label}筛选`}><SelectValue/></SelectTrigger><SelectContent className="filter-popup">{items.map(item=><SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>;
}

export default function Home() {
 const [preview,setPreview]=useState<Material|null>(null);
 const [previewOpen,setPreviewOpen]=useState(false);
 const previewTrigger=useRef<HTMLElement|null>(null);
 const showPreview=(item:Material,trigger:HTMLElement)=>{previewTrigger.current=trigger;setPreview(item);setPreviewOpen(true)};
 const [expanded,setExpanded]=useState(false);
 const [reset,setReset]=useState(0);
 const [active,setActive]=useState('explore');
 const [filters,setFilters]=useState<MaterialFilters>(emptyFilters);
 const results=filterMaterials(materials,filters);
 const filtered=Object.entries(filters).some(([key,value])=>value!==emptyFilters[key as keyof MaterialFilters]);
 const update=(key:keyof MaterialFilters,value:string)=>setFilters(current=>({...current,[key]:value}));
 const tagSearch=(tag:string)=>setFilters({...emptyFilters,tag});
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);
  },{rootMargin:'-12% 0px -55% 0px',threshold:0});
  sections.forEach(section=>{const element=document.getElementById(section.id);if(element)observer.observe(element)});
  return()=>observer.disconnect();
 },[]);
 return <div className="site-shell" id="top">
  <a className="skip-link" href="#explore">跳到主要内容</a>
  <header className="masthead"><div className="header-inner">
   <a className="brand" href="#top" aria-label="拆开看见首页"><span className="brand-icon"><Layers3 size={24}/></span><span>拆开看见<small>OPEN STRUCTURES</small></span></a>
   <nav aria-label="主导航">{sections.map(section=><a key={section.id} href={`#${section.id}`} aria-current={active===section.id?'location':undefined} onClick={()=>setActive(section.id)}>{section.label}</a>)}</nav>
   <a className="header-search" href="#downloads" aria-label="搜索素材"><Search size={19}/><span>找素材</span></a>
  </div></header>
  <main>
   <section className="explore-section content-width" id="explore" aria-labelledby="main-title">
    <div className="section-line"><span>开放结构实验室</span><span>观察 / 理解 / 再创作</span></div>
    <div className="workspace">
     <div className="object-story"><span className="eyebrow"><span className="tiny-dot"/>第 001 期 · 身体的结构</span><h1 id="main-title">一只手，<br/>藏着怎样的<br/><em>精巧结构？</em></h1><p className="intro">从 27 块骨骼开始。转个角度，拆开看看，再把模型带走，做成你的下一份课件或作品。</p><div className="hero-actions"><a className="primary-link" href="#downloads">探索本期素材 <ArrowRight size={18}/></a><a className="text-link" href="#film"><Play size={16}/>先看 49 秒</a></div><div className="anatomy-stat"><div><strong>8</strong><span>腕骨</span></div><div><strong>5</strong><span>掌骨</span></div><div><strong>14</strong><span>指骨</span></div></div></div>
     <div className="model-stage"><div className="stage-top"><span><Box size={17}/>右手骨骼</span><span className="stage-badge">互动模型</span></div><HandViewer expanded={expanded} reset={reset}/><div className="stage-bottom"><span>拖动旋转 · 双指缩放<br/><small>点击部件，查看名称与编号</small></span><div className="stage-actions"><Button onClick={()=>setExpanded(value=>!value)} aria-pressed={expanded} variant="outline" className="stage-button"><Layers3/>{expanded?'重新组合':'展开结构'}</Button><Button onClick={()=>{setExpanded(false);setReset(value=>value+1)}} variant="outline" className="stage-button reset-button" aria-label="重置模型与视角"><RotateCcw/></Button></div></div></div>
    </div>
    <div className="explore-caption"><span><ShieldCheck size={16}/>源自 BodyParts3D · 保留来源与署名</span><a href="#downloads">看懂一点，也带走一点 <ChevronDown size={16}/></a></div>
   </section>

   <section className="library-section" id="downloads" aria-labelledby="library-title"><div className="content-width">
    <div className="section-heading"><div><span className="eyebrow">THE OPEN COLLECTION</span><h2 id="library-title">把好奇，变成作品。</h2><p>下载模型、查找部件，或为下一幅画面寻找参考。</p></div><a className="kit-link" href="/downloads/right-hand-kit.zip" download><ArrowDownToLine size={18}/><span>下载右手素材包<small>模型、清单与署名说明 · ZIP</small></span></a></div>
    <div className="search-box" role="search" aria-label="素材检索"><Search size={22}/><Input className="material-search" aria-label="搜索素材" placeholder="搜索主题、部件、用途或格式，例如：骨骼、GLB、课件" value={filters.query} onChange={event=>update('query',event.target.value)}/>{filters.query&&<Button variant="ghost" className="clear-query" aria-label="清除搜索文字" onClick={()=>update('query','')}><X size={18}/></Button>}</div>
    <Tabs value={filters.category} onValueChange={value=>update('category',String(value))} className="library-tabs">
     <div className="filter-bar"><TabsList variant="line" className="category-tabs" aria-label="素材类型">{categories.map(category=><TabsTrigger key={category} value={category}>{category==='all'?'全部素材':category}<span>{category==='all'?materials.length:materials.filter(item=>item.category===category).length}</span></TabsTrigger>)}</TabsList><div className="filter-selects"><SlidersHorizontal size={16} className="filter-symbol"/><FilterSelect label="主题" value={filters.topic} options={[...new Set(materials.map(item=>item.topic))]} onChange={value=>update('topic',value)}/><FilterSelect label="格式" value={filters.format} options={[...new Set(materials.map(item=>item.format))]} onChange={value=>update('format',value)}/><FilterSelect label="授权" value={filters.license} options={[...new Set(materials.map(item=>item.license))]} onChange={value=>update('license',value)}/></div></div>
     <div className="search-summary"><div className="quick-tags"><span>标签</span>{['右手','骨骼','结构排列','课件制作'].map(tag=><Button key={tag} variant="ghost" className="tag-button" aria-pressed={filters.tag===tag} onClick={()=>update('tag',filters.tag===tag?'':tag)}>{tag}</Button>)}{filters.tag&&!['右手','骨骼','结构排列','课件制作'].includes(filters.tag)&&<Button variant="ghost" className="tag-button" aria-pressed="true" onClick={()=>update('tag','')}>{filters.tag}<X size={13}/></Button>}</div><div className="result-count" role="status" aria-live="polite">{results.length} 份素材{filtered&&<Button variant="ghost" className="reset-filters" onClick={()=>setFilters(emptyFilters)}>清除筛选<X size={13}/></Button>}</div></div>
     {categories.map(category=><TabsContent key={category} value={category} className="results-panel"><div className="resource-grid">{results.map(item=><article className="resource-card" key={item.id}>
      <Button variant="ghost" className={`resource-preview preview-${item.format.toLowerCase()}`} onClick={event=>showPreview(item,event.currentTarget)} aria-label={`预览${item.title}`} aria-haspopup="dialog"><span className="preview-type">{item.category}</span>{item.preview?<img src={item.preview} alt={item.previewAlt} width={600} height={360} loading="lazy"/>:<div className="sheet-preview" aria-hidden="true"><div><FileSpreadsheet size={19}/><span>右手骨骼 / PARTS INDEX</span></div><div className="sheet-columns"><span>来源编号</span><span>部件名称</span></div><div className="sheet-row"><span>FJ3193</span><span>Distal phalanx…</span></div><div className="sheet-row"><span>FJ3194</span><span>Distal phalanx…</span></div><div className="sheet-bottom">27 个部件 · CSV 清单</div></div>}<span className="preview-action"><ScanSearch size={18}/><span>预览</span></span></Button>
      <div className="resource-body"><div className="resource-meta"><span>{item.id}</span><span>{item.format} · {item.size}</span></div><h3><button className="material-title" onClick={event=>showPreview(item,event.currentTarget)} aria-haspopup="dialog">{item.title}</button></h3><p>{item.description}</p><div className="material-tags" aria-label={`${item.title}的标签`}>{item.tags.map(tag=><Button key={tag} variant="ghost" className="material-tag" aria-pressed={filters.tag===tag} onClick={()=>tagSearch(tag)}>#{tag}</Button>)}</div><div className="resource-footer"><a href="#sources" className="license-badge" aria-label={`${item.title}的授权说明：${item.license}`}><ShieldCheck size={14}/>{item.license}</a><a className="download-link" href={item.href} download>下载 <ArrowDownToLine size={16}/></a></div>
       <details className="asset-details"><summary>用途与素材来源 <ChevronDown size={14}/></summary><dl><div><dt>主题</dt><dd>{item.topic}</dd></div><div><dt>用途</dt><dd>{item.uses.join(' · ')}</dd></div><div><dt>来源</dt><dd><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source}<ArrowUpRight size={13}/></a></dd></div><div><dt>署名</dt><dd>{item.attribution} {item.license}。</dd></div></dl></details>
      </div></article>)}</div>{results.length===0&&<div className="empty-results"><Search size={32}/><h3>还没有找到这份素材</h3><p>试试更短的关键词，或清除筛选查看目前的 {materials.length} 份素材。</p><Button onClick={()=>setFilters(emptyFilters)} className="empty-reset">查看全部素材</Button></div>}</TabsContent>)}
    </Tabs>
    <div className="catalog-footer"><span>按主题、类型、格式、用途与授权整理</span><div><a href="/downloads/material-catalog.csv" download>下载素材目录（表格）<ArrowDownToLine size={14}/></a><a href="/downloads/material-catalog.json" download>下载 JSON 目录</a></div></div>
   </div></section>

   <section className="film-section content-width" id="film" aria-labelledby="film-title"><div className="film-heading"><span className="eyebrow">THE MAKING OF</span><h2 id="film-title">让结构，成为一段旅程。</h2></div><div className="film-layout"><div className="film-visual"><video className="film" controls playsInline preload="none" poster="/media/film-poster.jpg" src="/media/anatomy-film.mp4" aria-label="身体结构逐层展开样片"/><span className="film-side-label">STRUCTURE STUDY — 001</span></div><div className="film-copy"><span className="film-number">实验影像 / 01</span><h3>身体结构，<br/>逐层展开。</h3><p>从一个整体出发，慢慢分离，绕到侧面，再排列、逐件展示与重组。换一种方式，认识熟悉的身体。</p><ol className="film-sequence"><li><span>01</span>展开<small>看清结构之间的位置</small></li><li><span>02</span>排列<small>让部件各自被看见</small></li><li><span>03</span>重组<small>重新理解整体</small></li></ol><div className="film-meta"><span><Play size={14}/>49 秒</span><span>竖屏作品</span><span>2,234 个模型部件</span></div><p className="small-note">成年男性参考模型，含内部解剖结构。本片是视觉表达实验，不是人体全部结构的清单。</p><a className="text-link" href="#downloads" onClick={()=>tagSearch('结构排列')}>取用本片的结构画面 <ArrowUpRight size={17}/></a></div></div></section>

   <section id="sources" className="sources content-width" aria-labelledby="sources-title"><div className="source-intro"><span className="eyebrow">OPEN, WITH CREDIT</span><h2 id="sources-title">开放分享，<br/>也尊重每一份创造。</h2><p>素材可以继续生长。带走时，也请把它的来路一起留下。</p></div><div className="source-copy"><div className="license-title"><ShieldCheck size={23}/><div><h3>CC BY 4.0 · 署名许可</h3><span>保留署名、来源、许可，并注明修改</span></div></div><p>右手模型提取自 BodyParts3D，由 The Database Center for Life Science 提供。本站制作了子集模型、部件清单和结构画面；素材包内附完整来源与修改说明。</p><p>模型以资料库收录范围为准，用于结构学习与视觉创作。网页上的展开方式是展示编排，不代表解剖操作路线。</p><div className="source-links"><a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">原始数据许可<ArrowUpRight size={15}/></a><a href="https://github.com/ashemag/human-atlas" target="_blank" rel="noreferrer">模型整理项目<ArrowUpRight size={15}/></a><a href="/downloads/README.txt" target="_blank" rel="noreferrer">完整使用说明<ArrowUpRight size={15}/></a></div></div></section>
  </main>
  <MaterialPreview item={preview} open={previewOpen} onOpenChange={setPreviewOpen} returnFocus={previewTrigger}/>
  <footer><div className="content-width footer-inner"><a className="brand" href="#top"><Layers3 size={21}/>拆开看见</a><p>看懂一点，带走一点，继续创造。</p><a href="#top">回到顶部<MoveUpRight size={16}/></a></div></footer>
 </div>;
}
