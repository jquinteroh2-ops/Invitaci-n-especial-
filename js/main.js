/* ═══════════════════════════════════════════════════════════
   INVITACIÓN · Miguel & Daniela
   ⚙️  TODO LO QUE HAY QUE CAMBIAR ESTÁ EN ESTE BLOQUE
   ═══════════════════════════════════════════════════════════ */
const CONFIG = {
  // Fecha y hora exactas de la boda (formato: AÑO-MES-DÍA T HORA:MIN:SEG)
  fechaBoda : '2027-07-31T16:00:00',

  // Cuánto dura la celebración, en horas (se usa para el botón de calendario)
  duracion  : 6,

  // Desde cuándo empieza a llenarse el círculo de la cuenta regresiva
  fechaInicio: '2026-08-12T00:00:00',

  // Número de WhatsApp que recibe las confirmaciones (con indicativo, sin + ni espacios)
  whatsapp  : '573104099711',

  // Nombres para el mensaje de confirmación
  novios    : 'Miguel y Daniela',

  // Datos del evento para "Agregar al calendario"
  // ⚠️ EDITAR con el lugar real
  evento    : {
    titulo : 'Boda de Miguel Andrés & Daniela Patricia',
    lugar  : 'Nombre de la iglesia · Ciudad',
    nota   : '¡Te esperamos! Confirma tu asistencia en la invitación.',
  },

  // URL del Web App de Google Apps Script donde se guardan las confirmaciones.
  // (Si algún día la vuelves a implementar, cambia esta línea por la URL nueva.)
  sheetsUrl : 'https://script.google.com/macros/s/AKfycbxVrgXbeGMrDrLDRqcUWrHiZzVWIL7fGbJP2Eoh63rHa6vt1wIZkcPgrB589VLmOhaJ/exec',
};
/* ═══════════════ fin de la configuración ═══════════════ */


/* ── PARTÍCULAS DE FONDO (pétalos y destellos dorados) ── */
const cvs=document.getElementById('bgCanvas'),cx=cvs.getContext('2d');
let W,H,pts=[];
function rsz(){W=cvs.width=innerWidth;H=cvs.height=innerHeight}
rsz();addEventListener('resize',rsz);

class Pt{
  constructor(){this.reset(true)}
  reset(init){
    this.x=Math.random()*W;this.y=init?Math.random()*H:-12;
    this.r=Math.random()*5+1.5;this.vy=Math.random()*.9+.28;
    this.vx=(Math.random()-.5)*.45;this.a=Math.random()*.42+.12;
    this.rot=Math.random()*360;this.rv=(Math.random()-.5)*2;
    this.sw=Math.random()*1.5;this.sp=Math.random()*Math.PI*2;
    this.kind=Math.random()<.58?'p':'s';
    this.hue=Math.random()<.6?'#C6A664':'#E0CB96';
  }
  tick(t){
    this.y+=this.vy;
    this.x+=Math.sin(t*.0007+this.sp)*this.sw*.04+this.vx;
    this.rot+=this.rv;
    if(this.y>H+16)this.reset(false);
  }
  draw(){
    cx.save();cx.translate(this.x,this.y);cx.rotate(this.rot*Math.PI/180);
    cx.globalAlpha=this.a;cx.fillStyle=this.hue;
    if(this.kind==='p'){cx.beginPath();cx.ellipse(0,0,this.r*1.8,this.r*.62,0,0,Math.PI*2);cx.fill();}
    else{cx.font=`${this.r*2.4}px serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('✦',0,0);}
    cx.restore();
  }
}
for(let i=0;i<58;i++)pts.push(new Pt());
let tk=0;
(function loop(){cx.clearRect(0,0,W,H);tk++;pts.forEach(p=>{p.tick(tk);p.draw()});requestAnimationFrame(loop)})();


/* ── CUENTA REGRESIVA ── */
const WEDDING=new Date(CONFIG.fechaBoda);
const START  =new Date(CONFIG.fechaInicio);
const CIRC   =2*Math.PI*94; // 590.7

function pad(n){return String(n).padStart(2,'0')}

function tickCD(){
  const now=new Date(),diff=WEDDING-now;
  const arc=document.getElementById('arcArc');
  if(arc){
    const frac=Math.max(0,Math.min(1,(WEDDING-now)/(WEDDING-START)));
    arc.style.strokeDashoffset=CIRC*(1-frac);
  }
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  if(diff<=0){['cdD','cdH','cdM','cdS'].forEach(id=>set(id,'00'));return}
  set('cdD',Math.floor(diff/864e5));
  set('cdH',pad(Math.floor((diff%864e5)/36e5)));
  set('cdM',pad(Math.floor((diff%36e5)/6e4)));
  set('cdS',pad(Math.floor((diff%6e4)/1e3)));
}
tickCD();setInterval(tickCD,1000);


/* ── EL SOBRE ── */
let envOpen=false;

function openEnv(){
  if(envOpen)return;envOpen=true;
  startMusic();

  const env  = document.getElementById('envelope');
  const seal = document.getElementById('seal');
  const halo = document.getElementById('sealHalo');
  const hint = document.getElementById('envHint');

  hint.style.opacity='0';
  env.style.animation='none';
  if(halo)halo.style.opacity='0';

  // el lacre se levanta y desaparece
  seal.style.transform='translate(-50%,-50%) rotate(-6deg) scale(1.22)';
  setTimeout(()=>{
    seal.style.transform='translate(-50%,-58%) rotate(-14deg) scale(0)';
    seal.style.opacity='0';
  },320);

  // se abre la solapa y, ya pasada la vertical, se manda detrás de la tarjeta
  setTimeout(()=>env.classList.add('opening'),620);
  setTimeout(()=>document.getElementById('envFlap').classList.add('back'),1050);

  // transición a la carta
  setTimeout(()=>{
    const se=document.getElementById('scene-env');
    const sc=document.getElementById('scene-carta');
    se.classList.add('hide');
    sc.style.display='flex';
    setTimeout(()=>{
      sc.classList.add('show');
      se.style.display='none';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const bar=document.getElementById('cartaBar');
        if(bar)bar.classList.add('run');
      }));
    },100);
    setTimeout(openInvitation,50000);
  },2900);
}

// destellos dorados al pasar el mouse sobre el sobre
document.getElementById('envelope').addEventListener('mousemove',e=>{
  if(envOpen||Math.random()>.06)return;
  const s=document.createElement('div');
  s.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:12px;pointer-events:none;z-index:100;color:#C6A664;animation:sparkOut .8s ease-out forwards;transform-origin:center`;
  s.textContent='✦';document.body.appendChild(s);setTimeout(()=>s.remove(),800);
});


/* ── MÚSICA ── */
const music=document.getElementById('bgMusic');
const musicBtn=document.getElementById('musicBtn');
music.volume=0.5;

function startMusic(){
  music.play().then(()=>musicBtn.classList.add('active')).catch(()=>{});
}
function toggleMusic(){
  music.muted=!music.muted;
  musicBtn.classList.toggle('muted',music.muted);
}


/* ── PASO A LA INVITACIÓN ── */
function openInvitation(){
  const sc=document.getElementById('scene-carta');
  if(sc.dataset.done)return;
  sc.dataset.done='1';
  sc.classList.remove('show');
  setTimeout(()=>{
    sc.style.display='none';
    const si=document.getElementById('scene-inv');
    si.style.display='block';
    setTimeout(()=>{
      si.classList.add('show');
      initReveal();
      initSobres();
      initCarrusel();
      initNavbar();
    },100);
  },800);
}


/* ── SOBRES CAYENDO ── */
function initSobres(){
  const sec=document.getElementById('sobresRain');
  if(!sec||sec.childElementCount)return;
  const svgTpl=a=>`<svg viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="rgba(198,166,100,${(a*.16).toFixed(2)})" stroke="rgba(154,123,60,${a.toFixed(2)})" stroke-width="1.5"/>
    <polyline points="1,1 20,15 39,1" fill="none" stroke="rgba(154,123,60,${a.toFixed(2)})" stroke-width="1.5"/>
    <line x1="1" y1="27" x2="14" y2="15" stroke="rgba(154,123,60,${(a*.6).toFixed(2)})" stroke-width="1"/>
    <line x1="39" y1="27" x2="26" y2="15" stroke="rgba(154,123,60,${(a*.6).toFixed(2)})" stroke-width="1"/>
  </svg>`;
  for(let i=0;i<22;i++){
    const el=document.createElement('div');
    el.className='sobre-mini';
    const a=.3+Math.random()*.5;
    el.innerHTML=svgTpl(a);
    el.style.cssText=`left:${Math.random()*100}%;width:${(16+Math.random()*22).toFixed(0)}px;`+
      `--r:${((Math.random()-.5)*50).toFixed(0)}deg;--sp:${((Math.random()-.5)*70).toFixed(0)}deg;--a:${a.toFixed(2)};`+
      `animation-duration:${(5+Math.random()*6).toFixed(1)}s;animation-delay:${(-Math.random()*11).toFixed(1)}s`;
    sec.appendChild(el);
  }
}


/* ── APARICIÓN AL HACER SCROLL ── */
function initReveal(){
  const all=document.querySelectorAll('#scene-inv .reveal');
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*70);io.unobserve(e.target)}
    });
  },{threshold:.07});
  all.forEach(el=>io.observe(el));
  setTimeout(()=>all.forEach((el,i)=>{if(i<3)setTimeout(()=>el.classList.add('on'),i*100)}),150);
}


/* ── LAS FOTOS ──
   'pos' es el encuadre vertical (0% = arriba, 100% = abajo).
   Súbelo o bájalo si alguna cara queda cortada.                */
const PHOTOS=[
  {src:'fotos/foto-01.jpeg',cap:'El escenario del sí',            pos:'58%'},
  {src:'fotos/foto-02.jpeg',cap:'¿Quieres ser mi esposa? ♥',      pos:'46%'},
  {src:'fotos/foto-03.jpeg',cap:'Las lágrimas más felices',       pos:'58%'},
  {src:'fotos/foto-04.jpeg',cap:'Sus manos, su promesa',          pos:'52%'},
  {src:'fotos/foto-05.jpeg',cap:'No lo podía creer',              pos:'52%'},
  {src:'fotos/foto-06.jpeg',cap:'Miradas que lo dicen todo',      pos:'50%'},
  {src:'fotos/foto-07.jpeg',cap:'El primer beso de novios',       pos:'48%'},
  {src:'fotos/foto-08.jpeg',cap:'Un beso en la frente',           pos:'42%'},
  {src:'fotos/foto-09.jpeg',cap:'Frente al mar de siempre',       pos:'48%'},
  {src:'fotos/foto-10.jpeg',cap:'Mirando juntos hacia adelante',  pos:'46%'},
];


/* ── CARRUSEL DE FOTOS ── */
let carI=0;
function initCarrusel(){
  const track=document.getElementById('carTrack');
  const dots =document.getElementById('carDots');
  if(!track||track.childElementCount)return;

  PHOTOS.forEach((p,i)=>{
    const s=document.createElement('div');
    s.className='car-slide';
    s.style.setProperty('--pos',p.pos||'50%');
    s.innerHTML=`<span class="car-num">${String(i+1).padStart(2,'0')}</span>`+
                `<img src="${p.src}" alt="${p.cap}" loading="lazy">`;
    s.addEventListener('click',()=>openLb(i));
    track.appendChild(s);

    const d=document.createElement('button');
    d.className='car-dot'+(i===0?' on':'');
    d.type='button';
    d.setAttribute('aria-label','Foto '+(i+1));
    d.addEventListener('click',()=>carIr(i));
    dots.appendChild(d);
  });

  carPintar(0);

  // detecta cuál diapositiva quedó centrada al deslizar
  let t=null;
  track.addEventListener('scroll',()=>{
    clearTimeout(t);
    t=setTimeout(()=>{
      const centro=track.scrollLeft+track.clientWidth/2;
      let mejor=0,dif=Infinity;
      [...track.children].forEach((s,i)=>{
        const c=s.offsetLeft+s.offsetWidth/2;
        if(Math.abs(c-centro)<dif){dif=Math.abs(c-centro);mejor=i}
      });
      carPintar(mejor);
    },90);
  },{passive:true});
}

function carPintar(i){
  carI=i;
  const track=document.getElementById('carTrack');
  const cap=document.getElementById('carCap');
  if(!track)return;
  [...track.children].forEach((s,n)=>s.classList.toggle('is-active',n===i));
  document.querySelectorAll('.car-dot').forEach((d,n)=>d.classList.toggle('on',n===i));
  if(cap&&cap.textContent!==PHOTOS[i].cap){
    cap.style.opacity='0';
    setTimeout(()=>{cap.textContent=PHOTOS[i].cap;cap.style.opacity='1'},130);
  }
}

function carIr(i){
  const track=document.getElementById('carTrack');
  const slide=track&&track.children[i];
  if(!slide)return;
  track.scrollTo({left:slide.offsetLeft-(track.clientWidth-slide.offsetWidth)/2,behavior:'smooth'});
  carPintar(i);
}
function carNav(d){carIr(Math.max(0,Math.min(PHOTOS.length-1,carI+d)))}

// se arma de una vez (las fotos cargan en diferido), así nunca queda vacío
initCarrusel();


/* ── VISOR DE FOTOS ── */
const lbEl=document.getElementById('lb');
const lbImg=document.getElementById('lb-img');
const lbCap=document.getElementById('lb-cap');
const ldots=document.getElementById('lb-dots');
let lbI=0;

PHOTOS.forEach((_,i)=>{
  const d=document.createElement('button');
  d.className='lb-dot'+(i===0?' on':'');
  d.onclick=ev=>{ev.stopPropagation();lbGo(i)};
  ldots.appendChild(d);
});

function openLb(idx){
  lbI=idx;lbImg.src=PHOTOS[idx].src;lbCap.textContent=PHOTOS[idx].cap;
  lbEl.style.display='flex';
  requestAnimationFrame(()=>requestAnimationFrame(()=>lbEl.classList.add('vis')));
  lbEl.classList.add('open');syncDots();document.body.style.overflow='hidden';
}
function closeLb(){
  lbEl.classList.remove('vis');
  setTimeout(()=>{lbEl.classList.remove('open');lbEl.style.display='none'},320);
  document.body.style.overflow='';
}
function lbBg(e){if(e.target===lbEl)closeLb()}
function lbNav(d){lbGo((lbI+d+PHOTOS.length)%PHOTOS.length)}
function lbGo(idx){
  lbImg.style.opacity='0';lbImg.style.transform='scale(.95)';
  setTimeout(()=>{
    lbI=idx;lbImg.src=PHOTOS[idx].src;lbCap.textContent=PHOTOS[idx].cap;
    lbImg.style.opacity='1';lbImg.style.transform='none';syncDots();
  },220);
}
function syncDots(){document.querySelectorAll('.lb-dot').forEach((d,i)=>d.classList.toggle('on',i===lbI))}

document.addEventListener('keydown',e=>{
  if(!lbEl.classList.contains('open'))return;
  if(e.key==='ArrowLeft')lbNav(-1);
  if(e.key==='ArrowRight')lbNav(1);
  if(e.key==='Escape')closeLb();
});
let tx=0;
lbEl.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
lbEl.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)lbNav(dx<0?1:-1)});


/* ── CONFIRMACIÓN DE ASISTENCIA ──
   Hace DOS cosas de una sola vez:
     1) guarda la fila en la hoja de cálculo (si CONFIG.sheetsUrl está puesta)
     2) abre WhatsApp con el mensaje ya escrito                              */

// guarda en la hoja. 'keepalive' hace que el envío llegue aunque el celular
// se vaya a WhatsApp de inmediato.
function guardarEnLista(datos){
  if(!CONFIG.sheetsUrl)return;
  const q=new URLSearchParams(datos);
  try{
    fetch(CONFIG.sheetsUrl+'?'+q.toString(),{mode:'no-cors',keepalive:true}).catch(()=>{});
  }catch(_){}
}


/* ── ACOMPAÑANTES ── */
const MAX_ACOMP=8;
let nAcomp=0;

function acompCambiar(d){
  const nuevo=Math.max(0,Math.min(MAX_ACOMP,nAcomp+d));
  if(nuevo===nAcomp)return;
  const lista=document.getElementById('acompLista');

  if(nuevo>nAcomp){
    for(let i=nAcomp;i<nuevo;i++){
      const inp=document.createElement('input');
      inp.type='text';
      inp.className='acomp-input';
      inp.maxLength=60;
      inp.autocomplete='off';
      inp.placeholder='Nombre del acompañante '+(i+1);
      lista.appendChild(inp);
    }
    lista.lastElementChild?.focus();
  }else{
    for(let i=nAcomp;i>nuevo;i--)lista.lastElementChild?.remove();
  }

  nAcomp=nuevo;
  document.getElementById('acompN').textContent=nAcomp;
  actualizarStepper();
}

function actualizarStepper(){
  const btns=document.querySelectorAll('.step-btn');
  if(btns[0])btns[0].disabled=(nAcomp===0);
  if(btns[1])btns[1].disabled=(nAcomp===MAX_ACOMP);
}
actualizarStepper();

// devuelve solo los nombres que sí escribieron
function nombresAcomp(){
  return [...document.querySelectorAll('.acomp-input')]
    .map(i=>i.value.trim())
    .filter(Boolean);
}

let rsvpListo=false;

function confirmarAsistencia(){
  if(rsvpListo)return;

  const input =document.getElementById('rsvpName');
  const msgEl =document.getElementById('rsvpMsg');
  const btn   =document.getElementById('rsvpBtn');
  const btnTxt=document.getElementById('rsvpBtnTxt');
  const note  =document.getElementById('rsvpNote');

  const nombre =input.value.trim();
  const mensaje=(msgEl?msgEl.value.trim():'');

  if(!nombre){
    input.classList.add('err');
    input.focus();
    setTimeout(()=>input.classList.remove('err'),1400);
    if(note)note.textContent='Escribe tu nombre para continuar';
    setTimeout(()=>{if(note)note.textContent='Quedas en la lista y se abre WhatsApp'},2600);
    return;
  }

  const acomp=nombresAcomp();
  const total=1+acomp.length;

  // 1 · a la hoja de cálculo
  guardarEnLista({
    nombre       : nombre,
    acompanantes : acomp.join(', '),
    total        : total,
    mensaje      : mensaje
  });

  // 2 · a WhatsApp (se abre aquí mismo, dentro del toque, para que el
  //     celular no lo bloquee como ventana emergente)
  let texto=`¡Felicidades ${CONFIG.novios}! 🤍\n\n`+
            `Cuenten conmigo, ahí voy a estar para celebrar con ustedes. 🎉\n\n`+
            `Soy: ${nombre}`;
  if(acomp.length){
    texto+=`\n\nVoy con ${acomp.length===1?'1 acompañante':acomp.length+' acompañantes'}:\n`+
           acomp.map(n=>'• '+n).join('\n')+
           `\n\nSomos ${total} en total.`;
  }
  if(mensaje)texto+=`\n\nQuiero decirles:\n${mensaje}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`,'_blank');

  // 3 · aviso en pantalla
  rsvpListo=true;
  if(btnTxt)btnTxt.textContent='¡Confirmado!';
  if(btn){btn.classList.add('ok');btn.disabled=true}
  if(note){
    note.textContent=total>1
      ? `Gracias ${nombre.split(' ')[0]}, los esperamos a los ${total} ♥`
      : `Gracias ${nombre.split(' ')[0]}, te esperamos ♥`;
    note.classList.add('ok');
  }
}

// permite confirmar dándole "enter" en el teclado del celular
document.getElementById('rsvpName')?.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();document.getElementById('rsvpMsg')?.focus()}
});


/* ── BARRA DE NAVEGACIÓN ── */
const SECCIONES=['sec-inicio','sec-lugar','sec-fotos','sec-rsvp'];

function irA(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
}

function initNavbar(){
  const nav=document.getElementById('navbar');
  if(!nav)return;
  setTimeout(()=>nav.classList.add('on'),900);

  const items=[...nav.querySelectorAll('.nav-item')];
  // marca la sección que se está viendo
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      items.forEach(b=>b.classList.toggle('on',b.dataset.sec===e.target.id));
    });
  },{rootMargin:'-45% 0px -45% 0px'});
  SECCIONES.forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el)});
}


/* ── AGREGAR AL CALENDARIO ── */
function fechasEvento(){
  const ini=new Date(CONFIG.fechaBoda);
  const fin=new Date(ini.getTime()+CONFIG.duracion*36e5);
  const utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  return {ini:utc(ini),fin:utc(fin)};
}

function initCalendario(){
  const a=document.getElementById('calGoogle');
  if(!a)return;
  const f=fechasEvento(),e=CONFIG.evento;
  a.href='https://calendar.google.com/calendar/render?action=TEMPLATE'+
    '&text='+encodeURIComponent(e.titulo)+
    '&dates='+f.ini+'/'+f.fin+
    '&details='+encodeURIComponent(e.nota)+
    '&location='+encodeURIComponent(e.lugar);
}
initCalendario();

function descargarICS(){
  const f=fechasEvento(),e=CONFIG.evento;
  const ics=[
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invitacion//ES','CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:'+Date.now()+'@invitacion',
    'DTSTAMP:'+f.ini,
    'DTSTART:'+f.ini,
    'DTEND:'+f.fin,
    'SUMMARY:'+e.titulo,
    'DESCRIPTION:'+e.nota,
    'LOCATION:'+e.lugar,
    'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:'+e.titulo,'END:VALARM',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');

  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  const a=document.createElement('a');
  a.href=url;a.download='boda-miguel-y-daniela.ics';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
