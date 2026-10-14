(function(){
const D=window.SITE_DATA,I=window.I18N,page=document.body.dataset.page;
let lang=localStorage.getItem('lang')||'en';
const t=k=>I[lang][k]||k, L=o=>o==null?'':(typeof o==='object'&&!Array.isArray(o)?(o[lang]??o.en??''):o);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const S=D.settings;
function gallery(it){if(!it.photos.length)return `<div class="noimg">${t('no_photo')}</div>`;
 return `<div class="gal">${it.photos.map((p,i)=>`<img src="${p}" alt="${esc(L(it.name))}" loading="lazy" class="${i?'':'on'}">`).join('')}${it.photos.length>1?'<button class="nx" aria-label="next">›</button>':''}</div>`}
function card(it,type){const f=L(it.features)||[];return `<article class="card">${gallery(it)}<div class="cb"><h3>${esc(L(it.name))}</h3><p>${esc(L(it.description))}</p>
 ${it.guests?`<p class="meta">${t('guests')}: ${it.guests}</p>`:''}${it.duration?`<p class="meta">${t('duration')}: ${esc(L(it.duration))}</p>`:''}
 ${f.length?`<ul class="feat">${f.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
 <p class="price">${esc(L(it.price))}</p><a class="btn" href="booking.html?${type}=${it.slug}">${t('request')}</a></div></article>`}
const grid=(type,list)=>`<div class="grid">${(list||D[type]).map(i=>card(i,type)).join('')}</div>`;
const note=()=>`<p class="ph">${t('placeholder_note')}</p>`;
function header(){const nav=[['index','nav_home'],['rooms','nav_rooms'],['tours','nav_tours'],['transfers','nav_transfers']];
 return `<header class="hd"><a class="logo" href="index.html"><span class="lm">⛰</span><span>KHAOSOK<br>RIVER HILLS<small>RESORT</small></span></a>
 <input type="checkbox" id="mt"><label for="mt" class="burger">☰</label>
 <nav>${nav.map(([p,k])=>`<a href="${p}.html" class="${p===page?'act':''}">${t(k)}</a>`).join('')}<a class="btn" href="booking.html">${t('nav_book')}</a></nav>
 <button id="lang" class="lang" aria-label="language">${t('switch')}</button></header>`}
function footer(){return `<footer class="ft"><div><b>Khaosok River Hills Resort</b><br>${t('address')}</div>
 <div><b>${t('contact')}</b><br>${t('phone')}: ${esc(S.phone)}<br>${t('line')}: ${esc(S.line_id)}<br>${t('email')}: ${esc(S.email)}</div>${note()}</footer>`}
const views={
index:()=>`<section class="hero"><div class="hi"><h1>${t('hero_title')}</h1><p>${t('hero_sub')}</p><a class="btn big" href="booking.html">${t('hero_cta')}</a> <a class="btn ghost big" href="rooms.html">${t('hero_rooms')}</a></div></section>
 <section class="why">${[1,2,3].map(n=>`<div><span>${['🌿','🏞','🚤'][n-1]}</span><h3>${t('why'+n)}</h3><p>${t('why'+n+'d')}</p></div>`).join('')}</section>
 <section class="wrap"><h2>${t('featured_rooms')}</h2>${grid('rooms')}<h2>${t('featured_tours')}</h2>${grid('tours',D.tours.slice(0,3))}${note()}</section>`,
rooms:()=>`<section class="wrap"><h1>${t('rooms_title')}</h1>${note()}${grid('rooms')}</section>`,
tours:()=>`<section class="wrap"><h1>${t('tours_title')}</h1>${note()}${grid('tours')}</section>`,
transfers:()=>`<section class="wrap"><h1>${t('transfers_title')}</h1>${note()}${grid('transfers')}</section>`,
booking:()=>{const opt=(type,none)=>`${none?`<option value="">${t('none')}</option>`:''}${D[type].map(i=>`<option value="${i.slug}">${esc(L(i.name))} — ${esc(L(i.price))}</option>`).join('')}`;
 const fld=(k,inp)=>`<label>${t(k)}${inp}</label>`;
 return `<section class="wrap bk"><form id="bf" class="panel"><h1>${t('book_title')}</h1><p>${t('book_sub')}</p>
 <div class="two">${fld('f_name','<input name="name" required>')}${fld('f_phone','<input name="phone" type="tel">')}
 ${fld('f_checkin','<input name="checkin" type="date">')}${fld('f_checkout','<input name="checkout" type="date">')}
 ${fld('f_guests','<input name="guests" type="number" min="1" value="2">')}${fld('f_room',`<select name="rooms">${opt('rooms')}</select>`)}
 ${fld('f_tour',`<select name="tours">${opt('tours',1)}</select>`)}${fld('f_transfer',`<select name="transfers">${opt('transfers',1)}</select>`)}</div>
 ${fld('f_note','<textarea name="note" rows="3"></textarea>')}
 <div class="acts"><button type="button" id="em" class="btn big">✉ ${t('send_email')}</button><button type="button" id="ln" class="btn line big">LINE · ${t('send_line')}</button></div>
 <p class="meta">${t('copy_hint')}</p><p id="msg" class="meta"></p>${note()}</form></section>`}};
function summary(f){const g=n=>f.elements[n].value, nm=(type,s)=>{const i=D[type].find(x=>x.slug===s);return i?L(i.name):'-'};
 return [`${t('f_name')}: ${g('name')}`,`${t('f_phone')}: ${g('phone')}`,`${t('f_checkin')}: ${g('checkin')}`,`${t('f_checkout')}: ${g('checkout')}`,`${t('f_guests')}: ${g('guests')}`,
 `${t('f_room')}: ${nm('rooms',g('rooms'))}`,`${t('f_tour')}: ${nm('tours',g('tours'))}`,`${t('f_transfer')}: ${nm('transfers',g('transfers'))}`,`${t('f_note')}: ${g('note')}`].join('\n')}
function render(){document.documentElement.lang=lang;
 document.getElementById('header').innerHTML=header();document.getElementById('main').innerHTML=views[page]();document.getElementById('footer').innerHTML=footer();
 document.getElementById('lang').onclick=()=>{lang=lang==='en'?'th':'en';localStorage.setItem('lang',lang);render()};
 document.querySelectorAll('.gal .nx').forEach(b=>b.onclick=()=>{const im=[...b.parentNode.querySelectorAll('img')],i=im.findIndex(x=>x.classList.contains('on'));im[i].classList.remove('on');im[(i+1)%im.length].classList.add('on')});
 const f=document.getElementById('bf'); if(f){const q=new URLSearchParams(location.search);['rooms','tours','transfers'].forEach(k=>{if(q.get(k))f.elements[k].value=q.get(k)});
  document.getElementById('em').onclick=()=>{if(!f.reportValidity())return;location.href=`mailto:${S.email}?subject=${encodeURIComponent(t('mail_subject'))}&body=${encodeURIComponent(summary(f))}`};
  document.getElementById('ln').onclick=()=>{const s=summary(f);(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>{document.getElementById('msg').textContent=t('copied')}).catch(()=>{});window.open(S.line_url,'_blank')};}}
const q=new URLSearchParams(location.search).get('lang');if(q==='th'||q==='en'){lang=q;localStorage.setItem('lang',lang)}
render();})();
