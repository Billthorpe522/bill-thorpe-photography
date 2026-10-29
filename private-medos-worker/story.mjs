import {story} from './selection.mjs';

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');

export function validateStory(photos,selection=story){
  if(!Array.isArray(photos)||photos.length<4)throw new Error('The story needs photographs');
  const byId=new Map(photos.map(p=>[p.id,p]));
  if(byId.size!==photos.length)throw new Error('Duplicate photograph ID');
  if(!Array.isArray(selection.covers)||selection.covers.length!==4||new Set(selection.covers).size!==4)throw new Error('Select four unique covers');
  if(!Array.isArray(selection.chapters)||!selection.chapters.length)throw new Error('The story needs chapters');
  const chapterIds=new Set(),ordered=[];
  for(const chapter of selection.chapters){
    if(!/^[a-z][a-z0-9-]*$/.test(chapter.id)||chapterIds.has(chapter.id))throw new Error('Invalid or duplicate chapter ID');
    chapterIds.add(chapter.id);
    if(!chapter.title||!Array.isArray(chapter.photos)||!chapter.photos.length)throw new Error('Empty chapter');
    for(const id of chapter.photos){
      if(!byId.has(id)||ordered.includes(id))throw new Error('Missing or repeated story photograph');
      ordered.push(id);
    }
  }
  if(ordered.length!==photos.length)throw new Error('Every photograph must belong to a chapter');
  for(const id of selection.covers)if(!ordered.includes(id))throw new Error('Cover is outside the story');
  for(const p of photos){
    if(!Number.isSafeInteger(p.id)||p.id<1||!p.caption||!p.filename)throw new Error('Invalid photograph identity');
    for(const kind of ['thumb','photo','download']){
      const v=p.variants?.[kind];
      if(!v||!Number.isInteger(v.width)||v.width<1||!Number.isInteger(v.height)||v.height<1)throw new Error('Invalid photograph dimensions');
    }
  }
  return {byId,ordered};
}

export const storyCSS=`
:root{--paper:#f5f1e9;--ink:#292d27;--muted:#73766a;--line:#d4d4c8;--accent:#8b6347;--dark:#252e28}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:76px}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}button,input{font:inherit}button,a,input{-webkit-tap-highlight-color:transparent}button{cursor:pointer}a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #986341;outline-offset:5px}button{min-height:44px}button[hidden],[hidden]{display:none!important}
.masthead{max-width:1600px;margin:auto;padding:24px 5vw;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{text-decoration:none;font-size:19px;font-weight:800;letter-spacing:-.7px;line-height:1}.brand span{color:var(--accent)}.brand small{display:block;font-size:8px;font-weight:500;letter-spacing:2.8px;margin-top:8px}.lock{border:0;border-bottom:1px solid var(--line);border-radius:0;background:none;color:var(--muted);font-size:11px;padding:9px 0;min-width:74px}.masthead-label{font-size:10px;letter-spacing:1.4px;color:var(--muted);text-transform:uppercase}
.opening{max-width:1440px;margin:auto;padding:65px 5vw 90px}.eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin:0 0 18px}.opening-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-bottom:52px}.opening h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(62px,8.8vw,126px);font-weight:400;letter-spacing:-5px;line-height:.95;margin:0}.opening h1 em{font-weight:400;color:var(--accent)}.opening-note{max-width:225px;font-size:13px;line-height:1.8;color:var(--muted);margin:0 0 3px}.opening-note small{display:block;margin-top:16px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase}.cover-grid{display:grid;grid-template-columns:1.17fr 1fr;gap:24px 4.5%;align-items:start}.cover-grid figure{margin:0}.cover-grid figure:nth-child(2){padding-top:70px}.cover-grid figure:nth-child(3){margin-top:-20px}.cover-grid figure:nth-child(4){padding-top:45px}.cover-caption{display:flex;justify-content:space-between;gap:15px;padding-top:12px;font-size:9px;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted)}.cover-caption span:first-child{color:var(--accent)}.opening-end{display:flex;align-items:center;justify-content:space-between;gap:30px;border-top:1px solid var(--line);padding-top:24px;margin-top:52px;color:var(--muted);font-size:11px}.opening-end p{margin:0;max-width:430px}.opening-end a{text-decoration:none;white-space:nowrap;min-height:44px;display:flex;align-items:center;gap:20px;color:var(--ink)}
.chapter-nav{position:sticky;top:0;z-index:10;background:rgba(245,241,233,.97);border-block:1px solid var(--line);backdrop-filter:blur(12px)}.chapter-nav-inner{max-width:1440px;margin:auto;padding:0 5vw;display:flex;align-items:center;gap:28px}.chapter-nav-label{font-family:Georgia,"Times New Roman",serif;font-size:16px;white-space:nowrap}.chapter-links{display:flex;gap:22px;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;flex:1;min-width:0}.chapter-links a{min-height:61px;text-decoration:none;display:flex;align-items:center;gap:7px;white-space:nowrap;border-bottom:2px solid transparent;font-size:10px;color:var(--muted)}.chapter-links a span{font-size:8px;color:var(--accent)}.chapter-links a[aria-current=true]{border-bottom-color:var(--accent);color:var(--ink)}
.chapter{padding:95px 0 100px;scroll-margin-top:0}.chapter:nth-child(even){background:#ebece3}.chapter:nth-child(3n){background:#e9e4d9}.chapter-wrap{max-width:1440px;margin:auto;padding:0 5vw}.chapter-heading{display:grid;grid-template-columns:50px 1fr minmax(150px,270px);gap:20px;align-items:start;margin-bottom:50px;border-top:1px solid var(--line);padding-top:26px}.chapter-number{font-family:Georgia,"Times New Roman",serif;font-size:24px;line-height:1.2;color:var(--accent)}.chapter h2{font-family:Georgia,"Times New Roman",serif;font-size:clamp(36px,4.8vw,65px);font-weight:400;line-height:1.04;letter-spacing:-1.5px;margin:0;max-width:750px}.chapter-heading p{font-size:12px;line-height:1.8;color:var(--muted);margin:3px 0 0;max-width:270px}.story-row{display:flex;gap:32px;align-items:flex-start;margin:0 0 34px}.story-row>.photo-link{flex:var(--ratio) 1 0;min-width:0}.story-row.solo{display:block;max-width:1100px;margin:0 auto 55px}.story-row.solo.portrait{max-width:600px}.story-row.portrait-pair{max-width:1000px;margin-inline:auto;gap:7%}.story-row.trio{gap:22px}.story-row.feature{margin-top:55px;margin-bottom:55px}.photo-link{position:relative;display:block;text-decoration:none;line-height:0;overflow:hidden;background:#e0dfd6}.photo-link img{display:block;width:100%;height:auto;aspect-ratio:auto;transition:filter .2s}.photo-link:hover img{filter:brightness(.96)}.photo-expand{position:absolute;right:14px;bottom:14px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid rgba(255,255,255,.7);background:rgba(25,29,25,.3);color:#fff;font-size:20px;line-height:1;opacity:0;transition:opacity .2s}.photo-link:hover .photo-expand,.photo-link:focus-visible .photo-expand{opacity:1}.chapter-end{margin-top:50px;display:flex;justify-content:flex-end;border-top:1px solid var(--line);padding-top:20px}.chapter-end a{display:flex;align-items:center;gap:25px;min-height:44px;font-size:11px;text-decoration:none;color:var(--muted)}
.ending{text-align:center;background:var(--dark);color:var(--paper);padding:105px 5vw 95px}.ending .eyebrow{color:#c6b29b}.ending h2{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:clamp(44px,6vw,80px);letter-spacing:-2px;line-height:1.1;margin:20px 0}.ending p{font-size:12px;line-height:1.8;color:#b8beb2}.ending a{display:inline-flex;align-items:center;min-height:44px;font-size:11px;margin-top:20px;text-underline-offset:6px}.footer{background:var(--dark);color:#b8beb2;border-top:1px solid #444c41;padding:22px 5vw;font-size:10px;display:flex;justify-content:space-between;gap:20px}.footer a{text-decoration:none}.skip{position:fixed;top:-100px;left:15px;background:var(--ink);color:#fff;padding:12px;z-index:100}.skip:focus{top:10px}.no-script{padding:20px 5vw}
.viewer{padding:0;border:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;background:#161c17;color:var(--paper)}.viewer::backdrop{background:#161c17}.viewer-inner{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;padding:20px 30px;gap:12px}.viewer-head{display:flex;justify-content:space-between;align-items:center;gap:18px}.viewer-title{font-size:10px;letter-spacing:1.5px;text-transform:uppercase}.viewer button{min-width:44px;min-height:44px;background:transparent;color:inherit;border:1px solid #5e685a;font-size:12px;padding:9px 15px;border-radius:0}.viewer-stage{position:relative;display:flex;min-height:0;align-items:center;justify-content:center;overflow:hidden;touch-action:pan-y pinch-zoom}.viewer-stage img{display:block;width:100%;height:100%;object-fit:contain;min-height:0}.viewer-status{position:absolute;inset:0;display:grid;place-content:center;background:#161c17;font-size:13px;text-align:center;gap:14px;color:var(--paper);padding:20px}.viewer-controls{display:flex;align-items:center;justify-content:center;gap:25px}.viewer-counter{font-size:12px;min-width:75px;text-align:center}.viewer-meta{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;font-size:10px;color:#b7bcb0}.viewer-meta a{color:inherit;text-underline-offset:4px;display:inline-flex;align-items:center;min-height:44px;font-size:11px}.viewer-meta #filename{overflow-wrap:anywhere;min-width:0}
.gate-wrap{max-width:560px;margin:6vh auto 12vh;padding:35px 25px}.gate-wrap h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(48px,7vw,72px);line-height:1;font-weight:400;letter-spacing:-2px;margin:12px 0 24px}.gate-wrap p{font-size:13px;color:var(--muted);line-height:1.8}.gate-wrap label{display:block;font-size:12px;margin:28px 0 8px}.gate-wrap input{display:block;width:100%;border:1px solid #a5aa9c;background:#fff;padding:13px;border-radius:0;color:var(--ink)}.gate-wrap .unlock{width:100%;background:var(--dark);color:var(--paper);border:1px solid var(--dark);padding:14px;margin-top:14px}.gate-wrap .error{color:#9a352d;min-height:24px}.gate-wrap .hint{font-size:11px}
@media(min-width:1600px){.opening,.chapter-wrap,.chapter-nav-inner{padding-inline:65px}}
@media(max-width:900px){.chapter-nav-label{display:none}.chapter-links{gap:20px}.opening{padding-top:40px}.opening h1{letter-spacing:-3px}.opening-heading{gap:25px}.opening-note{max-width:190px;font-size:12px}.chapter{padding:75px 0}.chapter-heading{grid-template-columns:36px 1fr;gap:14px}.chapter-heading p{grid-column:2;max-width:500px;margin-top:0}.story-row{gap:22px;margin-bottom:26px}.cover-grid{gap:24px 4%}.cover-grid figure:nth-child(2){padding-top:45px}.cover-grid figure:nth-child(4){padding-top:25px}}
@media(max-width:600px){html{scroll-padding-top:58px}.masthead{padding:19px 5vw}.brand{font-size:17px}.brand small{font-size:7px}.masthead-label{font-size:8px;letter-spacing:1px}.opening{padding-top:43px;padding-bottom:52px}.opening-heading{display:block;margin-bottom:32px}.opening h1{font-size:clamp(53px,15vw,82px);letter-spacing:-2.7px}.opening-note{margin-top:24px;max-width:100%;font-size:12px}.opening-note small{margin-top:10px;font-size:9px}.eyebrow{font-size:9px;letter-spacing:2px}.cover-grid{gap:24px 4%}.cover-grid figure:nth-child(2){padding-top:32px}.cover-grid figure:nth-child(3){margin-top:0}.cover-grid figure:nth-child(4){padding-top:20px}.cover-caption{font-size:8px;letter-spacing:.7px;gap:6px}.cover-caption span:last-child{display:none}.opening-end{margin-top:30px;gap:20px;align-items:flex-start;font-size:10px}.opening-end p{max-width:62%}.opening-end a{font-size:10px;gap:8px;white-space:normal}.chapter-links{gap:20px}.chapter-links a{min-height:54px;font-size:10px}.chapter-links a span{display:none}.chapter{padding:55px 0 58px}.chapter-heading{margin-bottom:30px;padding-top:20px}.chapter-number{font-size:20px}.chapter h2{font-size:39px;letter-spacing:-1px}.chapter-heading p{font-size:11px}.story-row{display:grid;gap:22px;margin-bottom:24px}.story-row.solo{margin-bottom:26px}.story-row.portrait-pair{display:flex;gap:5%}.story-row.trio{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:15px}.story-row.trio>.photo-link:last-child{grid-column:1/-1;max-width:70%;justify-self:center}.story-row.feature{margin-block:30px}.chapter-end{margin-top:32px;padding-top:16px}.chapter-end a{font-size:10px;gap:18px}.ending{padding:65px 5vw 60px}.ending h2{font-size:47px}.ending p{font-size:11px}.footer{font-size:9px}.photo-expand{width:27px;height:27px;right:9px;bottom:9px;font-size:17px}.viewer-inner{padding:12px;gap:8px}.viewer-controls{gap:14px}.viewer-title{font-size:9px}.viewer-meta{justify-content:center;text-align:center}.viewer-meta #filename{width:100%;font-size:9px}.viewer button{font-size:11px;padding:9px 12px}.gate-wrap{margin-top:3vh}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.photo-link img,.photo-expand{transition:none}}@media(hover:none){.photo-expand{opacity:1}}
`;

// Build varied rows from the real aspect ratios. No image is cropped to fit a box.
function arrange(ids,byId){
  const rows=[];
  for(let i=0;i<ids.length;){
    const p=byId.get(ids[i]),ratio=p.variants.thumb.width/p.variants.thumb.height;
    const next=byId.get(ids[i+1]),nextRatio=next?next.variants.thumb.width/next.variants.thumb.height:0;
    if(i===0&&ratio>=1.2){rows.push({ids:[ids[i++]],cls:'solo feature'});continue;}
    if(ratio<.95&&next&&nextRatio<.95){rows.push({ids:ids.slice(i,i+2),cls:'portrait-pair'});i+=2;continue;}
    if(next){rows.push({ids:ids.slice(i,i+2),cls:''});i+=2;continue;}
    rows.push({ids:[ids[i++]],cls:ratio<.95?'solo portrait':'solo'});
  }
  return rows;
}

export function renderStory(photos,base,selection=story){
  const {byId,ordered}=validateStory(photos,selection);
  const chapterFor=new Map(selection.chapters.flatMap(c=>c.photos.map(id=>[id,c.title])));
  const selected=ordered.map(id=>{const p=byId.get(id);return {id,filename:p.filename,alt:p.caption,chapter:chapterFor.get(id)};});
  const photo=(id,{cover=false,eager=false}={})=>{
    const p=byId.get(id),v=p.variants[cover?'photo':'thumb'];
    return `<a class="photo-link" href="${base}photo/${p.id}" data-photo-id="${p.id}" aria-label="View larger: ${escape(p.caption)}" style="--ratio:${v.width/v.height}"><img src="${base}${cover?'photo':'thumb'}/${p.id}" alt="${escape(p.caption)}" width="${v.width}" height="${v.height}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''} decoding="async"><span class="photo-expand" aria-hidden="true">⤢</span></a>`;
  };
  const title=escape(selection.title||'Jessica & Ken'),first=selection.chapters[0];
  const nav=selection.chapters.map((c,i)=>`<a href="#${c.id}" ${i===0?'aria-current="true"':''}><span>${String(i+1).padStart(2,'0')}</span>${escape(c.title)}</a>`).join('');
  const covers=selection.covers.map((id,i)=>`<figure>${photo(id,{cover:true,eager:i<2})}<figcaption class="cover-caption"><span>${String(i+1).padStart(2,'0')} / ${escape(chapterFor.get(id))}</span><span>Jessica & Ken</span></figcaption></figure>`).join('');
  const sections=selection.chapters.map((c,i)=>`<section id="${c.id}" class="chapter" aria-labelledby="chapter-${i}"><div class="chapter-wrap"><div class="chapter-heading"><span class="chapter-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><h2 id="chapter-${i}">${escape(c.title)}</h2><p>${escape(c.subtitle||'')}</p></div>${arrange(c.photos,byId).map(row=>`<div class="story-row ${row.cls}">${row.ids.map(id=>photo(id)).join('')}</div>`).join('')}${i<selection.chapters.length-1?`<div class="chapter-end"><a href="#${selection.chapters[i+1].id}">Next: ${escape(selection.chapters[i+1].title)} <span aria-hidden="true">↓</span></a></div>`:''}</div></section>`).join('');
  const content=`<a class="skip" href="#${first.id}">Skip to photographs</a><header class="masthead"><a class="brand" href="/">Bill Thorpe<span>.</span><small>PHOTOGRAPHY</small></a><form method="post" action="${base}lock"><button class="lock" type="submit">Lock gallery</button></form></header><main><section class="opening" id="beginning" aria-labelledby="story-title"><p class="eyebrow">A wedding story${selection.dateLabel?' · '+escape(selection.dateLabel):''}</p><div class="opening-heading"><h1 id="story-title">${title.replace('&amp;','<em>&amp;</em>')}</h1><p class="opening-note">${escape(selection.subtitle||'A wedding day, remembered.')}<small>${photos.length} photographs · ${selection.chapters.length} chapters</small></p></div><div class="cover-grid">${covers}</div><div class="opening-end"><p>From the anticipation to the celebration.<br>Photographs by Bill Thorpe.</p><a href="#${first.id}">Follow the day <span aria-hidden="true">↓</span></a></div></section><nav class="chapter-nav" aria-label="Wedding story chapters"><div class="chapter-nav-inner"><span class="chapter-nav-label">${title}</span><div class="chapter-links">${nav}</div></div></nav><div class="chapters">${sections}</div><section class="ending" aria-labelledby="ending-title"><p class="eyebrow">The beginning of the next chapter</p><h2 id="ending-title">${title}</h2><p>A day to return to.<br>Photographed by Bill Thorpe.</p><a href="#beginning">Back to the beginning ↑</a></section><noscript><p class="no-script">Select a photograph to open its larger image.</p></noscript></main><dialog class="viewer" aria-label="Wedding photo viewer"><div class="viewer-inner"><div class="viewer-head"><span class="viewer-title" id="viewer-title"></span><button id="close" type="button" aria-label="Close photo viewer" autofocus>Close ×</button></div><div class="viewer-stage"><img id="large" alt=""><div class="viewer-status" id="image-status" role="status" hidden></div></div><div class="viewer-controls"><button id="previous" type="button" aria-label="Previous photograph">← Previous</button><span class="viewer-counter" id="counter" aria-live="polite"></span><button id="next" type="button" aria-label="Next photograph">Next →</button></div><div class="viewer-meta"><span id="filename"></span><a id="download" download>Download photograph ↓</a></div></div></dialog>`;
  return {content,script:`const photos=${json(selected)},base=${json(base)},title=${json(selection.title)};(${client.toString()})(photos,base,title);`,selected};
}

function client(photos,base,title){
  const dialog=document.querySelector('.viewer'),stage=document.querySelector('.viewer-stage'),status=document.querySelector('#image-status'),download=document.querySelector('#download');
  let current=0,opener=null,previousOverflow='',loadToken=0,touch=null;
  function show(index){
    current=(index+photos.length)%photos.length;
    const p=photos[current],token=++loadToken;
    status.hidden=false;status.textContent='Loading photograph…';
    document.querySelector('#filename').textContent=p.filename;
    document.querySelector('#viewer-title').textContent=title+' / '+p.chapter;
    document.querySelector('#counter').textContent=(current+1)+' / '+photos.length;
    download.href=base+'download/'+p.id;download.download=p.filename;
    const large=new Image();large.id='large';large.alt=p.alt;
    large.onload=()=>{if(token===loadToken&&dialog.open)status.hidden=true;};
    large.onerror=()=>{
      if(token!==loadToken||!dialog.open)return;
      status.textContent='This photograph could not load.';
      const retry=document.createElement('button');retry.type='button';retry.textContent='Try again';retry.onclick=()=>{document.querySelector('#close').focus();show(current);};status.append(retry);
    };
    document.querySelector('#large').replaceWith(large);large.src=base+'photo/'+p.id;
  }
  document.querySelectorAll('[data-photo-id]').forEach(a=>a.addEventListener('click',e=>{
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();opener=a;previousOverflow=document.body.style.overflow;
    dialog.showModal();document.body.style.overflow='hidden';show(photos.findIndex(p=>p.id===Number(a.dataset.photoId)));document.querySelector('#close').focus();
  }));
  document.querySelector('#close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{++loadToken;touch=null;document.body.style.overflow=previousOverflow;document.querySelector('#large').removeAttribute('src');download.removeAttribute('href');status.hidden=true;opener?.focus({preventScroll:true});});
  document.querySelector('#previous').onclick=()=>show(current-1);
  document.querySelector('#next').onclick=()=>show(current+1);
  dialog.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}if(e.key==='Home'){e.preventDefault();show(0);}if(e.key==='End'){e.preventDefault();show(photos.length-1);}});
  stage.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  stage.addEventListener('touchmove',e=>{if(e.touches.length!==1)touch=null;},{passive:true});stage.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touch||e.touches.length||e.changedTouches.length!==1){touch=null;return;}const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1));},{passive:true});
  const sections=[...document.querySelectorAll('.chapter')],links=[...document.querySelectorAll('.chapter-links a')];let queued=false;
  function updateChapter(){queued=false;let active=sections[0];for(const section of sections)if(section.getBoundingClientRect().top<=Math.min(innerHeight*.3,200))active=section;links.forEach(link=>{if(link.hash==='#'+active.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateChapter);}},{passive:true});addEventListener('resize',updateChapter);updateChapter();
  addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
}
