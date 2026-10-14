// Build: node build.js  -> outputs dist/ (static, for Cloudflare Pages)
const fs=require('fs'),path=require('path');
const OUT='dist',IMG=/\.(jpe?g|png|webp|gif|svg|avif)$/i;
fs.rmSync(OUT,{recursive:true,force:true});
fs.cpSync('src',OUT,{recursive:true});
const data={settings:JSON.parse(fs.readFileSync('content/settings.json','utf8'))};
for(const type of ['rooms','tours','transfers']){
  const dir=path.join('content',type); data[type]=[];
  for(const slug of fs.readdirSync(dir).sort()){
    const f=path.join(dir,slug,'info.json'); if(!fs.existsSync(f)) continue;
    let item; try{item=JSON.parse(fs.readFileSync(f,'utf8'))}catch(e){console.error('JSON error in '+f+': '+e.message);process.exit(1)}
    if(item.hidden) continue;
    const pd=path.join(dir,slug,'photos'); const photos=fs.existsSync(pd)?fs.readdirSync(pd).filter(x=>IMG.test(x)).sort():[];
    const dest=path.join(OUT,'photos',type,slug); fs.mkdirSync(dest,{recursive:true});
    photos.forEach(p=>fs.copyFileSync(path.join(pd,p),path.join(dest,p)));
    item.slug=slug; item.photos=photos.map(p=>`photos/${type}/${slug}/${encodeURIComponent(p)}`);
    data[type].push(item);
  }
  data[type].sort((a,b)=>(a.order??99)-(b.order??99));
}
fs.writeFileSync(path.join(OUT,'data.js'),'window.SITE_DATA='+JSON.stringify(data)+';');
console.log('Built dist/:',['rooms','tours','transfers'].map(t=>t+'='+data[t].length).join(', '));
