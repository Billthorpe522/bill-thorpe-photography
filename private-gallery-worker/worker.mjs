const BASE = '/galleries/lw-vs-andrew/';
const IDS = [20, 36, 191, 236, 6, 51, 46, 141, 258, 94, 21, 24, 27, 58, 63, 83, 123, 137, 138, 151, 201, 224, 245, 273, 1, 10, 12, 18, 29, 31, 33, 35, 48, 55, 56, 69, 72, 77, 78, 81, 84, 86, 91, 98, 100, 101, 104, 107, 108, 113, 117, 122, 127, 130, 133, 140, 143, 144, 145, 148, 154, 156, 158, 161, 163, 167, 176, 179, 181, 182, 196, 197, 204, 205, 206, 209, 210, 212, 219, 221, 227, 229, 232, 234, 243, 244, 246, 248, 250, 253, 255, 261, 263, 264, 267, 270, 276, 278, 282, 284];
const encoder = new TextEncoder();
const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
const encode = value => btoa(String.fromCharCode(...new Uint8Array(value)));
const css = `*{box-sizing:border-box}body{margin:0;background:#f2f0e9;color:#171916;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}header{padding:22px 5vw;border-bottom:1px solid #c9ccc2;display:flex;justify-content:space-between;align-items:center;gap:16px}.brand{font-size:20px;letter-spacing:-1px;font-weight:800;text-decoration:none}.brand span,.eyebrow{color:#a9522c}main{max-width:1440px;margin:auto;padding:42px 5vw 60px}h1{font-size:clamp(36px,5vw,68px);line-height:1.02;letter-spacing:-3px;margin:12px 0 20px}.eyebrow{font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase}p{color:#62675f}.gate{max-width:500px;margin:8vh auto}label{display:block;font-size:14px;font-weight:700;margin-bottom:8px}input{display:block;width:100%;padding:15px;font:inherit;border:1px solid #9a9e94;border-radius:5px;background:#fff;color:#171916}button{font:inherit;cursor:pointer;border:1px solid #171916;padding:12px 18px;background:#171916;color:#f2f0e9;border-radius:5px;min-height:46px}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #bd6035;outline-offset:4px}.unlock{width:100%;margin-top:16px}.subtle{background:transparent;color:inherit;border-color:#a2a69b}.intro{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:30px}.intro p{margin-bottom:0}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 18px}.photo{border:0;padding:0;background:transparent;color:inherit;text-align:left;border-radius:0}.photo img{display:block;width:100%;aspect-ratio:3/2;object-fit:contain;background:#171916}.photo span{display:block;font-size:12px;letter-spacing:1px;margin-top:9px}.photo:hover img{outline:2px solid #a9522c;outline-offset:3px}footer{padding:24px 5vw;border-top:1px solid #c9ccc2;font-size:12px;color:#62675f}dialog{padding:0;border:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;background:#10120f;color:#f2f0e9}dialog::backdrop{background:#10120f}.viewer{height:100%;display:flex;flex-direction:column;padding:16px}.viewer-head,.viewer-foot{display:flex;align-items:center;justify-content:space-between;gap:12px}.viewer img{display:block;flex:1;min-height:0;object-fit:contain;width:100%;margin:16px 0}.viewer button{background:transparent;color:inherit;border-color:#596052}.viewer-foot{justify-content:center}.error{color:#9d241c;min-height:24px}.viewer .error{color:#ffcbbd;text-align:center;margin:0}.counter{min-width:95px;text-align:center}.hint{font-size:13px}noscript p{color:#9d241c}@media(max-width:850px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.intro{display:block}.intro p{margin-top:15px}}@media(max-width:520px){main{padding:30px 18px}.grid{grid-template-columns:1fr;gap:24px}.gate{margin:5vh auto}header{padding:18px}.intro{margin-bottom:25px}h1{letter-spacing:-2px}.viewer{padding:12px}.viewer-head{font-size:13px}}`;

function headers(type='text/html; charset=utf-8', nonce='') {
  return {'Content-Type':type,'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Content-Security-Policy':`default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`};
}
function page(content, script='', status=200) {
  const nonce=encode(crypto.getRandomValues(new Uint8Array(18)));
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>LW vs Andrew | Bill Thorpe Photography</title><style>${css}</style></head><body>${content}<footer>Bill Thorpe Photography · LW vs Andrew</footer>${script?`<script nonce="${nonce}">${script}</script>`:''}</body></html>`,{status,headers:headers(undefined,nonce)});
}
function gate(error='',status=200) {
 return page(`<header><a class="brand" href="/">Bill Thorpe<span>.</span></a><span>Private gallery</span></header><main><div class="gate"><div class="eyebrow">Players & families</div><h1>LW vs Andrew</h1><p>100 selected photographs from the game.<br>Enter your shared gallery password to view the photographs.</p><form method="post" action="${BASE}unlock"><label for="password">Gallery password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="128" autofocus><button class="unlock" type="submit">View photographs →</button><p class="error" role="alert">${error}</p></form><p class="hint">Need the password? Contact Bill or your team organizer.</p></div></main>`,'',status);
}
function gallery() {
 const items=IDS.map((n,i)=>`<button class="photo" type="button" data-index="${i}" aria-label="Open photograph LwAndrew-${n}"><img src="${BASE}photo/${n}" alt="LW vs Andrew football photograph ${n}" width="1600" height="1067" loading="${i<3?'eager':'lazy'}"><span>LWANDREW-${n}</span></button>`);
 return page(`<header><a class="brand" href="/">Bill Thorpe<span>.</span></a><form method="post" action="${BASE}lock"><button class="subtle" type="submit">Lock gallery</button></form></header><main><div class="intro"><div><div class="eyebrow">Players & families · Selected photographs</div><h1>LW vs Andrew</h1></div><p>${IDS.length} photographs<br><span class="hint">Tap a photograph to view it larger.</span></p></div><nav aria-label="Gallery sections"><a href="#highlights">Highlights</a> · <a href="#game">More from the game</a></nav><h2 id="highlights">Highlights</h2><div class="grid">${items.slice(0,24).join('')}</div><h2 id="game" style="margin-top:48px">More from the game</h2><div class="grid">${items.slice(24).join('')}</div><noscript><p>Enable JavaScript for the full-screen photo viewer.</p></noscript></main><dialog aria-label="Photo viewer"><div class="viewer"><div class="viewer-head"><span id="filename"></span><button id="close" type="button" aria-label="Close photo viewer">Close ×</button></div><img id="large" alt=""><p class="error" id="image-error" role="alert"></p><div class="viewer-foot"><button id="previous" type="button" aria-label="Previous photograph">← Previous</button><span class="counter" id="counter"></span><button id="next" type="button" aria-label="Next photograph">Next →</button></div></div></dialog>`,
 `const ids=${JSON.stringify(IDS)},base=${JSON.stringify(BASE)};const dialog=document.querySelector('dialog'),large=document.querySelector('#large');let current=0,startX=0;function show(i){current=(i+ids.length)%ids.length;large.src=base+'photo/'+ids[current];large.alt='LW vs Andrew football photograph '+ids[current];document.querySelector('#filename').textContent='LwAndrew-'+ids[current]+'.jpg';document.querySelector('#counter').textContent=(current+1)+' / '+ids.length;document.querySelector('#image-error').textContent='';}document.querySelectorAll('.photo').forEach(b=>b.addEventListener('click',()=>{show(Number(b.dataset.index));dialog.showModal();document.body.style.overflow='hidden';}));document.querySelector('#close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.style.overflow='';large.removeAttribute('src');});document.querySelector('#previous').onclick=()=>show(current-1);document.querySelector('#next').onclick=()=>show(current+1);dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});large.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});large.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>60)show(current+(delta<0?1:-1));},{passive:true});large.onerror=()=>{document.querySelector('#image-error').textContent='Photo could not load. Refresh the gallery to sign in again.';};window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});`);
}
async function signingKey(env) {return crypto.subtle.importKey('raw',decode(env.SESSION_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function authorized(request,env) {
 try {
  const cookie=(request.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('__Secure-btp-lw='));
  if(!cookie)return false;
  const token=cookie.slice('__Secure-btp-lw='.length);const parts=token.split('.');if(parts.length!==3)return false;
  const [exp,random,mac]=parts;const now=Math.floor(Date.now()/1000);
  if(!/^\d+$/.test(exp)||Number(exp)<=now||Number(exp)>now+86400||!/^[a-f0-9-]{36}$/.test(random))return false;
  return crypto.subtle.verify('HMAC',await signingKey(env),decode(mac),encoder.encode('session:'+exp+'.'+random));
 } catch {return false;}
}
function redirect(cookie) {return new Response(null,{status:303,headers:{...headers(),'Location':BASE,...(cookie?{'Set-Cookie':cookie}:{})}});}
const cookieSuffix=`; Path=${BASE}; Secure; HttpOnly; SameSite=Strict`;
async function handle(request,env) {
 const url=new URL(request.url);
 if(url.hostname!=='billthorpephotography.com')return new Response('Not found',{status:404,headers:headers('text/plain')});
 if(url.protocol!=='https:')return new Response(null,{status:308,headers:{Location:'https://billthorpephotography.com'+url.pathname}});
 if(url.pathname===BASE.slice(0,-1))return redirect();
 if(!url.pathname.startsWith(BASE))return new Response('Not found',{status:404,headers:headers('text/plain')});
 if(request.method==='POST') {
  if(request.headers.get('Origin')!==url.origin)return new Response('Invalid origin',{status:403,headers:headers('text/plain')});
  if(url.pathname===BASE+'lock')return redirect('__Secure-btp-lw=; Max-Age=0'+cookieSuffix);
  if(url.pathname!==BASE+'unlock')return new Response('Not found',{status:404,headers:headers('text/plain')});
  const allowed=await env.LOGIN_LIMIT.limit({key:'lw:'+request.headers.get('CF-Connecting-IP')});
  if(!allowed.success){const response=gate('Too many attempts. Please wait one minute and try again.',429);response.headers.set('Retry-After','60');return response;}
  if(Number(request.headers.get('Content-Length')||0)>1024)return gate('Password is too long.',413);
  if(!(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))return gate('Please use the password form.',400);
  const reader=request.body?.getReader();let bytes=0;const chunks=[];if(reader){while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>1024){await reader.cancel();return gate('Password is too long.',413);}chunks.push(value);}}
  const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
  const password=new URLSearchParams(new TextDecoder().decode(body)).get('password')||'';
  const key=await signingKey(env);
  if(!await crypto.subtle.verify('HMAC',key,decode(env.PASSWORD_MAC),encoder.encode('password:'+password)))return gate('That password did not match. Please try again.',401);
  const payload=Math.floor(Date.now()/1000+86400)+'.'+crypto.randomUUID();
  const mac=encode(await crypto.subtle.sign('HMAC',key,encoder.encode('session:'+payload)));
  return redirect('__Secure-btp-lw='+payload+'.'+mac+'; Max-Age=86400'+cookieSuffix);
 }
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:headers('text/plain')});
 if(!await authorized(request,env))return url.pathname===BASE?gate((request.headers.get('Cookie')||'').includes('__Secure-btp-lw=')?'Your session could not be verified. Please enter the password again.':''):new Response('Gallery password required',{status:401,headers:headers('text/plain')});
 if(url.pathname===BASE)return request.method==='HEAD'?new Response(null,{headers:headers()}):gallery();
 const match=url.pathname.match(/^\/galleries\/lw-vs-andrew\/photo\/(\d+)$/);
 if(!match||!IDS.includes(Number(match[1])))return new Response('Not found',{status:404,headers:headers('text/plain')});
 if(request.method==='HEAD')return new Response(null,{headers:headers('image/jpeg')});
 const n=Number(match[1]);
 const response=await fetch('https://raw.githubusercontent.com/Billthorpe522/bill-thorpe-photography/'+env.ASSET_REF+'/assets/private-lw-andrew/'+n+'.bin',{redirect:'error'});
 if(!response.ok||Number(response.headers.get('Content-Length')||0)>600000)return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});
 const imageReader=response.body.getReader();let length=0;const buffers=[];
 while(true){const {done,value}=await imageReader.read();if(done)break;length+=value.length;if(length>600000){await imageReader.cancel();return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});}buffers.push(value);}
 const encrypted=new Uint8Array(length);let index=0;for(const value of buffers){encrypted.set(value,index);index+=value.length;}
 const imageKey=await crypto.subtle.importKey('raw',decode(env.IMAGE_KEY),'AES-GCM',false,['decrypt']);
 const image=await crypto.subtle.decrypt({name:'AES-GCM',iv:encrypted.slice(0,12),additionalData:encoder.encode('lw-andrew:'+n)},imageKey,encrypted.slice(12));
 return new Response(image,{headers:headers('image/jpeg')});
}
export default {async fetch(request,env) {try{return await handle(request,env);}catch{return new Response('Gallery temporarily unavailable. Please try again shortly.',{status:503,headers:headers('text/plain')});}}};
