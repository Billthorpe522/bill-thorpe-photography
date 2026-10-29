const BASE = '/galleries/rebels/';
import {photos as PHOTOS} from './photos.mjs';
import {siteAssets} from './site-assets.mjs';
const IDS = PHOTOS.map(photo=>photo.id);
const PHOTO_BY_ID = Object.fromEntries(PHOTOS.map(photo=>[photo.id,photo]));
const CAPTIONS = Object.fromEntries(PHOTOS.map(photo=>[photo.id,photo.caption]));
const FILENAMES = Object.fromEntries(PHOTOS.map(photo=>[photo.id,photo.filename]));
const MAX_ASSET_BYTES = 33554432;
const escapeHTML = value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeJSON = value=>JSON.stringify(value).replace(/</g,'\\u003c');
const encoder = new TextEncoder();
const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
const encode = value => btoa(String.fromCharCode(...new Uint8Array(value)));
const css = `*{box-sizing:border-box}body{margin:0;color:#171916;background:#f2f0e9;font:16px/1.5 ui-sans-serif,system-ui,sans-serif}a{color:inherit}.masthead{max-width:1200px;padding:30px 24px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:22px;border-bottom:1px solid #c9ccc2}.brand{font-size:24px;font-weight:800;text-decoration:none;line-height:1}.brand span,.eyebrow{color:#a75434}.brand small{display:block;font-size:8px;letter-spacing:.3em;margin-top:8px}.masthead-label,.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.15em}.gate-wrap{max-width:580px;margin:70px auto 90px;padding:0 24px}.gate-wrap h1{font-size:clamp(70px,15vw,110px);line-height:.95;letter-spacing:-.06em;margin:20px 0 30px}.gate-wrap p{color:#676b61}.gate-wrap .eyebrow{color:#a75434}form{margin-top:32px}label{display:block;font-size:13px;margin-bottom:9px}input,button{font:inherit;width:100%;min-height:52px;border:1px solid #a6ab9d;padding:12px}input{background:#fff}input:focus-visible,button:focus-visible{outline:3px solid #a75434;outline-offset:3px}.unlock{background:#20251f;color:#f2f0e9;cursor:pointer;margin-top:14px;border-color:#20251f}.error{font-size:13px;color:#9e351d!important;min-height:22px}.hint{font-size:12px}.footer{max-width:1200px;margin:auto;padding:28px 24px;border-top:1px solid #c9ccc2;display:flex;gap:24px;justify-content:space-between;font-size:11px;color:#676b61}@media(max-width:540px){.masthead-label{max-width:110px;text-align:right}.footer{flex-direction:column;gap:8px}.gate-wrap{margin-top:50px}}`;

function headers(type='text/html; charset=utf-8', nonce='') {
  return {'Content-Type':type,'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY','Content-Security-Policy':`default-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`};
}
function page(content, script='', status=200) {
  const nonce=encode(crypto.getRandomValues(new Uint8Array(18)));
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Rebels · 2026 Season | Bill Thorpe Photography</title><style>${css}</style></head><body>${content}<footer class="footer"><a href="/">Bill Thorpe Photography</a><span>Rebels · 2026 Season</span></footer>${script?`<script nonce="${nonce}">${script}</script>`:''}</body></html>`,{status,headers:headers(undefined,nonce)});
}
function gate(error='',status=200) {
 return page(`<header class="masthead"><a class="brand" href="/">Bill Thorpe<span>.</span><small>PHOTOGRAPHY</small></a><span class="masthead-label">Private season gallery</span></header><main class="gate-wrap"><p class="eyebrow">2026 · A season in photographs</p><h1>Rebels</h1><p>At the plate. On the mound. Together.<br>Enter the gallery password to explore the season.</p><form method="post" action="${BASE}unlock"><label for="password">Gallery password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="128" autofocus><button class="unlock" type="submit">View the season →</button><p class="error" role="alert">${escapeHTML(error)}</p></form><p class="hint">Need the password? Contact Bill for access.</p></main>`,'',status);
}
function gallery() {
 return new Response(siteAssets['index.html'].body,{headers:headers()});
}

async function signingKey(env) {return crypto.subtle.importKey('raw',decode(env.SESSION_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function authorized(request,env) {
 try {
  const cookie=(request.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('__Secure-btp-rebels='));
  if(!cookie)return false;
  const token=cookie.slice('__Secure-btp-rebels='.length);const parts=token.split('.');if(parts.length!==3)return false;
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
  if(url.pathname===BASE+'lock')return redirect('__Secure-btp-rebels=; Max-Age=0'+cookieSuffix);
  if(url.pathname!==BASE+'unlock')return new Response('Not found',{status:404,headers:headers('text/plain')});
  const allowed=await env.LOGIN_LIMIT.limit({key:'rebels:'+request.headers.get('CF-Connecting-IP')});
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
  return redirect('__Secure-btp-rebels='+payload+'.'+mac+'; Max-Age=86400'+cookieSuffix);
 }
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:headers('text/plain')});
 if(!await authorized(request,env))return url.pathname===BASE?gate((request.headers.get('Cookie')||'').includes('__Secure-btp-rebels=')?'Your session could not be verified. Please enter the password again.':''):new Response('Gallery password required',{status:401,headers:headers('text/plain')});
 if(url.pathname===BASE)return request.method==='HEAD'?new Response(null,{headers:headers()}):gallery();
 const resourceName=url.pathname.slice(BASE.length);
 const resource=Object.hasOwn(siteAssets,resourceName)?siteAssets[resourceName]:null;
 if(resource)return new Response(request.method==='HEAD'?null:resource.body,{headers:headers(resource.type)});
 const match=url.pathname.match(/^\/galleries\/rebels\/(thumb|photo)\/(\d+)$/);
 if(!match||!IDS.includes(Number(match[2])))return new Response('Not found',{status:404,headers:headers('text/plain')});
 const kind=match[1], n=Number(match[2]), photo=PHOTO_BY_ID[n], asset=photo.variants[kind], expectedKind=kind;
 if(!asset||!/^\d+-(thumb|photo)-[a-f0-9]{12}\.bin$/.test(asset.file)||!asset.file.startsWith(`${n}-${expectedKind}-`)||asset.aad!==`rebels:${n}:${expectedKind}`||!Number.isInteger(asset.plainBytes)||asset.plainBytes<1||asset.bytes!==asset.plainBytes+28||!Number.isInteger(asset.bytes)||asset.bytes<29||asset.bytes>MAX_ASSET_BYTES)return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});
 const imageHeaders={...headers('image/webp'),'Content-Length':String(asset.plainBytes),'Content-Disposition':'inline'+'; filename="'+photo.filename+'"'};
 if(request.method==='HEAD')return new Response(null,{headers:imageHeaders});
 if(!/^[a-f0-9]{40}$/.test(env.ASSET_REF||''))return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});
 const response=await fetch('https://raw.githubusercontent.com/Billthorpe522/bill-thorpe-photography/'+env.ASSET_REF+'/assets/private-rebels/'+asset.file,{redirect:'manual'});
 const declared=Number(response.headers.get('Content-Length')||0);
 if(!response.ok||!response.body||(declared&&declared!==asset.bytes)){console.error(JSON.stringify({event:'gallery-image-source',photo:n,kind,status:response.status}));return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});}
 const imageReader=response.body.getReader();let length=0;const buffers=[];
 while(true){const {done,value}=await imageReader.read();if(done)break;length+=value.length;if(length>asset.bytes||length>MAX_ASSET_BYTES){await imageReader.cancel();return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});}buffers.push(value);}
 if(length!==asset.bytes)return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});
 const encrypted=new Uint8Array(length);let index=0;for(const value of buffers){encrypted.set(value,index);index+=value.length;}buffers.length=0;
 const imageKey=await crypto.subtle.importKey('raw',decode(env.IMAGE_KEY),'AES-GCM',false,['decrypt']);
 const image=await crypto.subtle.decrypt({name:'AES-GCM',iv:encrypted.slice(0,12),additionalData:encoder.encode(asset.aad)},imageKey,encrypted.slice(12));
 if(image.byteLength!==asset.plainBytes)return new Response('Photo unavailable',{status:503,headers:headers('text/plain')});
 return new Response(image,{headers:imageHeaders});
}
export default {async fetch(request,env) {try{return await handle(request,env);}catch(error){console.error(JSON.stringify({event:'gallery-request-error',name:error.name,message:error.message}));return new Response('Gallery temporarily unavailable. Please try again shortly.',{status:503,headers:headers('text/plain')});}}};
