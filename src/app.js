(function(){
const D=window.SITE_DATA,I=window.I18N,page=document.body.dataset.page;
let lang=localStorage.getItem('lang')||'en';
const t=k=>I[lang][k]||k, L=o=>o==null?'':(typeof o==='object'&&!Array.isArray(o)?(o[lang]??o.en??''):o);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const S=D.settings||{}, P=D.policies||{}, Tport=D.transport||{};
const waList=(S.whatsapp||[]).filter(w=>w&&w.url);

function gallery(it){
  if(!it.photos||!it.photos.length) return `<div class="noimg">${t('no_photo')}</div>`;
  return `<div class="gal">${it.photos.map((p,i)=>`<img src="${p}" alt="${esc(L(it.name))}" loading="lazy" class="${i?'':'on'}">`).join('')}${it.photos.length>1?'<button class="nx" aria-label="next">›</button>':''}</div>`;
}
function list(v){
  const a=L(v); if(!a||!a.length) return '';
  const items=Array.isArray(a)?a:[a];
  return `<ul class="feat">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
}
function priceOf(it){
  const txt=L(it.price)||'';
  if(!txt) return '';
  if(it.booking_url) return `<a class="bookcom" href="${esc(it.booking_url)}" target="_blank" rel="noopener">${esc(txt)}</a>`;
  return esc(txt);
}
function badges(it){
  let h='';
  if(it.category) h+=`<span class="badge">${esc(L(it.category))}</span>`;
  if(it.type) h+=`<span class="badge">${esc(L(it.type))}</span>`;
  return h;
}
function card(it,type,opts={}){
  const f=L(it.features)||[];
  const more=opts.details?`<a class="btn ghost2" href="tours.html?id=${encodeURIComponent(it.slug)}">${t('details')}</a>`:'';
  return `<article class="card">${gallery(it)}<div class="cb">
    ${type==='tours'?badges(it):''}
    <h3>${esc(L(it.name))}</h3><p>${esc(L(it.description))}</p>
    ${it.size?`<p class="meta">${t('size')}: ${esc(L(it.size))}</p>`:''}
    ${it.guests?`<p class="meta">${t('guests')}: ${it.guests}</p>`:''}
    ${it.beds?`<p class="meta">${t('beds')}: ${esc(L(it.beds))}</p>`:''}
    ${it.duration?`<p class="meta">${t('duration')}: ${esc(L(it.duration))}</p>`:''}
    ${it.times?`<p class="meta">${esc(L(it.times))}</p>`:''}
    ${f.length?`<ul class="feat">${f.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
    <p class="price">${priceOf(it)}</p>
    <div class="acts"><a class="btn" href="booking.html?${type}=${it.slug}">${t('request')}</a>${more}</div>
  </div></article>`;
}
const grid=(type,listItems,opts)=>`<div class="grid">${(listItems||D[type]).map(i=>card(i,type,opts)).join('')}</div>`;
const note=()=>`<p class="ph">${t('placeholder_note')}</p>`;

function waLinks(){
  if(!waList.length) return '';
  return waList.map(w=>`<a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.label||w.url)}</a>`).join(' · ');
}
function header(){
  const nav=[['index','nav_home'],['rooms','nav_rooms'],['tours','nav_tours'],['transfers','nav_transfers']];
  return `<header class="hd"><a class="logo" href="index.html"><span class="lm">⛰</span><span>KHAOSOK<br>RIVER HILLS<small>RESORT</small></span></a>
 <input type="checkbox" id="mt"><label for="mt" class="burger">☰</label>
 <nav>${nav.map(([p,k])=>`<a href="${p}.html" class="${p===page?'act':''}">${t(k)}</a>`).join('')}<a class="btn" href="booking.html">${t('nav_book')}</a></nav>
 <button id="lang" class="lang" aria-label="language">${t('switch')}</button></header>`;
}
function footer(){
  const wa=waLinks();
  return `<footer class="ft"><div><b>Khaosok River Hills Resort</b><br>${t('address')}</div>
 <div><b>${t('contact')}</b><br>
 ${wa?`${t('whatsapp')}: ${wa}<br>`:''}
 ${S.phone&&!waList.length?`${t('phone')}: ${esc(S.phone)}<br>`:''}
 ${S.line_id?`${t('line')}: ${esc(S.line_id)}<br>`:''}
 ${S.email?`${t('email')}: ${esc(S.email)}`:''}
 </div>${note()}</footer>`;
}

function photoSection(){
  const albums=D.gallery||[];
  const imgs=[];
  albums.forEach(a=>(a.photos||[]).forEach(p=>imgs.push({src:p,alt:L(a.name)})));
  if(!imgs.length) return '';
  return `<section class="wrap"><h2>${t('gallery_title')}</h2><p class="meta">${t('gallery_sub')}</p>
    <div class="photogrid">${imgs.map(i=>`<img src="${i.src}" alt="${esc(i.alt)}" loading="lazy">`).join('')}</div>
  </section>`;
}

function policyBlock(){
  if(!P.important) return '';
  const imp=P.important, can=P.cancellation||{}, park=P.park_fees||{};
  return `<section class="policy" id="tour-info">
    <h2>${esc(L(imp.title))}</h2>
    <p>${esc(L(imp.intro))}</p>
    ${list(imp.items)}
    <p><em>${esc(L(imp.insurance))}</em></p>
    ${can.title?`<h3>${esc(L(can.title))}</h3>${list(can.items)}`:''}
    ${park.title?`<h3>${esc(L(park.title))}</h3><p>${esc(L(park.text))}</p>`:''}
  </section>`;
}

function groups(list){
  const order=[], map=new Map();
  (list||[]).forEach(it=>{
    const key=L(it.category)||'';
    if(!map.has(key)){map.set(key,[]);order.push(key)}
    map.get(key).push(it);
  });
  return order.map(k=>({name:k,items:map.get(k)}));
}

function tourDetail(it){
  const itin=L(it.itinerary)||[];
  return `<section class="wrap">
    <p><a href="tours.html">${t('back_tours')}</a></p>
    <article class="detail">
      ${gallery(it)}
      <div style="padding-top:16px">${badges(it)}
        <h1>${esc(L(it.name))}</h1>
        <p class="lead">${esc(L(it.description))}</p>
        ${it.duration?`<p class="meta">${t('duration')}: ${esc(L(it.duration))}</p>`:''}
        ${it.times?`<p class="meta">${esc(L(it.times))}</p>`:''}
        <p class="price">${priceOf(it)}</p>
        ${it.highlights?`<h3>${t('highlights')}</h3>${list(it.highlights)}`:''}
        ${itin.length?`<h3>${t('itinerary')}</h3><ol class="itin">${itin.map(x=>`<li><span class="tm">${esc(x.time||'')}</span><span>${esc(x.text||'')}</span></li>`).join('')}</ol>`:''}
        ${it.includes?`<h3>${t('includes')}</h3>${list(it.includes)}`:''}
        ${it.excludes?`<h3>${t('excludes')}</h3>${list(it.excludes)}`:''}
        ${it.bring?`<h3>${t('bring')}</h3>${list(it.bring)}`:''}
        ${it.notes?`<h3>${t('notes')}</h3><p>${esc(L(it.notes))}</p>`:''}
        <p class="acts"><a class="btn big" href="booking.html?tours=${it.slug}">${t('request')}</a></p>
      </div>
    </article>
    ${policyBlock()}
    ${note()}
  </section>`;
}

function toursHome(){
  const featured=(D.tours||[]).filter(x=>['01-village-tour-khaosok','04-full-day-lake-diamond-cave','18-night-safari'].includes(x.slug));
  return `<section class="hero"><div class="hi"><h1>${t('hero_title')}</h1><p>${t('hero_sub')}</p>
    <a class="btn big" href="booking.html">${t('hero_cta')}</a> <a class="btn ghost big" href="rooms.html">${t('hero_rooms')}</a></div></section>
    <section class="why">${[1,2,3].map(n=>`<div><span>${['🌿','🏞','🚤'][n-1]}</span><h3>${t('why'+n)}</h3><p>${t('why'+n+'d')}</p></div>`).join('')}</section>
    ${photoSection()}
    <section class="wrap"><h2>${t('featured_rooms')}</h2>${grid('rooms')}
    <h2>${t('featured_tours')}</h2>${grid('tours',featured.length?featured:(D.tours||[]).slice(0,3),{details:true})}
    <p><a class="btn ghost2" href="tours.html">${t('see_all_tours')}</a></p>
    ${note()}</section>`;
}

function toursPage(){
  const id=new URLSearchParams(location.search).get('id');
  if(id){
    const it=(D.tours||[]).find(x=>x.slug===id);
    if(it) return tourDetail(it);
  }
  const blocks=groups(D.tours).map(g=>`<h2 class="cat-h">${esc(g.name||t('tours_title'))}</h2>${grid('tours',g.items,{details:true})}`).join('');
  return `<section class="wrap"><h1>${t('tours_title')}</h1>${note()}${blocks}${policyBlock()}</section>`;
}

function transfersPage(){
  const ph=Tport.shared_phuket||{};
  const rows=(ph.rows||[]).map(r=>`<tr><td>${esc(L(r.dest))}</td><td>฿${Number(r.price).toLocaleString()} / ${lang==='th'?'ท่าน':'person'}</td></tr>`).join('');
  const mb=Tport.minibus||{}, pv=Tport.private_van||{}, oth=Tport.shared_other||{};
  return `<section class="wrap"><h1>${t('transfers_title')}</h1>${note()}
    <div class="block" id="shared-phuket">
      <h2>${esc(L(ph.title)||t('transport_shared'))}</h2>
      ${ph.times?`<p class="meta">${esc(L(ph.times))}</p>`:''}
      ${rows?`<table class="tbl"><thead><tr><th>${t('dest')}</th><th>${t('fare')}</th></tr></thead><tbody>${rows}</tbody></table>`:''}
      ${ph.notes?`<p>${esc(L(ph.notes))}</p>`:''}
    </div>
    ${oth.title?`<div class="block"><h2>${esc(L(oth.title))}</h2><p>${esc(L(oth.text))}</p></div>`:''}
    ${mb.title?`<div class="block"><h2>${esc(L(mb.title))}</h2>
      ${mb.departures?`<p class="meta">${esc((mb.departures||[]).join(' · '))}</p>`:''}
      ${mb.effective?`<p class="meta">${esc(L(mb.effective))}</p>`:''}
      ${mb.notes?`<p>${esc(L(mb.notes))}</p>`:''}</div>`:''}
    ${pv.title?`<div class="block"><h2>${esc(L(pv.title))}</h2><p>${esc(L(pv.text))}</p></div>`:''}
    <h2>${t('request')}</h2>
    ${grid('transfers')}
  </section>`;
}

function bookingPage(){
  const opt=(type,none)=>`${none?`<option value="">${t('none')}</option>`:''}${(D[type]||[]).map(i=>`<option value="${i.slug}">${esc(L(i.name))} — ${esc(L(i.price))}</option>`).join('')}`;
  const fld=(k,inp)=>`<label>${t(k)}${inp}</label>`;
  const waBtns=waList.map((w,i)=>`<button type="button" class="btn wa big" data-wa="${esc(w.url)}">${t('send_wa')}${waList.length>1?' · '+esc(w.label):''}</button>`).join('');
  const em=S.email?`<button type="button" id="em" class="btn big">✉ ${t('send_email')}</button>`:'';
  const ln=S.line_url?`<button type="button" id="ln" class="btn line big">LINE · ${t('send_line')}</button>`:'';
  return `<section class="wrap bk"><form id="bf" class="panel"><h1>${t('book_title')}</h1><p>${t('book_sub')}</p>
    <div class="two">${fld('f_name','<input name="name" required>')}${fld('f_phone','<input name="phone" type="tel">')}
    ${fld('f_checkin','<input name="checkin" type="date">')}${fld('f_checkout','<input name="checkout" type="date">')}
    ${fld('f_guests','<input name="guests" type="number" min="1" value="2">')}${fld('f_room',`<select name="rooms">${opt('rooms')}</select>`)}
    ${fld('f_tour',`<select name="tours">${opt('tours',1)}</select>`)}${fld('f_transfer',`<select name="transfers">${opt('transfers',1)}</select>`)}</div>
    ${fld('f_note','<textarea name="note" rows="3"></textarea>')}
    <div class="acts">${waBtns}${em}${ln}</div>
    <p class="meta">${t('copy_hint')}</p><p id="msg" class="meta"></p>${note()}</form>
    ${policyBlock()}
  </section>`;
}

const views={
  index:toursHome,
  rooms:()=>`<section class="wrap"><h1>${t('rooms_title')}</h1>${note()}${grid('rooms')}</section>`,
  tours:toursPage,
  transfers:transfersPage,
  booking:bookingPage
};

function summary(f){
  const g=n=>f.elements[n].value, nm=(type,s)=>{const i=(D[type]||[]).find(x=>x.slug===s);return i?L(i.name):'-'};
  return [`${t('wa_greeting')}`,`${t('f_name')}: ${g('name')}`,`${t('f_phone')}: ${g('phone')}`,`${t('f_checkin')}: ${g('checkin')}`,`${t('f_checkout')}: ${g('checkout')}`,`${t('f_guests')}: ${g('guests')}`,
   `${t('f_room')}: ${nm('rooms',g('rooms'))}`,`${t('f_tour')}: ${nm('tours',g('tours'))}`,`${t('f_transfer')}: ${nm('transfers',g('transfers'))}`,`${t('f_note')}: ${g('note')}`].join('\n');
}

function render(){
  document.documentElement.lang=lang;
  document.getElementById('header').innerHTML=header();
  document.getElementById('main').innerHTML=views[page]();
  document.getElementById('footer').innerHTML=footer();
  document.getElementById('lang').onclick=()=>{lang=lang==='en'?'th':'en';localStorage.setItem('lang',lang);render()};
  document.querySelectorAll('.gal .nx').forEach(b=>b.onclick=()=>{const im=[...b.parentNode.querySelectorAll('img')],i=im.findIndex(x=>x.classList.contains('on'));im[i].classList.remove('on');im[(i+1)%im.length].classList.add('on')});
  const f=document.getElementById('bf');
  if(f){
    const q=new URLSearchParams(location.search);
    ['rooms','tours','transfers'].forEach(k=>{if(q.get(k)&&f.elements[k])f.elements[k].value=q.get(k)});
    const sendWa=url=>{
      if(!f.reportValidity())return;
      const s=summary(f);
      const go=()=>window.open(url+(url.includes('?')?'&':'?')+'text='+encodeURIComponent(s),'_blank');
      (navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>{document.getElementById('msg').textContent=t('copied');go()}).catch(()=>go());
    };
    document.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>sendWa(b.dataset.wa));
    const em=document.getElementById('em');
    if(em) em.onclick=()=>{if(!f.reportValidity())return;location.href=`mailto:${S.email}?subject=${encodeURIComponent(t('mail_subject'))}&body=${encodeURIComponent(summary(f))}`};
    const ln=document.getElementById('ln');
    if(ln) ln.onclick=()=>{const s=summary(f);(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>{document.getElementById('msg').textContent=t('copied')}).catch(()=>{});window.open(S.line_url,'_blank')};
  }
}
const q=new URLSearchParams(location.search).get('lang');if(q==='th'||q==='en'){lang=q;localStorage.setItem('lang',lang)}
render();
})();
