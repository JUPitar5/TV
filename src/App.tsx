import { useEffect, useState } from 'react';
import './index.css';

type Project = { id:number; category:string; title:string; status:string; tagline:string; description:string; role:string; images:string[]; link:string | null; sort_order:number };
const base = 'https://michelearleo.fiii.co';
const asset = (path:string) => path.startsWith('http') || path.startsWith('/dummy/') ? path : `${base}${path}`;

function App(){
  const [projects,setProjects]=useState<Project[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [word,setWord]=useState(0);
  useEffect(()=>{ fetch('/api/projects').then(async r=>{if(!r.ok) throw new Error('Unable to load projects'); return r.json()}).then(setProjects).catch(()=>setError('Projects could not be loaded. Please refresh the page.')).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{const timer=window.setInterval(()=>setWord(w=>(w+1)%5),2600);return()=>window.clearInterval(timer)},[]);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements=document.querySelectorAll<HTMLElement>('.section-head, .project-copy, .gallery figure, .brand-letters img, .brand-head > p, .logo-card, .reels h2, .reels > p, .reel-grid > div, .ux-head, .ux-card, .about > h2, .about-intro, .about-block, .about-split, .contact h2, .contact-panel');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    }),{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
    elements.forEach(element=>{element.classList.add('reveal');observer.observe(element)});
    return()=>observer.disconnect();
  },[projects]);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero=document.querySelector<HTMLElement>('.hero');
    const mac=document.querySelector<HTMLElement>('.hero-mac');
    if(!hero || !mac) return;
    const move=(event:PointerEvent)=>{
      if(event.pointerType==='touch') return;
      const bounds=hero.getBoundingClientRect();
      mac.style.setProperty('--tilt-x',`${((event.clientY-bounds.top)/bounds.height-.5)*-8}deg`);
      mac.style.setProperty('--tilt-y',`${((event.clientX-bounds.left)/bounds.width-.5)*12}deg`);
    };
    const reset=()=>{mac.style.setProperty('--tilt-x','0deg');mac.style.setProperty('--tilt-y','0deg')};
    hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',reset);
    return()=>{hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset)};
  },[]);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const rail=document.querySelector<HTMLElement>('.logo-rail');
    const track=document.querySelector<HTMLElement>('.logo-strip');
    const nav=document.querySelector<HTMLElement>('.nav');
    const links=Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav nav a[href^="#"]'));
    const dot=document.querySelector<HTMLElement>('.nav-dot');
    const cards=Array.from(document.querySelectorAll<HTMLElement>('.ux-card'));
    const shots=Array.from(document.querySelectorAll<HTMLElement>('.gallery figure, .ux-shots figure'));
    let frame=0;
    const update=()=>{
      frame=0;
      const height=window.innerHeight;
      const wide=window.innerWidth>=900 && !reduced.matches;
      if(rail && track){
        if(wide){
          const max=Math.max(0,track.scrollWidth-window.innerWidth);
          rail.style.height=`${height+max/1.4}px`;
          const progress=Math.max(0,Math.min(1,-rail.getBoundingClientRect().top/(max/1.4||1)));
          track.style.setProperty('--rail-x',`${-progress*max}px`);
          rail.style.setProperty('--rail-progress',`${progress}`);
        }else{rail.style.height='';track.style.removeProperty('--rail-x');rail.style.removeProperty('--rail-progress')}
      }
      const line=64+height*.3;
      let active:HTMLAnchorElement | undefined;
      links.forEach(link=>{const section=document.querySelector<HTMLElement>(link.hash);if(section && section.getBoundingClientRect().top<=line) active=link});
      links.forEach(link=>link.classList.toggle('is-active',link===active));
      if(dot && active && !active.classList.contains('nav-cta')){
        dot.style.setProperty('--dot-x',`${active.offsetLeft+active.offsetWidth/2}px`);
        dot.style.opacity='1';
      }else if(dot) dot.style.opacity='0';
      nav?.classList.toggle('nav-light',document.querySelector<HTMLElement>('#contact')!.getBoundingClientRect().top<=64);
      if(!reduced.matches){
        shots.forEach((shot,index)=>{
          const box=shot.getBoundingClientRect();
          const depth=((height/2-(box.top+box.height/2))*(index%2===0?.035:-.035));
          shot.style.setProperty('--depth',`${Math.max(-18,Math.min(18,depth))}px`);
        });
        cards.forEach((card,index)=>{
          const next=cards[index+1];
          const covered=wide && next ? Math.max(0,Math.min(1,(height-next.getBoundingClientRect().top)/(height-76))) : 0;
          card.style.setProperty('--covered',`${covered}`);
        });
      }
    };
    const schedule=()=>{if(!frame) frame=requestAnimationFrame(update)};
    update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
    return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);if(frame) cancelAnimationFrame(frame)};
  },[projects]);
  const words=['brand identities','visual languages','logos that last','digital interfaces','design systems'];
  const identity=projects.filter(p=>p.category==='identity');
  const ux=projects.filter(p=>p.category==='ux');
  return <>
    <header className="nav"><a className="nav-brand" href="#top">Saaf Studio</a><nav aria-label="Sections"><a href="#identity">Identity</a><a href="#brand">Logos</a><a href="#reels">Showreels</a><a href="#uxui">UX/UI</a><a href="#about">About</a><a className="nav-cta" href="#contact">Contact</a><span className="nav-dot" aria-hidden="true"/></nav></header>
    <main>
      <section className="hero" id="top">
        <p className="hero-kicker"><span>Independent Creative Studio</span><span>Brand &amp; Digital Design</span></p>
        <h1 className="hero-title"><span>Saaf</span><span>Studio</span></h1>
        <div className="hero-mac"><img src={asset('/candidatura/img/hero/mac-poster-1440.webp')} alt="A retro computer displaying a collection of design work" /></div>
        <p className="hero-rot">We design <span key={word}>{words[word]}<i>_</i></span></p>
        <p className="hero-lead">Turning curious ideas into distinctive visual identities and digital experiences made to inspire.</p>
        <div className="hero-meta"><span>Independent · Curious · Everywhere</span><a href="#identity">Scroll ↓</a></div>
        <div className="ticker"><div className="ticker-track">{[0,1].map(i=><div className="ticker-set" key={i}><span>Brand Identity</span><span>Art Direction</span><span>Logo Design</span><span>UI Design</span><span>Design Systems</span><span>Visual Identity</span></div>)}</div></div>
      </section>
      <section className="identity" id="identity"><div className="section-head"><h2>Brand identity</h2><p>Complete visual identities, beyond the logo: naming, visual language and applications. Explore a collection of fictional projects imagined by Saaf Studio.</p></div>
        {loading && <p className="state">Loading selected work…</p>}{error && <p className="state">{error}</p>}
        {identity.map((p,index)=><article className={`identity-project ${index%2?'flip':''}`} key={p.id}><div className="project-copy"><p className="status">{p.status}</p><h3>{p.title}</h3><p className="tagline">{p.tagline}</p><p>{p.description}</p><div className="role"><b>Role</b><span>{p.role}</span></div></div><div className="gallery">{p.images.map((img,i)=><figure className={i===4?'wide':''} key={img}><img src={asset(img)} alt={`${p.title} identity application ${i+1}`} loading="lazy" /></figure>)}</div></article>)}
      </section>
      <section className="brand" id="brand"><div className="brand-head"><div className="brand-letters"><img src={asset('/candidatura/img/lettering/logo.svg')} alt="Logo"/><img src={asset('/candidatura/img/lettering/folio.svg')} alt="folio"/></div><p>A handpicked selection of fictional logos and brand marks. <strong>Ideas in progress, made for the joy of creating.</strong> Each project is an exploration of colour, shape and personality.</p></div><div className="logo-rail"><div className="logo-pin"><div className="logo-strip">{identity.map(p=><div className="logo-card" key={p.id}><img src={asset(p.images[0])} alt={`${p.title} logo`} /><strong>{p.title}</strong><span>Brand identity</span></div>)}</div><div className="logo-progress" aria-hidden="true"><i/></div></div></div></section>
      <section className="reels" id="reels"><h2>Showreels</h2><p>A selection of fictional identities, visual stories and digital experiences.</p><div className="reel-grid"><div><div className="reel-frame"><img src="/dummy/identity-b.svg" alt="Fictional visual identity"/></div><b>Brand &amp; visual design</b></div><div><div className="reel-frame"><img src="/dummy/digital.svg" alt="Fictional digital design"/></div><b>Digital experiences</b></div></div></section>
      <section className="ux" id="uxui"><div className="ux-head"><h2>UX/UI</h2><p>Digital products and interfaces, from the first idea to the final detail. A selection of projects made for people.</p></div>{ux.map((p,index)=><article className={`ux-card ${index%2?'reverse':''}`} key={p.id}><div className="ux-copy"><p className="status">{p.status}</p><h3>{p.title}</h3><h4>{p.tagline}</h4><p>{p.description}</p><div className="role"><b>Role</b><span>{p.role}</span></div></div><div className="ux-shots">{p.images.map((img,i)=><figure key={img}><img src={asset(img)} alt={`${p.title} interface ${i+1}`} loading="lazy"/></figure>)}</div></article>)}</section>
      <section className="about" id="about"><h2>About</h2><div className="about-intro"><p className="about-lead">Independent creative studio for brands and digital experiences.</p><div><p>Saaf Studio is a fictional creative practice exploring the space between bold ideas, thoughtful design and everyday experiences.</p><p>We believe in playful curiosity, clear thinking and making things that feel unmistakably human. All project and studio details on this site are sample content.</p></div></div><div className="about-block"><h3>What we do</h3><div className="xp"><div><span>01</span><b>Creative Direction</b><span>Ideas with a point of view</span></div><div><span>02</span><b>Brand Identity</b><span>Distinctive visual worlds</span></div><div><span>03</span><b>Digital Design</b><span>Thoughtful experiences</span></div><div><span>04</span><b>Art &amp; Illustration</b><span>Character in every detail</span></div></div></div><div className="about-split"><div><h3>Approach</h3><p>Curiosity first.<br/>Good ideas, beautifully made.</p></div><div><h3>Skills</h3><div className="skills">{['Art Direction','Brand Strategy','Brand Systems','Visual Identity','Logo Design','Typography','Design Systems','User Interface','Prototyping','Illustration','Collaboration'].map(s=><span key={s}>{s}</span>)}</div></div></div></section>
      <section className="contact" id="contact"><h2>Let’s<br/>work<br/>together</h2><div className="contact-panel"><p className="email">hello@example.com</p><div className="contact-list"><div><span>Studio</span><span>Saaf Studio</span></div><div><span>Location</span><span>Somewhere creative</span></div><div><span>Availability</span><span>Open to ideas</span></div></div><p>Contact details shown are fictional sample content.</p></div></section>
    </main><footer><span>© Saaf Studio</span><a href="#top">Back to top ↑</a></footer>
  </>
}
export default App;
