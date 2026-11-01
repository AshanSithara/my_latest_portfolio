import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { siGrafana,siInfluxdb,siPrometheus,siApachekafka,siNodedotjs,siNextdotjs,siLinux,siDocker,siPhp,siFlutter,siCisco,siVuedotjs } from 'simple-icons';

const root=process.cwd();
const canvasW=1280,canvasH=720,fps=20,seconds=12;
const clean=path.join(root,'public/command-center-clean-orbits.png');
const base=await sharp(clean).resize(canvasW,canvasH).png().toBuffer();
const brands=[
  ['Grafana',siGrafana,'#F46800'],['InfluxDB',siInfluxdb,'#9D67F6'],['Prometheus',siPrometheus,'#E6522C'],['Kafka',siApachekafka,'#F8FAFC'],
  ['Node.js',siNodedotjs,'#5FA04E'],['Next.js',siNextdotjs,'#FFFFFF'],['Linux',siLinux,'#F8CE43'],
  ['Azure',null,'#38A8F5','azure/azure-original.svg'],['AWS',null,'#FF9900','amazonwebservices/amazonwebservices-original-wordmark.svg'],
  ['Docker',siDocker,'#2496ED'],['PHP',siPhp,'#9899DF'],['Java',null,'#ED8B35','java/java-original.svg'],
  ['Flutter',siFlutter,'#54C5F8'],['Cisco',siCisco,'#17A6D5'],['Vue.js',siVuedotjs,'#41B883']
];
function xmlSafe(v){return v.replaceAll('&','&amp;').replaceAll('<','&lt;')}
async function card([name,icon,color,external],wide){
  const W=wide?88:81,H=wide?89:80;
  let logo='';
  if(external){
    const asset=fs.readFileSync(path.join(root,'node_modules/devicon/icons',external));
    logo=`<image x="${(W-40)/2}" y="12" width="40" height="40" href="data:image/svg+xml;base64,${asset.toString('base64')}"/>`;
  }else{
    logo=`<svg x="${(W-37)/2}" y="12" width="37" height="37" viewBox="0 0 24 24"><path fill="${color}" d="${icon.path}"/></svg>`;
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#213a68"/><stop offset="1" stop-color="#091a36"/></linearGradient></defs>
  <rect x="3" y="3" width="${W-6}" height="${H-6}" rx="11" fill="#071127" opacity=".7"/>
  <rect x="1.8" y="1.8" width="${W-3.6}" height="${H-3.6}" rx="10" fill="url(#g)" stroke="#65bfff" stroke-width="1.8"/>
  <path d="M9 3 H${W-9}" stroke="#c7edff" stroke-width="1" opacity=".7"/>
  ${logo}
  <text x="${W/2}" y="${H-16}" fill="#f7fbff" font-family="Arial, Helvetica, sans-serif" font-size="${name==='Prometheus'?10:12}" font-weight="bold" text-anchor="middle">${xmlSafe(name)}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
const cards=await Promise.all(brands.map((b,i)=>card(b,i<7)));
function layout(i,t){
  const top=i<7,n=top?7:8,j=top?i:i-7;
  const angle=(Math.PI*2*j/n)-Math.PI/2+(top?1:-1)*Math.PI*2*t/seconds;
  const foreground=(Math.sin(angle)+1)/2;
  const depth=.65+.35*foreground;
  const nx=(top?864:863)+(top?276:314)*Math.cos(angle);
  const ny=(top?478:586)+(top?57:57)*Math.sin(angle);
  const width=(top?88:81)*depth;
  return {
    x:Math.round(nx-width/2),y:Math.round(ny-(top?89:80)*depth/2),
    w:Math.round(width),h:Math.round((top?89:80)*depth),depth
  };
}
for(let frame=0;frame<fps*seconds;frame++){
  const t=frame/fps;
  const overlays=[];
  const positions=cards.map((_,i)=>({i,l:layout(i,t)})).sort((a,b)=>a.l.depth-b.l.depth);
  for(const {i,l} of positions){
    const sprite=await sharp(cards[i]).resize(l.w,l.h).png().toBuffer();
    overlays.push({input:sprite,left:l.x,top:l.y});
  }
  const raw=await sharp(base).composite(overlays).removeAlpha().raw().toBuffer();
  if(!process.stdout.write(raw))await new Promise(resolve=>process.stdout.once('drain',resolve));
}
