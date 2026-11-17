// Build: node build.js  -> outputs dist/ (static, for Cloudflare Pages)
const fs=require('fs'),path=require('path');
const OUT='dist',IMG=/\.(jpe?g|png|webp|gif|svg|avif)$/i;
function loadJson(f){
  try{return JSON.parse(fs.readFileSync(f,'utf8'))}
  catch(e){console.error('JSON error in '+f+': '+e.message);process.exit(1)}
}
function collect(type){
  const dir=path.join('content',type); const list=[];
  if(!fs.existsSync(dir)) return list;
  for(const slug of fs.readdirSync(dir).sort()){
    const f=path.join(dir,slug,'info.json'); if(!fs.existsSync(f)) continue;
    const item=loadJson(f);
    if(item.hidden) continue;
    const pd=path.join(dir,slug,'photos');
    const photos=fs.existsSync(pd)?fs.readdirSync(pd).filter(x=>IMG.test(x)).sort():[];
    const dest=path.join(OUT,'photos',type,slug); fs.mkdirSync(dest,{recursive:true});
    photos.forEach(p=>fs.copyFileSync(path.join(pd,p),path.join(dest,p)));
    item.slug=slug;
    item.photos=photos.map(p=>`photos/${type}/${slug}/${encodeURIComponent(p)}`);
    list.push(item);
  }
  list.sort((a,b)=>(a.order??99)-(b.order??99));
  return list;
}
fs.rmSync(OUT,{recursive:true,force:true});
fs.cpSync('src',OUT,{recursive:true});
const data={
  settings:loadJson('content/settings.json'),
  policies:fs.existsSync('content/policies.json')?loadJson('content/policies.json'):{},
  transport:fs.existsSync('content/transport.json')?loadJson('content/transport.json'):{},
  rooms:collect('rooms'),
  tours:collect('tours'),
  transfers:collect('transfers'),
  gallery:collect('gallery')
};
fs.writeFileSync(path.join(OUT,'data.js'),'window.SITE_DATA='+JSON.stringify(data)+';');
console.log('Built dist/:',['rooms','tours','transfers','gallery'].map(t=>t+'='+data[t].length).join(', '));
