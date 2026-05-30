import { useState, useRef, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DESIGN TOKENS — Neo-Fluid Dark
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const C = {
  bg:       '#07060A',
  glass:    'rgba(255,255,255,0.04)',
  glassHi:  'rgba(255,255,255,0.07)',
  border:   'rgba(255,255,255,0.09)',
  borderHi: 'rgba(255,90,45,0.45)',
  orange:   '#FF5A2D',
  amber:    '#FF9500',
  grad:     'linear-gradient(135deg,#FF5A2D,#FF9500)',
  gradSoft: 'linear-gradient(135deg,rgba(255,90,45,0.18),rgba(255,149,0,0.10))',
  glow:     'rgba(255,90,45,0.3)',
  text:     '#F5EEE8',
  sub:      '#9A8070',
  dim:      '#4A3828',
  success:  '#34D399',
  warn:     '#FBBF24',
  danger:   '#F87171',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GLOBAL STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GlobalStyles = () => {
  useEffect(() => {
    if (document.getElementById('cvx-gl')) return;
    const lk = document.createElement('link');
    lk.rel  = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Manrope:wght@300;400;500;600;700&family=Unbounded:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap';
    document.head.appendChild(lk);
    const st = document.createElement('style');
    st.id = 'cvx-gl';
    st.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{background:#07060A;font-family:'Manrope',sans-serif;color:#F5EEE8;overflow-x:hidden}
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:rgba(255,90,45,0.35);border-radius:99px}
      ::selection{background:rgba(255,90,45,0.3)}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes scaleUp{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
      @keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
      @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,−30px) scale(1.1)}}
      @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,40px) scale(0.9)}}
      @keyframes gradBorder{0%,100%{opacity:0.5}50%{opacity:1}}
      .fu{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) both}
      .fi{animation:fadeIn .4s ease both}
      .sc{animation:scaleUp .4s cubic-bezier(.34,1.3,.64,1) both}
    `;
    document.head.appendChild(st);
  }, []);
  return null;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOGO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Logo = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7043"/>
        <stop offset="1" stopColor="#FF4500"/>
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="11" fill="url(#lg)"/>
    <path d="M11 11L25 25" stroke="white" strokeWidth="3.8" strokeLinecap="round"/>
    <path d="M25 11L11 25" stroke="white" strokeWidth="3.8" strokeLinecap="round"/>
  </svg>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DIMS = [
  { key:'ilk_3_saniye_kancasi', label:'İlk 3 Saniye Kancası', icon:'🎣', w:20 },
  { key:'gorsel_kalite',        label:'Görsel Kalite',         icon:'📷', w:10 },
  { key:'duygusal_etki',        label:'Duygusal Etki',         icon:'💫', w:15 },
  { key:'icerik_degeri',        label:'İçerik Değeri',         icon:'💎', w:15 },
  { key:'ses_muzik',            label:'Ses & Müzik',           icon:'🎵', w:10 },
  { key:'format_uyumu',         label:'Format Uyumu',          icon:'📱', w:8  },
  { key:'harekete_gecirme',     label:'Harekete Geçirme',      icon:'🚀', w:7  },
  { key:'trend_uyumu',          label:'Trend Uyumu',           icon:'🔥', w:8  },
  { key:'ozgunluk',             label:'Özgünlük',              icon:'✨', w:5  },
  { key:'yeniden_izleme',       label:'Yeniden İzleme',        icon:'🔄', w:2  },
];
const STEPS = [
  'Video taranıyor…','Görsel kalite analiz ediliyor…','Ses ve müzik değerlendiriliyor…',
  'İçerik ve anlatı inceleniyor…','Trend uyumu kontrol ediliyor…',
  'Viral skor hesaplanıyor…','Rapor hazırlanıyor…',
];
const NICHES = [
  'Moda & Güzellik','Yemek & Tarifler','Fitness & Sağlık','Mizah & Eğlence',
  'Teknoloji & Oyun','Seyahat','Motivasyon & Kişisel Gelişim',
  'İş & Girişimcilik','Eğitim & Bilgi','Müzik & Dans',
];

const ANALYSIS_PROMPT = `Sen ChefXVid platformunun viral içerik analiz motorusun. Sana Reels/TikTok karelerini gönderiyorum. 10 boyutu analiz et, Türkçe yaz, dürüst ol.
Boyutlar: ilk_3_saniye_kancasi(%20), gorsel_kalite(%10), duygusal_etki(%15), icerik_degeri(%15), ses_muzik(%10), format_uyumu(%8), harekete_gecirme(%7), trend_uyumu(%8), ozgunluk(%5), yeniden_izleme(%2)
SADECE JSON döndür:
{"ilk_3_saniye_kancasi":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"KRİTİK"},"gorsel_kalite":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"ÖNEMLİ"},"duygusal_etki":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"ÖNEMLİ"},"icerik_degeri":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"ÖNEMLİ"},"ses_muzik":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"OPSİYONEL"},"format_uyumu":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"OPSİYONEL"},"harekete_gecirme":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"ÖNEMLİ"},"trend_uyumu":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"KRİTİK"},"ozgunluk":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"OPSİYONEL"},"yeniden_izleme":{"skor":0.0,"gozlem":"...","sorun":"...","oneri":"...","oncelik":"OPSİYONEL"},"genel_skor":0.0,"genel_yorum":"...","guclu_yonler":["...","...","..."],"kritik_sorunlar":["...","...","..."],"aksiyon_plani":[{"yapilacak":"...","tahmini_etki":"+1.5 puan"},{"yapilacak":"...","tahmini_etki":"+1.2 puan"},{"yapilacak":"...","tahmini_etki":"+0.9 puan"},{"yapilacak":"...","tahmini_etki":"+0.6 puan"},{"yapilacak":"...","tahmini_etki":"+0.4 puan"}]}
JSON dışında hiçbir şey yazma.`;

const TREND_PROMPT = (date, niche) => `ChefXVid trend analiz motoru. Tarih: ${date}. ${niche?`Niş: ${niche}.`:''} Web ara, bu hafta viral olanları bul.
SADECE JSON (Türkçe):
{"son_guncelleme":"${new Date().toISOString()}","patlayan_formatlar":[{"format_adi":"...","aciklama":"...","neden_calisuyor":"...","ates_seviyesi":3,"nasil_kullanilir":"..."},{"format_adi":"...","aciklama":"...","neden_calisuyor":"...","ates_seviyesi":2,"nasil_kullanilir":"..."},{"format_adi":"...","aciklama":"...","neden_calisuyor":"...","ates_seviyesi":2,"nasil_kullanilir":"..."}],"trend_sesler":[{"ses_adi":"...","neden_trend":"...","en_iyi_icin":"...","yasam_suresi":"yeni"},{"ses_adi":"...","neden_trend":"...","en_iyi_icin":"...","yasam_suresi":"zirve"},{"ses_adi":"...","neden_trend":"...","en_iyi_icin":"...","yasam_suresi":"dusus"}],"algoritma_haberleri":[{"baslik":"...","ozet":"...","icerik_uretici_etkisi":"...","tarih":"..."},{"baslik":"...","ozet":"...","icerik_uretici_etkisi":"...","tarih":"..."}],"nis_analizi":{"nis":"${niche||'Genel'}","trending_tipler":[{"tip":"...","aciklama":"...","ates_seviyesi":3},{"tip":"...","aciklama":"...","ates_seviyesi":2}],"kacinin_konular":["...","...","..."],"yukselen_konular":[{"konu":"...","neden":"...","rekabet":"dusuk"},{"konu":"...","neden":"...","rekabet":"orta"}],"ipuclari":["...","...","..."]},"viral_anatomi":{"ortalama_sure_saniye":28,"en_yaygin_kanca_tipleri":["...","...","..."],"dominant_duygular":["...","...","..."],"en_iyi_paylasim_saatleri":["19:00-21:00","12:00-13:00"],"hashtag_stratejisi":"..."},"emergent_skor":{"algoritma_agresivligi":7,"bu_hafta_viral_mi":true,"aciklama":"...","dominant_duygu":"..."}}
JSON dışında hiçbir şey yazma.`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UTILS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const cj = t => {
  if (!t) return '{}';
  t = t.replace(/```json\n?/gi,'').replace(/```\n?/g,'');
  const s=t.indexOf('{'),e=t.lastIndexOf('}');
  return s!==-1&&e!==-1?t.slice(s,e+1):t.trim();
};
const band = sc => {
  if (sc>=9.3) return { label:'İstisnai',       emoji:'⚡', c:'#FFD700', g:'rgba(255,215,0,.4)'  };
  if (sc>=8.0) return { label:'Yüksek Potansiyel',emoji:'🏆', c:C.orange,  g:'rgba(255,90,45,.45)' };
  if (sc>=6.5) return { label:'İyi Potansiyel',  emoji:'✅', c:C.success, g:'rgba(52,211,153,.4)' };
  if (sc>=5.0) return { label:'Orta Potansiyel', emoji:'⚠️', c:C.warn,    g:'rgba(251,191,36,.35)'};
  if (sc>=3.0) return { label:'Sınırda',          emoji:'🔶', c:C.amber,   g:'rgba(255,149,0,.4)'  };
  return             { label:'Düşük',            emoji:'🔴', c:C.danger,  g:'rgba(248,113,113,.4)'};
};
const fmtSz = b => b<1048576?`${(b/1024).toFixed(0)} KB`:`${(b/1048576).toFixed(1)} MB`;

const extractFrames = async (file,n=8) => new Promise((res,rej)=>{
  const v=document.createElement('video'); v.muted=true; v.preload='auto';
  const url=URL.createObjectURL(file); v.src=url;
  const to=setTimeout(()=>rej(new Error('Zaman aşımı')),25000);
  v.addEventListener('loadeddata',async()=>{
    clearTimeout(to);
    try{
      const dur=v.duration||5;
      const c=document.createElement('canvas');
      c.width=Math.min(v.videoWidth||720,540);
      c.height=Math.round(c.width*(v.videoHeight||1280)/(v.videoWidth||720));
      const ctx=c.getContext('2d'); const frames=[];
      for(let i=0;i<n;i++){
        const t=i===0?.1:(dur/(n-1))*i;
        await new Promise(r=>{
          v.currentTime=Math.min(t,dur-.05);
          const h=()=>{v.removeEventListener('seeked',h);ctx.drawImage(v,0,0,c.width,c.height);frames.push(c.toDataURL('image/jpeg',.65).split(',')[1]);r();};
          v.addEventListener('seeked',h);
        });
      }
      URL.revokeObjectURL(url); res(frames);
    }catch(e){rej(e);}
  });
  v.onerror=()=>{clearTimeout(to);rej(new Error('Video işlenemedi'));};
});

const callClaude = async (msgs,tools=null,max=4096)=>{
  const b={model:'claude-sonnet-4-20250514',max_tokens:max,messages:msgs};
  if(tools)b.tools=tools;
  const r=await fetch('/api/claude',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error?.message||'API '+r.status);}
  return r.json();
};

const getThumb = async f=>{
  try{
    const url=URL.createObjectURL(f);const v=document.createElement('video');v.src=url;v.muted=true;
    await new Promise(r=>{v.onloadeddata=r;});v.currentTime=.5;await new Promise(r=>{v.onseeked=r;});
    const c=document.createElement('canvas');c.width=200;c.height=Math.round(200*(v.videoHeight/v.videoWidth));
    c.getContext('2d').drawImage(v,0,0,c.width,c.height);URL.revokeObjectURL(url);return c.toDataURL('image/jpeg',.7);
  }catch{return null;}
};

const saveH=(result,name,thumb)=>{
  try{
    const h=JSON.parse(localStorage.getItem('cvx_h')||'[]');
    const e={id:Date.now().toString(),date:new Date().toISOString(),videoName:name,thumbnail:thumb,score:result.genel_skor,result};
    h.unshift(e);if(h.length>20)h.pop();localStorage.setItem('cvx_h',JSON.stringify(h));return e.id;
  }catch{return null;}
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GLASS CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Glass = ({ children, style={}, hover=true, glow=false, onClick }) => {
  const [hov,setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>hover&&setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: C.glass,
        border:`1px solid ${hov&&hover?C.borderHi:C.border}`,
        borderRadius:16,
        backdropFilter:'blur(16px)',
        transition:'all .22s ease',
        transform: hov&&hover?'translateY(-2px)':'translateY(0)',
        boxShadow: glow ? `0 0 40px ${C.glow}, 0 8px 32px rgba(0,0,0,.4)` :
                   hov&&hover ? '0 8px 32px rgba(0,0,0,.35)' : '0 2px 8px rgba(0,0,0,.2)',
        ...style,
      }}>
      {children}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PILL BUTTON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Btn = ({ children, onClick, variant='primary', size='md', style={}, disabled=false }) => {
  const [hov,setHov]=useState(false);
  const sizes={sm:{padding:'7px 18px',fontSize:12},md:{padding:'11px 24px',fontSize:13},lg:{padding:'14px 32px',fontSize:15}};
  const variants={
    primary:{ background:hov?'linear-gradient(135deg,#FF7043,#FFB300)':C.grad, color:'#fff', border:'none', boxShadow:hov?`0 8px 28px ${C.glow}`:`0 4px 16px ${C.glow}` },
    ghost:  { background:hov?C.glassHi:C.glass, color:hov?C.text:C.sub, border:`1px solid ${hov?C.borderHi:C.border}` },
    outline:{ background:'transparent', color:hov?C.orange:C.sub, border:`1px solid ${hov?C.orange:C.border}` },
  };
  const v=variants[variant]||variants.primary;
  const s=sizes[size]||sizes.md;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        ...v,...s,
        borderRadius:99,cursor:disabled?'default':'pointer',
        fontFamily:'Bricolage Grotesque',fontWeight:600,letterSpacing:'-.01em',
        transition:'all .18s ease',outline:'none',
        opacity:disabled?.5:1,
        ...style,
      }}>
      {children}
    </button>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SCORE DISPLAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ScoreDisplay = ({ score, compact=false }) => {
  const [d,setD]=useState(0);
  const b=band(d);
  useEffect(()=>{
    let raf; const t0=Date.now(); const dur=1700;
    const tick=()=>{
      const p=Math.min((Date.now()-t0)/dur,1);
      setD(score*(1-Math.pow(1-p,4)));
      if(p<1)raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
  },[score]);
  const segs=10; const filled=Math.round(d);
  return (
    <div style={{textAlign:'center'}}>
      {/* Number */}
      <div style={{
        fontFamily:'Unbounded',fontWeight:700,
        fontSize:compact?52:96,lineHeight:.9,letterSpacing:'-.04em',
        background:`linear-gradient(135deg,${b.c},${b.c}99)`,
        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
        filter:`drop-shadow(0 0 24px ${b.g})`,
        marginBottom:compact?8:12,
      }}>{d.toFixed(1)}</div>
      <div style={{fontFamily:'DM Mono',fontSize:10,color:C.dim,letterSpacing:'.12em',marginBottom:compact?10:14}}>/ 10 PUAN</div>
      {/* Segments */}
      <div style={{display:'flex',gap:compact?3:5,justifyContent:'center',marginBottom:compact?10:14}}>
        {Array.from({length:segs}).map((_,i)=>(
          <div key={i} style={{
            width:compact?14:22, height:compact?4:6, borderRadius:99,
            background:i<filled?b.c:'rgba(255,255,255,0.07)',
            boxShadow:i<filled?`0 0 10px ${b.g}`:'none',
            transition:`all .08s ease ${i*.05}s`,
          }}/>
        ))}
      </div>
      {/* Band pill */}
      <div style={{
        display:'inline-flex',alignItems:'center',gap:6,padding:'5px 14px',
        borderRadius:99,background:C.glass,
        border:`1px solid ${b.c}30`,backdropFilter:'blur(10px)',
        fontFamily:'Bricolage Grotesque',fontSize:12,fontWeight:700,
        color:b.c,letterSpacing:'-.01em',
      }}>{b.emoji} {b.label}</div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DIMENSION CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DimCard = ({ dim, data, idx }) => {
  const [open,setOpen]=useState(false);
  const [bw,setBw]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setBw((data?.skor||0)/10*100),idx*75+350);return()=>clearTimeout(t);},[data?.skor,idx]);
  const sc=data?.skor||0;
  const col=sc>=7?C.success:sc>=5?C.warn:C.danger;
  const pm={'KRİTİK':{c:C.danger,bg:'rgba(248,113,113,.1)'},'ÖNEMLİ':{c:C.warn,bg:'rgba(251,191,36,.1)'},'OPSİYONEL':{c:C.dim,bg:'rgba(74,56,40,.3)'}};
  const pc=pm[data?.oncelik]||pm['OPSİYONEL'];
  return (
    <Glass onClick={()=>setOpen(!open)} style={{marginBottom:6,padding:'14px 16px',cursor:'pointer',borderRadius:12,
      border:`1px solid ${open?col+'40':C.border}`}} hover={false}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:17,flexShrink:0}}>{dim.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:13,color:C.text}}>{dim.label}</span>
              <span style={{fontFamily:'DM Mono',fontSize:9,color:C.dim}}>×{dim.w}%</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:7,flexShrink:0}}>
              {data?.oncelik&&<span style={{fontFamily:'Bricolage Grotesque',fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:99,background:pc.bg,color:pc.c,letterSpacing:'.03em'}}>{data.oncelik}</span>}
              <span style={{fontFamily:'Unbounded',fontSize:16,fontWeight:700,color:col}}>{sc.toFixed(1)}</span>
              <span style={{color:C.dim,fontSize:10,fontFamily:'DM Mono'}}>/10</span>
              <span style={{color:C.dim,fontSize:10,marginLeft:2}}>{open?'↑':'↓'}</span>
            </div>
          </div>
          <div style={{height:3,background:'rgba(255,255,255,0.05)',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${bw}%`,borderRadius:99,
              background:`linear-gradient(90deg,${col}66,${col})`,
              transition:'width 1.1s cubic-bezier(.16,1,.3,1)',
              boxShadow:`0 0 8px ${col}55`}}/>
          </div>
        </div>
      </div>
      {open&&data&&(
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`,animation:'fadeIn .25s ease'}}>
          <div style={{marginBottom:10}}>
            <span style={{fontFamily:'DM Mono',fontSize:9,color:C.amber,letterSpacing:'.1em'}}>GÖZLEM</span>
            <p style={{fontFamily:'Manrope',fontSize:13,color:C.sub,marginTop:4,lineHeight:1.7}}>{data.gozlem}</p>
          </div>
          {data.sorun&&<div style={{marginBottom:10,padding:'10px 12px',background:'rgba(248,113,113,.06)',
            border:'1px solid rgba(248,113,113,.15)',borderRadius:10}}>
            <span style={{fontFamily:'DM Mono',fontSize:9,color:C.danger,letterSpacing:'.1em'}}>SORUN</span>
            <p style={{fontFamily:'Manrope',fontSize:13,color:C.sub,marginTop:4,lineHeight:1.7}}>{data.sorun}</p>
          </div>}
          <div style={{padding:'12px',background:C.gradSoft,
            border:`1px solid rgba(255,90,45,0.2)`,borderRadius:10}}>
            <span style={{fontFamily:'DM Mono',fontSize:9,color:C.orange,letterSpacing:'.1em'}}>💡 ÖNERİ</span>
            <p style={{fontFamily:'Manrope',fontSize:13,color:C.text,marginTop:4,lineHeight:1.7}}>{data.oneri}</p>
          </div>
        </div>
      )}
    </Glass>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPLOAD ZONE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const UploadZone = ({ label, file, thumb, onFile, onError, compact=false }) => {
  const [drag,setDrag]=useState(false); const ref=useRef(null);
  const hf=useCallback(f=>{
    if(!f)return;
    if(!f.name.match(/\.(mp4|mov|avi)$/i)&&!['video/mp4','video/quicktime','video/x-msvideo'].includes(f.type)){onError&&onError('Desteklenmeyen format — MP4, MOV veya AVI yükle.');return;}
    if(f.size>500*1024*1024){onError&&onError('Dosya 500MB limitini aşıyor.');return;}
    onFile(f);
  },[onFile,onError]);
  return (
    <div
      onDragOver={e=>{e.preventDefault();setDrag(true);}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);hf(e.dataTransfer.files[0]);}}
      onClick={()=>!file&&ref.current?.click()}
      style={{
        border:`1.5px dashed ${drag?C.orange:file?C.success:'rgba(255,255,255,0.12)'}`,
        borderRadius:14,padding:compact?'18px':'40px 24px',textAlign:'center',
        cursor:file?'default':'pointer',background:drag?'rgba(255,90,45,.05)':C.glass,
        boxShadow:drag?`0 0 30px ${C.glow}`:'none',transition:'all .25s ease',
        backdropFilter:'blur(10px)',
      }}>
      <input ref={ref} type="file" accept=".mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo"
        style={{display:'none'}} onChange={e=>hf(e.target.files[0])}/>
      {file?(
        <div style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center'}}>
          {thumb&&<img src={thumb} alt="" style={{width:40,height:60,objectFit:'cover',borderRadius:8,border:`2px solid ${C.success}`,flexShrink:0}}/>}
          <div style={{textAlign:'left'}}>
            <div style={{fontFamily:'DM Mono',fontSize:10,color:C.success,marginBottom:3,letterSpacing:'.06em'}}>✓ YÜKLENDI</div>
            <div style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:13,color:C.text,maxWidth:170,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</div>
            <div style={{fontFamily:'DM Mono',fontSize:10,color:C.dim,marginTop:2}}>{fmtSz(file.size)}</div>
            <button onClick={e=>{e.stopPropagation();onFile(null);}} style={{background:'transparent',border:`1px solid ${C.border}`,color:C.dim,borderRadius:99,padding:'2px 10px',cursor:'pointer',fontSize:10,marginTop:6,fontFamily:'Manrope'}}>Değiştir</button>
          </div>
        </div>
      ):(
        <>
          <div style={{fontSize:compact?26:36,marginBottom:8}}>🎬</div>
          <div style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:14,color:C.text,marginBottom:4}}>{label||'Video yükle'}</div>
          <div style={{fontFamily:'DM Mono',fontSize:10,color:C.dim,letterSpacing:'.04em'}}>MP4 · MOV · AVI · max 500MB</div>
        </>
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NAVBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Navbar = ({ page, setPage }) => {
  const nav=[{k:'landing',l:'Ana Sayfa'},{k:'analiz',l:'Analiz'},{k:'ab',l:'A/B'},{k:'trendler',l:'Trendler'},{k:'gecmis',l:'Geçmiş'}];
  return (
    <nav style={{position:'sticky',top:0,zIndex:100,
      background:'rgba(7,6,10,0.8)',backdropFilter:'blur(24px)',
      borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',height:56,
        display:'flex',alignItems:'center',gap:8}}>
        <div onClick={()=>setPage('landing')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:9,marginRight:'auto',flexShrink:0}}>
          <Logo size={30}/>
          <span style={{fontFamily:'Bricolage Grotesque',fontSize:18,fontWeight:800,
            letterSpacing:'-.03em',color:C.text}}>ChefXVid</span>
        </div>
        <div style={{display:'flex',gap:2,alignItems:'center'}}>
          {nav.map(it=>(
            <button key={it.k} onClick={()=>setPage(it.k)} style={{
              background:page===it.k?'rgba(255,90,45,0.12)':'transparent',
              border:'none',borderRadius:99,color:page===it.k?C.orange:C.sub,
              padding:'7px 14px',cursor:'pointer',
              fontFamily:'Bricolage Grotesque',fontSize:13,fontWeight:page===it.k?600:500,
              transition:'all .15s ease',letterSpacing:'-.01em',
            }} onMouseEnter={e=>{if(page!==it.k)e.target.style.color=C.text;}}
               onMouseLeave={e=>{if(page!==it.k)e.target.style.color=C.sub;}}>
              {it.l}
            </button>
          ))}
        </div>
        <Btn onClick={()=>setPage('analiz')} size="sm" style={{marginLeft:8,flexShrink:0}}>Analiz Et →</Btn>
      </div>
    </nav>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AMBIENT ORBS BACKGROUND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Orbs = () => (
  <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
    <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',
      background:'radial-gradient(circle,rgba(255,90,45,.1) 0%,transparent 65%)',
      top:'-10%',left:'-10%',animation:'orb1 12s ease-in-out infinite'}}/>
    <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',
      background:'radial-gradient(circle,rgba(255,149,0,.07) 0%,transparent 65%)',
      bottom:'5%',right:'-8%',animation:'orb2 15s ease-in-out infinite'}}/>
  </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LANDING PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LandingPage = ({ setPage }) => {
  const feats=[
    {n:'01',t:'10 Boyutlu Analiz',d:"Hook'tan müziğe kadar viral algoritmayı etkileyen her sinyali ölçüyoruz."},
    {n:'02',t:'Anlık Aksiyonlar',d:'Tam olarak ne değiştireceğini ve kaç puan kazanacağını söylüyoruz.'},
    {n:'03',t:'Canlı Trend Merkezi',d:'Web aramasıyla güncellenen gerçek zamanlı trend zekası.'},
    {n:'04',t:'A/B Karşılaştırma',d:'İki versiyonu aynı anda analiz et, hangisini yayınlayacağını öğren.'},
  ];
  return (
    <div style={{position:'relative',zIndex:1}}>
      {/* HERO */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'90px 24px 70px',position:'relative'}}>
        {/* Eyebrow */}
        <div className="fu" style={{animationDelay:'.05s',display:'inline-flex',alignItems:'center',gap:8,
          marginBottom:28,padding:'6px 16px',borderRadius:99,
          background:C.glass,border:`1px solid ${C.border}`,backdropFilter:'blur(10px)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:C.orange,animation:'pulse 2s ease infinite'}}/>
          <span style={{fontFamily:'DM Mono',fontSize:10,color:C.sub,letterSpacing:'.1em'}}>
            TÜRKİYE'NİN İLK VİRAL VIDEO ANALİZ PLATFORMU
          </span>
        </div>

        {/* Headline */}
        <h1 className="fu" style={{animationDelay:'.12s',
          fontFamily:'Bricolage Grotesque',fontWeight:800,
          fontSize:'clamp(38px,6.5vw,80px)',lineHeight:1.05,
          letterSpacing:'-.04em',marginBottom:22,color:C.text}}>
          Videon viral mı<br/>olacak?{' '}
          <span style={{
            background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            filter:`drop-shadow(0 0 30px ${C.glow})`
          }}>60sn'de öğren.</span>
        </h1>

        {/* Sub */}
        <p className="fu" style={{animationDelay:'.2s',fontFamily:'Manrope',fontSize:'clamp(15px,1.8vw,18px)',
          color:C.sub,maxWidth:560,lineHeight:1.75,marginBottom:40}}>
          Yapay zeka 10 boyutu analiz eder, tam olarak ne değiştireceğini ve
          kaç puan kazanacağını söyler.
        </p>

        {/* CTAs */}
        <div className="fu" style={{animationDelay:'.28s',display:'flex',gap:10,flexWrap:'wrap',marginBottom:64}}>
          <Btn onClick={()=>setPage('analiz')} size="lg">Videomu Analiz Et →</Btn>
          <Btn onClick={()=>setPage('trendler')} variant="ghost" size="lg">🔥 Trend Merkezi</Btn>
        </div>

        {/* Stats */}
        <div className="fu" style={{animationDelay:'.36s',
          display:'flex',gap:0,flexWrap:'wrap',
          background:C.glass,border:`1px solid ${C.border}`,
          borderRadius:16,backdropFilter:'blur(10px)',overflow:'hidden'}}>
          {[{n:'10+',l:'Analiz Boyutu'},{n:'+2.4',l:'Ort. Skor İyileşmesi'},{n:'60s',l:'Analiz Süresi'},{n:'%100',l:'Türkçe'}].map((s,i)=>(
            <div key={s.l} style={{flex:'1 1 120px',padding:'20px 24px',
              borderRight:i<3?`1px solid ${C.border}`:'none',textAlign:'center'}}>
              <div style={{fontFamily:'Unbounded',fontSize:26,fontWeight:800,
                background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                marginBottom:4}}>{s.n}</div>
              <div style={{fontFamily:'Manrope',fontSize:11,color:C.sub}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'20px 24px 60px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
          {feats.map((f,i)=>(
            <Glass key={f.n} style={{padding:'26px 22px',animationDelay:`${i*.08}s`}} hover>
              <div style={{fontFamily:'Unbounded',fontSize:36,fontWeight:900,
                color:'rgba(255,90,45,0.12)',lineHeight:1,marginBottom:14}}>{f.n}</div>
              <h3 style={{fontFamily:'Bricolage Grotesque',fontSize:16,fontWeight:700,
                color:C.text,marginBottom:8,letterSpacing:'-.02em'}}>{f.t}</h3>
              <p style={{fontFamily:'Manrope',fontSize:13,color:C.sub,lineHeight:1.7}}>{f.d}</p>
            </Glass>
          ))}
        </div>
      </div>

      {/* DIMS */}
      <div style={{borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
        background:'rgba(255,255,255,0.015)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'48px 24px'}}>
          <h2 style={{fontFamily:'Bricolage Grotesque',fontWeight:800,fontSize:22,
            letterSpacing:'-.03em',color:C.text,marginBottom:6}}>10 Analiz Boyutu</h2>
          <p style={{fontFamily:'Manrope',fontSize:13,color:C.sub,marginBottom:24}}>
            Algoritmanın gerçekten önemsediği her sinyal
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {DIMS.map(d=>(
              <div key={d.key} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 14px',
                background:C.glass,border:`1px solid ${C.border}`,borderRadius:99,
                fontFamily:'Manrope',fontSize:12,backdropFilter:'blur(8px)',
                transition:'all .15s',cursor:'default'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange+'40';e.currentTarget.style.color=C.text;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
                <span>{d.icon}</span>
                <span style={{color:C.sub}}>{d.label}</span>
                <span style={{fontFamily:'DM Mono',fontSize:9,color:C.dim}}>×{d.w}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BOTTOM */}
      <div style={{textAlign:'center',padding:'80px 24px',position:'relative',zIndex:1}}>
        <div style={{display:'inline-block',padding:10,borderRadius:18,
          background:C.gradSoft,border:`1px solid rgba(255,90,45,0.2)`,marginBottom:20}}>
          <Logo size={48}/>
        </div>
        <h2 style={{fontFamily:'Bricolage Grotesque',fontSize:30,fontWeight:800,
          letterSpacing:'-.03em',color:C.text,marginBottom:10}}>Hazır mısın?</h2>
        <p style={{fontFamily:'Manrope',color:C.sub,marginBottom:28,fontSize:15}}>
          Videonu yükle. Viral potansiyelini 60 saniyede keşfet.
        </p>
        <Btn onClick={()=>setPage('analiz')} size="lg">Videomu Analiz Et — Ücretsiz →</Btn>
        <p style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,marginTop:16,letterSpacing:'.06em'}}>
          ANALİZ YAPAY ZEKA TARAFINDAN ÜRETİLMİŞTİR · PERFORMANS GARANTİ EDİLMEZ
        </p>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ANALİZ PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AnalizPage = ({ setPage, setResult }) => {
  const [file,setFile]=useState(null);const [thumb,setThumb]=useState(null);
  const [stage,setStage]=useState('upload');const [step,setStep]=useState(-1);const [error,setError]=useState(null);
  const hf=async f=>{setFile(f);setThumb(f?await getThumb(f):null);setError(null);};
  const go=async()=>{
    if(!file)return; setStage('loading');setError(null);
    const tt=STEPS.map((_,i)=>setTimeout(()=>setStep(i),i*1100));
    try{
      const frames=await extractFrames(file,8);
      if(!frames.length)throw new Error('Kare çıkarılamadı');
      const data=await callClaude([{role:'user',content:[
        ...frames.map(f=>({type:'image',source:{type:'base64',media_type:'image/jpeg',data:f}})),
        {type:'text',text:ANALYSIS_PROMPT}
      ]}]);
      const raw=data.content?.find(c=>c.type==='text')?.text||'';
      const parsed=JSON.parse(cj(raw));
      if(!parsed.genel_skor)throw new Error('Geçersiz analiz');
      tt.forEach(clearTimeout);setStep(6);
      await new Promise(r=>setTimeout(r,600));
      const id=saveH(parsed,file.name,thumb);
      parsed._id=id;parsed._videoName=file.name;parsed._thumbnail=thumb;
      setResult(parsed);setPage('results');
    }catch(e){tt.forEach(clearTimeout);setStage('error');setError(e.message||'Bilinmeyen hata');}
  };
  return (
    <div style={{maxWidth:580,margin:'0 auto',padding:'50px 20px 80px',position:'relative',zIndex:1}}>
      <h1 className="fu" style={{fontFamily:'Bricolage Grotesque',fontSize:28,fontWeight:800,
        letterSpacing:'-.03em',color:C.text,marginBottom:6}}>Video Analizi</h1>
      <p style={{fontFamily:'Manrope',color:C.sub,fontSize:14,marginBottom:30}}>Videoyu yükle, viral potansiyelini öğren.</p>

      {stage==='upload'&&(
        <div className="fu" style={{animationDelay:'.1s'}}>
          <UploadZone label="Sürükle ya da tıkla" file={file} thumb={thumb} onFile={hf} onError={setError}/>
          {error&&<div style={{marginTop:10,padding:'10px 14px',background:'rgba(248,113,113,.07)',
            border:`1px solid rgba(248,113,113,.2)`,borderRadius:10,color:C.danger,
            fontSize:13,fontFamily:'Manrope'}}>⚠️ {error}</div>}
          {file&&<Btn onClick={go} style={{width:'100%',marginTop:14,borderRadius:12}} size="lg">🚀 Analizi Başlat</Btn>}
          <p style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,textAlign:'center',marginTop:12,letterSpacing:'.06em'}}>
            VİDEOLAR SUNUCUYA YÜKLENMİYOR
          </p>
        </div>
      )}

      {stage==='loading'&&(
        <Glass style={{padding:'36px 28px'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <div style={{width:48,height:48,borderRadius:'50%',
              background:C.gradSoft,border:`1.5px solid ${C.orange}40`,
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 18px',animation:'spin 1.5s linear infinite'}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:C.grad,opacity:.8}}/>
            </div>
            <div style={{fontFamily:'Bricolage Grotesque',fontSize:20,fontWeight:700,color:C.text,marginBottom:4}}>Analiz ediliyor…</div>
            <div style={{fontFamily:'Manrope',color:C.sub,fontSize:13}}>Viral potansiyel hesaplanıyor</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,
                opacity:i<=step?1:.3,transition:'all .4s ease'}}>
                <div style={{width:24,height:24,borderRadius:'50%',flexShrink:0,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  background:i<step?C.success:i===step?C.orange:'rgba(255,255,255,0.06)',
                  color:'#fff',fontSize:10,fontFamily:'DM Mono',fontWeight:500,
                  boxShadow:i===step?`0 0 16px ${C.glow}`:'none',
                  animation:i===step?'pulse 1.5s ease infinite':'none',transition:'all .3s'}}>
                  {i<step?'✓':i+1}
                </div>
                <span style={{fontFamily:'Manrope',fontSize:13,color:i===step?C.text:C.sub,fontWeight:i===step?600:400}}>{s}</span>
              </div>
            ))}
          </div>
        </Glass>
      )}

      {stage==='error'&&(
        <div style={{textAlign:'center',padding:40}}>
          <div style={{fontSize:42,marginBottom:12}}>⚠️</div>
          <div style={{fontFamily:'Bricolage Grotesque',fontSize:20,fontWeight:700,color:C.danger,marginBottom:8}}>Analiz başarısız</div>
          <div style={{fontFamily:'Manrope',color:C.sub,fontSize:14,marginBottom:22}}>{error}</div>
          <Btn onClick={()=>{setStage('upload');setStep(-1);}}>Tekrar Dene</Btn>
        </div>
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RESULTS PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ResultsPage = ({ result, setPage }) => {
  const [cop,setCop]=useState(false);const [lcp,setLcp]=useState(false);
  if(!result)return null;
  const b=band(result.genel_skor||0);
  const copyR=()=>{
    const lines=[`ChefXVid — VİRAL ANALİZ RAPORU`,`${result._videoName||'—'} | ${new Date().toLocaleDateString('tr-TR')}`,``,
      `SKOR: ${result.genel_skor?.toFixed(1)}/10 — ${b.label}`,`"${result.genel_yorum}"`,``,
      ...DIMS.map(d=>{const x=result[d.key];if(!x)return '';return `${d.icon} ${d.label}: ${x.skor?.toFixed(1)}/10\n  ${x.gozlem}\n  💡 ${x.oneri}`;}).filter(Boolean),
      ``,`AKSİYON:`, ...(result.aksiyon_plani||[]).map((a,i)=>`${i+1}. ${a.yapilacak} → ${a.tahmini_etki}`),
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(()=>{setCop(true);setTimeout(()=>setCop(false),2200);});
  };
  const shareL=()=>{
    const url=`${window.location.href.split('#')[0]}#r-${result._id}`;
    navigator.clipboard.writeText(url).then(()=>{setLcp(true);setTimeout(()=>setLcp(false),2200);});
  };
  return (
    <div style={{maxWidth:760,margin:'0 auto',padding:'28px 20px 80px',position:'relative',zIndex:1}}>

      {/* SCORE HERO */}
      <Glass glow style={{marginBottom:16,padding:'32px 28px',textAlign:'center'}} hover={false}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,
          background:`linear-gradient(90deg,transparent,${b.c}60,transparent)`,borderRadius:'16px 16px 0 0'}}/>
        <ScoreDisplay score={result.genel_skor||0}/>
        <p style={{fontFamily:'Manrope',fontSize:15,color:C.sub,lineHeight:1.7,
          maxWidth:480,margin:'20px auto 24px',fontStyle:'italic'}}>
          "{result.genel_yorum}"
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:540,margin:'0 auto'}}>
          {[{k:'guclu_yonler',label:'Güçlü Yönler',col:C.success},{k:'kritik_sorunlar',label:'Kritik Sorunlar',col:C.danger}].map(s=>(
            <div key={s.k} style={{padding:'14px',background:C.glass,border:`1px solid ${s.col}20`,borderRadius:12}}>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:s.col,letterSpacing:'.1em',marginBottom:8}}>{s.label.toUpperCase()}</div>
              {(result[s.k]||[]).map(x=>(
                <div key={x} style={{display:'flex',gap:6,alignItems:'flex-start',marginBottom:5,fontFamily:'Manrope',fontSize:12,color:C.sub}}>
                  <span style={{color:s.col,flexShrink:0,marginTop:1}}>{s.k==='guclu_yonler'?'+':'−'}</span>{x}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Glass>

      {/* DIMS */}
      <div style={{marginBottom:16}}>
        <h2 style={{fontFamily:'Bricolage Grotesque',fontSize:18,fontWeight:700,
          letterSpacing:'-.02em',color:C.text,marginBottom:14}}>📊 Boyut Analizleri</h2>
        {DIMS.map((d,i)=><DimCard key={d.key} dim={d} data={result[d.key]} idx={i}/>)}
      </div>

      {/* ACTION PLAN */}
      {(result.aksiyon_plani||[]).length>0&&(
        <Glass style={{marginBottom:16,overflow:'hidden'}} hover={false}>
          <div style={{height:2,background:C.grad,borderRadius:'16px 16px 0 0'}}/>
          <div style={{padding:'22px'}}>
            <h2 style={{fontFamily:'Bricolage Grotesque',fontSize:18,fontWeight:700,letterSpacing:'-.02em',color:C.text,marginBottom:16}}>
              📋 Şimdi Ne Yapmalısın?
            </h2>
            {result.aksiyon_plani.map((a,i)=>(
              <div key={i} style={{display:'flex',gap:14,alignItems:'flex-start',padding:'12px 0',
                borderBottom:i<result.aksiyon_plani.length-1?`1px solid ${C.border}`:'none'}}>
                <div style={{width:28,height:28,borderRadius:99,flexShrink:0,
                  background:C.gradSoft,border:`1px solid rgba(255,90,45,0.3)`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontFamily:'Unbounded',fontSize:10,fontWeight:700,
                  background:C.grad,color:'#fff'}}>{i+1}</div>
                <p style={{flex:1,fontFamily:'Manrope',fontSize:14,color:C.text,lineHeight:1.65}}>{a.yapilacak}</p>
                <div style={{flexShrink:0,background:'rgba(52,211,153,.08)',
                  border:'1px solid rgba(52,211,153,.2)',borderRadius:99,
                  padding:'3px 12px',fontFamily:'DM Mono',fontSize:11,color:C.success,whiteSpace:'nowrap'}}>
                  {a.tahmini_etki}
                </div>
              </div>
            ))}
          </div>
        </Glass>
      )}

      {/* BUTTONS */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <Btn onClick={()=>setPage('analiz')} style={{flex:'1 1 130px',borderRadius:12}}>↑ Yeni Video</Btn>
        <Btn onClick={copyR} variant="ghost" style={{flex:'1 1 130px',borderRadius:12}}>{cop?'✓ Kopyalandı':'📋 Raporu Kopyala'}</Btn>
        <Btn onClick={shareL} variant={lcp?'primary':'ghost'} style={{flex:'1 1 130px',borderRadius:12}}>{lcp?'✓ Link Kopyalandı':'🔗 Paylaş'}</Btn>
        <Btn onClick={()=>setPage('ab')} variant="ghost" style={{flex:'1 1 130px',borderRadius:12}}>⇄ A/B Karşılaştır</Btn>
      </div>
      <p style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,textAlign:'center',marginTop:12,letterSpacing:'.06em'}}>ANALİZ YAPAY ZEKA TARAFINDAN ÜRETİLMİŞTİR · GERÇEK PERFORMANSI GARANTİ ETMEZ</p>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  A/B ANALİZ PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ABPage = () => {
  const [fA,setFA]=useState(null);const [fB,setFB]=useState(null);
  const [tA,setTA]=useState(null);const [tB,setTB]=useState(null);
  const [stage,setStage]=useState('upload');
  const [rA,setRA]=useState(null);const [rB,setRB]=useState(null);
  const [pA,setPA]=useState('w');const [pB,setPB]=useState('w');
  const [err,setErr]=useState(null);
  const hFA=async f=>{setFA(f);setTA(f?await getThumb(f):null);};
  const hFB=async f=>{setFB(f);setTB(f?await getThumb(f):null);};
  const analyzeOne=async(file,setRes,setP)=>{
    setP('a');
    const frames=await extractFrames(file,8);
    const data=await callClaude([{role:'user',content:[
      ...frames.map(f=>({type:'image',source:{type:'base64',media_type:'image/jpeg',data:f}})),
      {type:'text',text:ANALYSIS_PROMPT}
    ]}]);
    const raw=data.content?.find(c=>c.type==='text')?.text||'';
    const p=JSON.parse(cj(raw));if(!p.genel_skor)throw new Error('Geçersiz');
    setRes(p);setP('d');return p;
  };
  const go=async()=>{
    if(!fA||!fB)return;setStage('loading');setErr(null);setPA('w');setPB('w');
    try{const[ra,rb]=await Promise.all([analyzeOne(fA,setRA,setPA),analyzeOne(fB,setRB,setPB)]);setRA(ra);setRB(rb);setStage('results');}
    catch(e){setStage('error');setErr(e.message||'Hata');}
  };
  const PBadge=({p,l})=>{
    const m={w:{c:C.dim,t:'Bekliyor'},a:{c:C.orange,t:'Analiz ediliyor…'},d:{c:C.success,t:'Tamamlandı ✓'}};
    const s=m[p]||m.w;
    return <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 14px',
      background:C.glass,border:`1px solid ${s.c}30`,borderRadius:99,backdropFilter:'blur(8px)',
      fontFamily:'Manrope',fontSize:12,fontWeight:600,color:s.c}}>
      {p==='a'&&<div style={{width:6,height:6,borderRadius:'50%',background:s.c,animation:'pulse 1s infinite'}}/>}
      {l}: {s.t}
    </div>;
  };
  const win=rA&&rB?(rA.genel_skor>=rB.genel_skor?'A':'B'):null;
  return (
    <div style={{maxWidth:860,margin:'0 auto',padding:'40px 20px 80px',position:'relative',zIndex:1}}>
      <h1 className="fu" style={{fontFamily:'Bricolage Grotesque',fontSize:28,fontWeight:800,letterSpacing:'-.03em',color:C.text,marginBottom:6}}>A/B Analiz Modu</h1>
      <p style={{fontFamily:'Manrope',color:C.sub,fontSize:14,marginBottom:28}}>İki versiyonu karşılaştır, hangisini yayınlayacağını öğren.</p>

      {stage==='upload'&&(
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            {[{l:'A',f:fA,t:tA,hF:hFA},{l:'B',f:fB,t:tB,hF:hFB}].map(s=>(
              <div key={s.l}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:26,height:26,borderRadius:99,background:C.grad,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'Unbounded',fontSize:11,fontWeight:700,color:'#fff'}}>
                    {s.l}
                  </div>
                  <span style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:13,color:C.text}}>Video {s.l}</span>
                </div>
                <UploadZone label={`Video ${s.l} yükle`} file={s.f} thumb={s.t} onFile={s.hF} onError={setErr} compact/>
              </div>
            ))}
          </div>
          {err&&<div style={{marginBottom:12,padding:'10px 14px',background:'rgba(248,113,113,.07)',border:`1px solid rgba(248,113,113,.2)`,borderRadius:10,color:C.danger,fontSize:13,fontFamily:'Manrope'}}>⚠️ {err}</div>}
          {fA&&fB&&<Btn onClick={go} style={{width:'100%',borderRadius:12}} size="lg">⇄ Her İkisini Analiz Et</Btn>}
        </div>
      )}

      {stage==='loading'&&(
        <Glass style={{padding:'32px',textAlign:'center'}}>
          <div style={{width:46,height:46,borderRadius:'50%',border:`1.5px solid transparent`,
            borderTopColor:C.orange,margin:'0 auto 16px',animation:'spin 1s linear infinite'}}/>
          <div style={{fontFamily:'Bricolage Grotesque',fontSize:20,fontWeight:700,color:C.text,marginBottom:16}}>İki video aynı anda analiz ediliyor…</div>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <PBadge p={pA} l="Video A"/><PBadge p={pB} l="Video B"/>
          </div>
        </Glass>
      )}

      {stage==='error'&&(
        <div style={{textAlign:'center',padding:40}}>
          <div style={{fontSize:40,marginBottom:10}}>⚠️</div>
          <div style={{fontFamily:'Bricolage Grotesque',fontSize:18,fontWeight:700,color:C.danger,marginBottom:8}}>Analiz başarısız</div>
          <div style={{fontFamily:'Manrope',color:C.sub,fontSize:13,marginBottom:20}}>{err}</div>
          <Btn onClick={()=>{setStage('upload');setRA(null);setRB(null);}}>Tekrar Dene</Btn>
        </div>
      )}

      {stage==='results'&&rA&&rB&&(()=>{
        const bA=band(rA.genel_skor||0),bB=band(rB.genel_skor||0);
        const diff=Math.abs((rA.genel_skor||0)-(rB.genel_skor||0));
        return (
          <div>
            {/* Winner */}
            <Glass glow style={{marginBottom:16,padding:'24px',textAlign:'center'}}>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.sub,letterSpacing:'.12em',marginBottom:8}}>KARAR</div>
              <div style={{fontFamily:'Bricolage Grotesque',fontSize:30,fontWeight:800,
                letterSpacing:'-.03em',background:C.grad,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Video {win} Yayınla!
              </div>
              {diff>0&&<div style={{fontFamily:'DM Mono',fontSize:11,color:C.sub,marginTop:6}}>{diff.toFixed(1)} puan fark</div>}
            </Glass>

            {/* Side by side */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 50px 1fr',gap:12,marginBottom:16}}>
              {[{r:rA,b:bA,l:'A',w:win==='A'},{},{r:rB,b:bB,l:'B',w:win==='B'}].map((x,i)=>{
                if(i===1)return<div key="vs" style={{display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bricolage Grotesque',fontSize:16,fontWeight:700,color:C.dim}}>vs</div>;
                const{r,b,l,w}=x;
                return <Glass key={l} style={{padding:'20px',textAlign:'center',border:w?`1px solid ${b.c}40`:undefined}}>
                  {w&&<div style={{fontFamily:'DM Mono',fontSize:9,color:b.c,letterSpacing:'.1em',marginBottom:8}}>★ KAZANAN</div>}
                  <div style={{fontFamily:'Unbounded',fontSize:12,fontWeight:700,color:b.c,marginBottom:12}}>{l}</div>
                  <ScoreDisplay score={r.genel_skor||0} compact/>
                </Glass>;
              })}
            </div>

            {/* Comparison table */}
            <Glass style={{overflow:'hidden'}} hover={false}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 48px 1fr',padding:'12px 16px',
                background:'rgba(255,255,255,0.02)',borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.08em'}}>VİDEO A</span>
                <div/>
                <span style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.08em',textAlign:'right'}}>VİDEO B</span>
              </div>
              {DIMS.map((d,i)=>{
                const sa=rA[d.key]?.skor||0,sb=rB[d.key]?.skor||0,aw=sa>sb,same=sa===sb;
                return <div key={d.key} style={{display:'grid',gridTemplateColumns:'1fr 48px 1fr',
                  padding:'10px 16px',alignItems:'center',borderBottom:i<DIMS.length-1?`1px solid ${C.border}`:'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontFamily:'Unbounded',fontSize:15,fontWeight:700,
                      color:aw?C.success:same?C.dim:C.danger}}>{sa.toFixed(1)}</span>
                    {aw&&<span style={{color:C.success,fontSize:10}}>▲</span>}
                  </div>
                  <div style={{textAlign:'center',fontSize:14}}>{d.icon}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end'}}>
                    {!aw&&!same&&<span style={{color:C.success,fontSize:10}}>▲</span>}
                    <span style={{fontFamily:'Unbounded',fontSize:15,fontWeight:700,
                      color:!aw&&!same?C.success:same?C.dim:C.danger}}>{sb.toFixed(1)}</span>
                  </div>
                </div>;
              })}
            </Glass>
            <Btn variant="ghost" onClick={()=>{setStage('upload');setRA(null);setRB(null);setFA(null);setFB(null);}} style={{width:'100%',marginTop:12,borderRadius:12}}>↺ Yeni A/B Testi</Btn>
          </div>
        );
      })()}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TRENDLER PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TrendlerPage = () => {
  const [data,setData]=useState(null);const [load,setLoad]=useState(false);
  const [niche,setNiche]=useState('');const [err,setErr]=useState(null);
  const [upd,setUpd]=useState(null);const [tab,setTab]=useState('formatlar');

  const fetchT=async n=>{
    setLoad(true);setErr(null);
    try{
      const date=new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
      const res=await callClaude([{role:'user',content:TREND_PROMPT(date,n)}],[{type:'web_search_20250305',name:'web_search'}],4096);
      const raw=res.content?.filter(c=>c.type==='text').map(c=>c.text).join('')||'';
      const p=JSON.parse(cj(raw));setData(p);setUpd(new Date().toLocaleString('tr-TR'));
      localStorage.setItem('cvx_t',JSON.stringify({data:p,ts:Date.now()}));
    }catch(e){setErr('Trend güncellenirken hata oluştu.');try{const c=JSON.parse(localStorage.getItem('cvx_t')||'null');if(c?.data){setData(c.data);setUpd('Önbellek');}}catch{}}
    setLoad(false);
  };

  useEffect(()=>{
    try{const c=JSON.parse(localStorage.getItem('cvx_t')||'null');if(c?.data&&Date.now()-c.ts<86400000){setData(c.data);setUpd(new Date(c.ts).toLocaleString('tr-TR'));return;}}catch{}
    fetchT('');
  },[]);

  const Skel=()=><Glass style={{padding:20}}>
    {[80,100,60].map((w,i)=>(
      <div key={i} style={{height:11,borderRadius:6,marginBottom:10,width:`${w}%`,
        background:'rgba(255,255,255,0.04)',overflow:'hidden',position:'relative'}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,90,45,0.08),transparent)',
          animation:'shimmer 1.6s linear infinite'}}/>
      </div>
    ))}
  </Glass>;

  const fireE=n=>'🔥'.repeat(Math.min(n||1,3));
  const lm={yeni:{c:C.success,l:'Yeni 🟢'},zirve:{c:C.warn,l:"Zirve 🟡"},dusus:{c:C.danger,l:'Düşüyor 🔴'}};
  const rm={dusuk:{c:C.success,l:'Düşük Rekabet'},orta:{c:C.warn,l:'Orta Rekabet'},yuksek:{c:C.danger,l:'Yüksek Rekabet'}};

  const TABS=[{k:'formatlar',l:'Formatlar'},{k:'sesler',l:'Sesler'},{k:'algoritma',l:'Algoritma'},
    {k:'nis',l:'Nişe Göre'},{k:'anatomi',l:'Anatomi'},{k:'skor',l:'Canlı Skor'}];

  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:'36px 20px 80px',position:'relative',zIndex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14,marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Bricolage Grotesque',fontSize:26,fontWeight:800,letterSpacing:'-.03em',color:C.text,marginBottom:4}}>Trend Merkezi</h1>
          <p style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.08em'}}>{upd?`SON GÜNCELLEME: ${upd}`:'YÜKLENİYOR…'}</p>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          <select value={niche} onChange={e=>setNiche(e.target.value)} style={{
            background:C.glass,border:`1px solid ${C.border}`,color:C.text,
            borderRadius:99,padding:'8px 16px',fontSize:12,fontFamily:'Manrope',cursor:'pointer',
            backdropFilter:'blur(8px)',outline:'none',
          }}>
            <option value="">Tüm nişler</option>
            {NICHES.map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <Btn onClick={()=>fetchT(niche)} disabled={load} size="sm">{load?'Güncelleniyor…':'↺ Güncelle'}</Btn>
        </div>
      </div>

      {err&&<div style={{marginBottom:14,padding:'10px 14px',background:'rgba(248,113,113,.07)',
        border:`1px solid rgba(248,113,113,.2)`,borderRadius:10,color:C.danger,fontSize:12,fontFamily:'Manrope',marginBottom:16}}>⚠️ {err}</div>}

      {/* Tab bar */}
      <div style={{display:'flex',gap:4,marginBottom:24,padding:'4px',
        background:C.glass,borderRadius:99,border:`1px solid ${C.border}`,
        backdropFilter:'blur(10px)',flexWrap:'wrap',width:'fit-content'}}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            background:tab===t.k?C.grad:'transparent',border:'none',
            color:tab===t.k?'#fff':C.sub,padding:'7px 16px',cursor:'pointer',
            fontFamily:'Bricolage Grotesque',fontSize:12,fontWeight:tab===t.k?700:500,
            borderRadius:99,transition:'all .18s ease',
          }}>{t.l}</button>
        ))}
      </div>

      {tab==='formatlar'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
          {load?[1,2,3].map(i=><Skel key={i}/>):
            (data?.patlayan_formatlar||[]).map((f,i)=>(
              <Glass key={i} style={{padding:'20px',overflow:'hidden'}}>
                <div style={{height:2,background:C.grad,margin:'-20px -20px 16px',borderRadius:'16px 16px 0 0'}}/>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <h3 style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:14,color:C.text,lineHeight:1.3}}>{f.format_adi}</h3>
                  <span>{fireE(f.ates_seviyesi)}</span>
                </div>
                <p style={{fontFamily:'Manrope',fontSize:12,color:C.sub,lineHeight:1.65,marginBottom:12}}>{f.aciklama}</p>
                <div style={{padding:'10px 12px',background:C.glass,borderRadius:10,marginBottom:8}}>
                  <div style={{fontFamily:'DM Mono',fontSize:9,color:C.amber,letterSpacing:'.08em',marginBottom:4}}>NEDEN ÇALIŞIYOR</div>
                  <p style={{fontFamily:'Manrope',fontSize:12,color:C.sub}}>{f.neden_calisuyor}</p>
                </div>
                <div style={{padding:'10px 12px',background:C.gradSoft,border:`1px solid rgba(255,90,45,0.15)`,borderRadius:10}}>
                  <div style={{fontFamily:'DM Mono',fontSize:9,color:C.orange,letterSpacing:'.08em',marginBottom:4}}>NASIL KULLANILİR</div>
                  <p style={{fontFamily:'Manrope',fontSize:12,color:C.sub}}>{f.nasil_kullanilir}</p>
                </div>
              </Glass>
            ))}
        </div>
      )}

      {tab==='sesler'&&(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {load?[1,2,3].map(i=><Skel key={i}/>):
            (data?.trend_sesler||[]).map((s,i)=>{
              const lc=lm[s.yasam_suresi]||lm.yeni;
              return <Glass key={i} style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
                <div style={{width:40,height:40,borderRadius:99,flexShrink:0,background:C.grad,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🎵</div>
                <div style={{flex:1,minWidth:160}}>
                  <div style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>{s.ses_adi}</div>
                  <div style={{fontFamily:'Manrope',fontSize:12,color:C.sub}}>{s.neden_trend}</div>
                  <div style={{fontFamily:'DM Mono',fontSize:10,color:C.dim,marginTop:2}}>En iyi: {s.en_iyi_icin}</div>
                </div>
                <div style={{padding:'4px 12px',borderRadius:99,background:`${lc.c}12`,
                  border:`1px solid ${lc.c}25`,color:lc.c,fontFamily:'Bricolage Grotesque',fontSize:11,fontWeight:600}}>
                  {lc.l}
                </div>
              </Glass>;
            })}
        </div>
      )}

      {tab==='algoritma'&&(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {load?[1,2].map(i=><Skel key={i}/>):
            (data?.algoritma_haberleri||[]).map((h,i)=>(
              <Glass key={i} style={{padding:'20px',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${C.orange}40,transparent)`}}/>
                <div style={{display:'flex',justifyContent:'space-between',gap:10,marginBottom:8}}>
                  <h3 style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:15,color:C.text,lineHeight:1.3}}>{h.baslik}</h3>
                  <span style={{fontFamily:'DM Mono',fontSize:10,color:C.dim,flexShrink:0}}>{h.tarih}</span>
                </div>
                <p style={{fontFamily:'Manrope',fontSize:13,color:C.sub,lineHeight:1.65,marginBottom:12}}>{h.ozet}</p>
                <div style={{padding:'12px',background:C.gradSoft,border:`1px solid rgba(255,90,45,0.2)`,borderRadius:10}}>
                  <div style={{fontFamily:'DM Mono',fontSize:9,color:C.orange,letterSpacing:'.08em',marginBottom:4}}>⚡ CREATOR ETKİSİ</div>
                  <p style={{fontFamily:'Manrope',fontSize:13,color:C.text,lineHeight:1.6}}>{h.icerik_uretici_etkisi}</p>
                </div>
              </Glass>
            ))}
        </div>
      )}

      {tab==='nis'&&(!niche?(
        <Glass style={{padding:'36px',textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:12}}>🎯</div>
          <h3 style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:17,color:C.text,marginBottom:8}}>Nişini seç</h3>
          <p style={{fontFamily:'Manrope',fontSize:14,color:C.sub,marginBottom:20}}>Yukarıdan niş seç ve Güncelle'ye bas.</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
            {NICHES.map(n=>(
              <button key={n} onClick={()=>{setNiche(n);fetchT(n);}} style={{
                background:C.glass,border:`1px solid ${C.border}`,color:C.sub,
                borderRadius:99,padding:'7px 16px',cursor:'pointer',fontSize:12,fontFamily:'Manrope',
                transition:'all .15s',backdropFilter:'blur(8px)',
              }} onMouseEnter={e=>{e.target.style.borderColor=C.orange+'50';e.target.style.color=C.text;}}
                 onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.sub;}}>
                {n}
              </button>
            ))}
          </div>
        </Glass>
      ):load?<div style={{display:'flex',flexDirection:'column',gap:10}}>{[1,2,3].map(i=><Skel key={i}/>)}</div>:
        data?.nis_analizi&&(()=>{
          const na=data.nis_analizi;
          return <div>
            <Glass style={{padding:'14px 18px',marginBottom:18,display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:C.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🎯</div>
              <div>
                <div style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:15,color:C.text}}>{na.nis||niche}</div>
                <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.06em'}}>NİŞE ÖZEL ANALİZ</div>
              </div>
            </Glass>
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:10}}>TREND İÇERİK TİPLERİ</div>
              {(na.trending_tipler||[]).map((t,i)=>(
                <Glass key={i} style={{padding:'12px 16px',marginBottom:6,display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span>{fireE(t.ates_seviyesi)}</span>
                  <div>
                    <div style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:13,color:C.text,marginBottom:2}}>{t.tip}</div>
                    <div style={{fontFamily:'Manrope',fontSize:12,color:C.sub}}>{t.aciklama}</div>
                  </div>
                </Glass>
              ))}
            </div>
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.danger,letterSpacing:'.1em',marginBottom:10}}>BUNLARDAN KAÇIN</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                {(na.kacinin_konular||[]).map(k=>(
                  <div key={k} style={{padding:'5px 14px',background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.18)',borderRadius:99,fontFamily:'Manrope',fontSize:12,color:C.danger}}>✗ {k}</div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.success,letterSpacing:'.1em',marginBottom:10}}>YÜKSELEN KONULAR</div>
              {(na.yukselen_konular||[]).map((y,i)=>{
                const rc=rm[y.rekabet]||rm.orta;
                return <Glass key={i} style={{padding:'12px 16px',marginBottom:6,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                  <div>
                    <div style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:13,color:C.success,marginBottom:2}}>{y.konu}</div>
                    <div style={{fontFamily:'Manrope',fontSize:12,color:C.sub}}>{y.neden}</div>
                  </div>
                  <div style={{padding:'4px 12px',borderRadius:99,background:`${rc.c}10`,border:`1px solid ${rc.c}25`,color:rc.c,fontFamily:'Bricolage Grotesque',fontSize:11,fontWeight:600,flexShrink:0}}>{rc.l}</div>
                </Glass>;
              })}
            </div>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.amber,letterSpacing:'.1em',marginBottom:10}}>CREATOR İPUÇLARI</div>
              {(na.ipuclari||[]).map((ip,i)=>(
                <Glass key={i} style={{padding:'12px 16px',marginBottom:6,display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{width:22,height:22,borderRadius:99,background:C.grad,flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'Unbounded',fontSize:9,fontWeight:700,color:'#fff'}}>{i+1}</div>
                  <p style={{fontFamily:'Manrope',fontSize:13,color:C.sub,lineHeight:1.65}}>{ip}</p>
                </Glass>
              ))}
            </div>
          </div>;
        })()
      )}

      {tab==='anatomi'&&(load?<Skel/>:data?.viral_anatomi&&(
        <Glass style={{padding:'24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:20,marginBottom:24}}>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:6}}>ORT. SÜRE</div>
              <div style={{fontFamily:'Unbounded',fontSize:40,fontWeight:800,background:C.grad,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{data.viral_anatomi.ortalama_sure_saniye}s</div>
            </div>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:6}}>EN İYİ PAYLAŞIM</div>
              <div style={{fontFamily:'Bricolage Grotesque',fontSize:14,fontWeight:700,color:C.text}}>{(data.viral_anatomi.en_iyi_paylasim_saatleri||[]).join(' · ')}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,paddingTop:20,borderTop:`1px solid ${C.border}`}}>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:10}}>KANCA TİPLERİ</div>
              {(data.viral_anatomi.en_yaygin_kanca_tipleri||[]).map(k=>(
                <div key={k} style={{display:'flex',gap:8,padding:'6px 0',borderBottom:`1px solid ${C.border}`}}>
                  <span style={{color:C.orange,fontSize:12}}>→</span>
                  <span style={{fontFamily:'Manrope',fontSize:13,color:C.sub}}>{k}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:10}}>DOMINANT DUYGULAR</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {(data.viral_anatomi.dominant_duygular||[]).map(d=>(
                  <div key={d} style={{padding:'5px 14px',background:C.glass,border:`1px solid ${C.border}`,borderRadius:99,fontFamily:'Manrope',fontSize:12,color:C.text,backdropFilter:'blur(8px)'}}>{d}</div>
                ))}
              </div>
            </div>
          </div>
        </Glass>
      ))}

      {tab==='skor'&&(load?<Skel/>:data?.emergent_skor&&(
        <Glass glow style={{padding:'28px',overflow:'hidden'}}>
          <div style={{height:2,background:C.grad,margin:'-28px -28px 28px',borderRadius:'16px 16px 0 0'}}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:28}}>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:8}}>ALGORİTMA AGRESİFLİK SKORU</div>
              <div style={{fontFamily:'Unbounded',fontSize:56,fontWeight:800,background:C.grad,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',lineHeight:.9,marginBottom:12}}>
                {data.emergent_skor.algoritma_agresivligi}
                <span style={{fontSize:22}}>/10</span>
              </div>
              <div style={{height:5,background:'rgba(255,255,255,0.06)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(data.emergent_skor.algoritma_agresivligi||0)*10}%`,
                  background:C.grad,borderRadius:99,boxShadow:`0 0 10px ${C.glow}`}}/>
              </div>
            </div>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:10}}>BU HAFTA VİRAL İÇİN?</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 18px',borderRadius:99,
                background:data.emergent_skor.bu_hafta_viral_mi?'rgba(52,211,153,.1)':'rgba(248,113,113,.1)',
                border:`1px solid ${data.emergent_skor.bu_hafta_viral_mi?C.success:C.danger}30`,
                color:data.emergent_skor.bu_hafta_viral_mi?C.success:C.danger,
                fontFamily:'Bricolage Grotesque',fontSize:14,fontWeight:700}}>
                {data.emergent_skor.bu_hafta_viral_mi?'✓ EN İYİ ZAMAN':'✗ SABIR ET'}
              </div>
              <p style={{fontFamily:'Manrope',fontSize:12,color:C.sub,marginTop:8,lineHeight:1.6}}>{data.emergent_skor.aciklama}</p>
            </div>
            <div>
              <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:8}}>DOMINANT DUYGU</div>
              <div style={{fontFamily:'Bricolage Grotesque',fontSize:28,fontWeight:800,
                background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                {data.emergent_skor.dominant_duygu||'—'}
              </div>
            </div>
          </div>
        </Glass>
      ))}

      <div style={{marginTop:18,padding:'10px 14px',background:C.glass,border:`1px solid ${C.border}`,borderRadius:10,backdropFilter:'blur(8px)'}}>
        <p style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.04em'}}>
          TÜM TREND VERİLERİ YAPAY ZEKA WEB ARAMASI SONUCU SENTEZLENMİŞTİR.
        </p>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GECMİŞ PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GecmisPage = ({ setPage, setResult }) => {
  const [hist,setHist]=useState([]);const [cA,setCA]=useState(null);const [cB,setCB]=useState(null);const [showC,setShowC]=useState(false);
  useEffect(()=>{try{setHist(JSON.parse(localStorage.getItem('cvx_h')||'[]'));}catch{setHist([]);}}, []);
  const scC=s=>s>=7?C.success:s>=5?C.warn:C.danger;
  const chart=hist.slice().reverse().map((h,i)=>({name:`#${i+1}`,skor:+(h.score||0).toFixed(1)}));
  if(!hist.length)return(
    <div style={{maxWidth:560,margin:'0 auto',padding:'80px 20px',textAlign:'center',position:'relative',zIndex:1}}>
      <div style={{fontSize:48,marginBottom:14}}>📭</div>
      <h2 style={{fontFamily:'Bricolage Grotesque',fontSize:22,fontWeight:800,letterSpacing:'-.03em',color:C.text,marginBottom:8}}>Henüz analiz yok</h2>
      <p style={{fontFamily:'Manrope',color:C.sub,fontSize:14,marginBottom:24}}>Bir video analiz edince sonuçlar burada görünecek.</p>
      <Btn onClick={()=>setPage('analiz')}>Video Analiz Et →</Btn>
    </div>
  );
  const eA=cA?hist.find(h=>h.id===cA):null;const eB=cB?hist.find(h=>h.id===cB):null;
  return (
    <div style={{maxWidth:840,margin:'0 auto',padding:'32px 20px 80px',position:'relative',zIndex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:'Bricolage Grotesque',fontSize:24,fontWeight:800,letterSpacing:'-.03em',color:C.text}}>Analiz Geçmişi</h1>
          <p style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.08em',marginTop:3}}>{hist.length} KAYIT</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          {cA&&cB&&<Btn variant="ghost" onClick={()=>setShowC(!showC)} size="sm">{showC?'← Liste':'⇄ Karşılaştır'}</Btn>}
          <Btn variant="outline" onClick={()=>{localStorage.removeItem('cvx_h');setHist([]);}} size="sm">🗑 Temizle</Btn>
        </div>
      </div>

      {chart.length>1&&(
        <Glass style={{padding:'18px 14px',marginBottom:18}}>
          <div style={{fontFamily:'DM Mono',fontSize:9,color:C.dim,letterSpacing:'.1em',marginBottom:12}}>SKOR GELİŞİMİ</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
              <XAxis dataKey="name" tick={{fill:C.dim,fontSize:10,fontFamily:'DM Mono'}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,10]} tick={{fill:C.dim,fontSize:10,fontFamily:'DM Mono'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'rgba(20,14,10,0.95)',border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,color:C.text,backdropFilter:'blur(10px)'}} formatter={v=>[v.toFixed(1),'Skor']}/>
              <Line type="monotone" dataKey="skor" stroke={C.orange} strokeWidth={2} dot={{fill:C.orange,r:3,strokeWidth:0}}/>
            </LineChart>
          </ResponsiveContainer>
        </Glass>
      )}

      {showC&&eA&&eB&&(
        <Glass style={{marginBottom:16,padding:'22px',overflow:'hidden'}}>
          <div style={{height:2,background:C.grad,margin:'-22px -22px 18px',borderRadius:'16px 16px 0 0'}}/>
          <h3 style={{fontFamily:'Bricolage Grotesque',fontSize:17,fontWeight:700,color:C.text,marginBottom:16}}>Karşılaştırma</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 44px 1fr',gap:12}}>
            {[eA,'vs',eB].map((e,i)=>{
              if(e==='vs')return<div key="vs" style={{display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bricolage Grotesque',fontSize:16,fontWeight:700,color:C.dim}}>vs</div>;
              const isA=i===0;
              return <div key={e.id}>
                <div style={{fontFamily:'Bricolage Grotesque',fontSize:12,fontWeight:600,color:C.text,marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.videoName}</div>
                <div style={{fontFamily:'Unbounded',fontSize:32,fontWeight:800,color:scC(e.score),marginBottom:12,background:`linear-gradient(135deg,${scC(e.score)},${scC(e.score)}99)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{e.score.toFixed(1)}</div>
                {DIMS.slice(0,6).map(d=>{
                  const sa=eA.result?.[d.key]?.skor||0,sb=eB.result?.[d.key]?.skor||0;
                  const mine=isA?sa:sb,other=isA?sb:sa;
                  const cc=mine>other?C.success:mine<other?C.danger:C.warn;
                  return <div key={d.key} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontFamily:'Manrope',fontSize:11,color:C.sub}}>{d.icon} {d.label}</span>
                    <span style={{fontFamily:'Unbounded',fontSize:12,fontWeight:700,color:cc}}>{mine.toFixed(1)}</span>
                  </div>;
                })}
              </div>;
            })}
          </div>
        </Glass>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {hist.map(h=>{
          const selA=cA===h.id,selB=cB===h.id; const b=band(h.score||0);
          return <Glass key={h.id} style={{padding:'14px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',
            border:selA||selB?`1px solid ${C.orange}40`:undefined}} hover={false}>
            {h.thumbnail&&<img src={h.thumbnail} alt="" style={{width:36,height:54,objectFit:'cover',borderRadius:7,border:`1px solid ${C.border}`,flexShrink:0}}/>}
            <div style={{flex:1,minWidth:160}}>
              <div style={{fontFamily:'Bricolage Grotesque',fontWeight:600,fontSize:13,color:C.text,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:250}}>{h.videoName}</div>
              <div style={{fontFamily:'DM Mono',fontSize:10,color:C.dim}}>{new Date(h.date).toLocaleDateString('tr-TR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
              <div style={{display:'flex',gap:5,marginTop:5,flexWrap:'wrap'}}>
                {(h.result?.kritik_sorunlar||[]).slice(0,2).map(s=>(
                  <span key={s} style={{fontFamily:'Manrope',fontSize:10,padding:'2px 9px',background:'rgba(248,113,113,.07)',border:'1px solid rgba(248,113,113,.15)',borderRadius:99,color:C.danger}}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{textAlign:'center',flexShrink:0}}>
              <div style={{fontFamily:'Unbounded',fontSize:24,fontWeight:800,color:b.c,filter:`drop-shadow(0 0 8px ${b.g})`}}>{(h.score||0).toFixed(1)}</div>
              <div style={{fontFamily:'Manrope',fontSize:10,color:C.dim}}>{b.emoji} {b.label}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:5,flexShrink:0}}>
              <Btn variant="ghost" onClick={()=>{setResult(h.result);setPage('results');}} size="sm" style={{borderRadius:8}}>Görüntüle</Btn>
              <Btn variant={selA||selB?'primary':'outline'} size="sm" style={{borderRadius:8}}
                onClick={()=>{
                  if(!cA||(cA&&cB)){setCA(h.id);setCB(null);setShowC(false);}
                  else{setCB(h.id);setShowC(true);}
                }}>
                {selA?'⇄ A':selB?'⇄ B':'⇄ Karşılaştır'}
              </Btn>
            </div>
          </Glass>;
        })}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [page, setPage]=useState('landing');
  const [result, setResult]=useState(null);
  useEffect(()=>{
    const h=window.location.hash;
    if(h.startsWith('#r-')){
      const id=h.slice(3);
      try{const hh=JSON.parse(localStorage.getItem('cvx_h')||'[]');const f=hh.find(x=>x.id===id);if(f){setResult(f.result);setPage('results');}}catch{}
    }
  },[]);
  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,position:'relative'}}>
      <GlobalStyles/>
      <Orbs/>
      <div style={{position:'relative',zIndex:1}}>
        <Navbar page={page} setPage={setPage}/>
        <main>
          {page==='landing'  && <LandingPage setPage={setPage}/>}
          {page==='analiz'   && <AnalizPage  setPage={setPage} setResult={setResult}/>}
          {page==='results'  && <ResultsPage result={result}   setPage={setPage}/>}
          {page==='trendler' && <TrendlerPage/>}
          {page==='ab'       && <ABPage/>}
          {page==='gecmis'   && <GecmisPage  setPage={setPage} setResult={setResult}/>}
        </main>
      </div>
    </div>
  );
}
