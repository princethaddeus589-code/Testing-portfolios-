import React, { useMemo, useState } from "react";
import {
  LayoutDashboard, PanelsTopLeft, Sparkles, BrainCircuit, UserRound, Crown, Settings,
  Search, Bell, Plus, ArrowUpRight, ArrowRight, WandSparkles, Globe2,
  Eye, MoreHorizontal, Check, Zap, MessageCircle, Palette, Code2,
  Menu, X, ChevronDown, Send, ShieldCheck, Download, ExternalLink,
  CircleHelp, LockKeyhole, TrendingUp, Copy, CheckCircle2
} from "lucide-react";

const initialTemplates = [
  {id:1,name:"Monochrome Muse",type:"Creative portfolio",style:"Minimal",tone:"mono",tag:"POPULAR",desc:"Bold typography, generous space, editorial energy.",color:"#e8e4de",accent:"#222222",layout:"MONO",uses:"2.4k"},
  {id:2,name:"Studio Bloom",type:"Designer portfolio",style:"Playful",tone:"pink",tag:"NEW",desc:"Warm color, soft shapes and a confident creative voice.",color:"#f7dce2",accent:"#e45e78",layout:"BLOOM",uses:"1.8k"},
  {id:3,name:"Digital Atelier",type:"Developer portfolio",style:"Modern",tone:"blue",tag:"AI READY",desc:"A crisp, technical layout for makers and engineers.",color:"#dbe8ff",accent:"#4263d8",layout:"ATELIER",uses:"3.1k"},
  {id:4,name:"Quiet Luxury",type:"Photographer portfolio",style:"Elegant",tone:"green",tag:"PREMIUM",desc:"Muted tones and refined details for standout work.",color:"#dce5d9",accent:"#3d5b49",layout:"QUIET",uses:"960"},
  {id:5,name:"Next Chapter",type:"Student portfolio",style:"Friendly",tone:"orange",tag:"STARTER",desc:"A simple, polished start for your first personal site.",color:"#f7e4cb",accent:"#bf6e35",layout:"NEXT",uses:"4.2k"},
  {id:6,name:"The Architect",type:"Product portfolio",style:"Structured",tone:"purple",tag:"PRO",desc:"A strong grid for case studies, strategy and results.",color:"#e8e0f7",accent:"#7958b5",layout:"ARCH",uses:"1.2k"}
];

const nav = [
  {label:"Workspace", items:[["Overview",LayoutDashboard],["Templates",PanelsTopLeft],["Website editor",Code2],["AI assistant",BrainCircuit],["My profile",UserRound]]},
  {label:"Manage", items:[["Premium",Crown],["Settings",Settings]]}
];

function App() {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {role:"assistant", text:"Hey! I’m your portfolio co-pilot. Tell me what you do and the kind of impression you want to make. I can help shape your site, write your bio, or suggest a visual direction."}
  ]);
  const [aiBusy, setAiBusy] = useState(false);
  const [profile, setProfile] = useState({name:"Alex Morgan",role:"Digital designer & creative developer",bio:"I turn complex ideas into simple, thoughtful digital experiences.",email:"hello@alexmorgan.design"});
  const [editingProfile, setEditingProfile] = useState(false);
  const [generated, setGenerated] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authName, setAuthName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [editorTemplate, setEditorTemplate] = useState(initialTemplates[0]);
  const [site, setSite] = useState({
    name: "Alex Morgan", role: "Designer & creative developer",
    headline: "Ideas into experiences.", intro: "I create thoughtful digital experiences that bring ambitious ideas to life.",
    about: "I’m a multidisciplinary creative who enjoys turning complex problems into clear, useful and beautiful experiences.",
    email: "hello@example.com", accent: "#b6d63f", background: "#f7f7f3",
    projects: [
      {title:"Brand identity for Forma", category:"Branding · 2026", description:"A fresh visual identity built around clarity and confidence."},
      {title:"Digital experience for Kin", category:"Web design · 2025", description:"A welcoming, responsive website designed around real people."},
      {title:"The everyday objects", category:"Art direction · 2025", description:"An editorial direction celebrating thoughtful product design."}
    ]
  });
  const [editorTab, setEditorTab] = useState("Content");
  const [previewMode, setPreviewMode] = useState("Desktop");

  const filtered = useMemo(() => initialTemplates.filter(t =>
    (filter === "All" || t.style === filter || t.type.includes(filter)) &&
    (t.name + " " + t.type + " " + t.style + " " + t.desc).toLowerCase().includes(search.toLowerCase())
  ), [filter, search]);

  const notify = (msg) => { setToast(msg); window.setTimeout(() => setToast(""), 2600); };
  const go = (label) => { setActive(label); setMobileOpen(false); setMobileNav(false); };

  async function askAI(e) {
    e?.preventDefault();
    if (!prompt.trim() || aiBusy) return;
    const userText = prompt.trim();
    setMessages(m => [...m, {role:"user",text:userText}]);
    setPrompt(""); setAiBusy(true);
    try {
      const response = await fetch("http://localhost:8787/api/assistant", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:userText, history:messages.slice(-8)})
      });
      if (!response.ok) throw new Error("AI service is not connected");
      const data = await response.json();
      setMessages(m => [...m, {role:"assistant",text:data.reply || "I couldn't generate a response. Try again."}]);
    } catch {
      const fallback = `Here’s a useful starting point for “${userText}”:\n\n• Lead with one clear message about what makes your work different.\n• Show 3 strong projects with the challenge, your process and the outcome.\n• Use a restrained palette, readable type and one memorable accent color.\n\nConnect the secure AI server in the README to enable live AI responses.`;
      setMessages(m => [...m, {role:"assistant",text:fallback}]);
    } finally { setAiBusy(false); }
  }

  function generateCopy(kind) {
    const copy = kind === "bio"
      ? `${profile.name} is a ${profile.role.toLowerCase()} who creates thoughtful, human-centered digital experiences. With a focus on clarity, craft and meaningful details, ${profile.name.split(" ")[0]} turns ambitious ideas into work people remember.`
      : `Welcome to my portfolio. I’m ${profile.name}, a ${profile.role.toLowerCase()} focused on building clear, useful and memorable experiences. Explore selected projects, learn about my process, and let’s make something meaningful together.`;
    setGenerated(copy);
    notify("Draft generated — edit it to make it your own.");
  }

  function signIn(e) {
    e.preventDefault();
    if (!email || !password) return;
    if (authMode === "signup" && password !== confirmPassword) {
      notify("Your passwords do not match. Please check and try again.");
      return;
    }
    setSignedIn(true);
    if (authMode === "signup" && authName.trim()) {
      setProfile({ ...profile, name: authName.trim(), email: email.trim() });
      setSite({ ...site, name: authName.trim(), email: email.trim() });
    }
    setShowSignIn(false);
    notify(authMode === "signup" ? "Sign-up preview complete. Connect your backend to create a real account." : "Sign-in preview complete. Connect your backend for real authentication.");
  }

  function downloadPortfolio() {
    const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const projects = site.projects.map((p,i)=>`<article class="project"><div class="project-art art-${i%3}"><span>0${i+1}</span><span>↗</span></div><small>${esc(p.category)}</small><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></article>`).join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(site.intro)}"><title>${esc(site.name)} — Portfolio</title><style>*{box-sizing:border-box}body{margin:0;background:${site.background};color:#24251f;font-family:Arial,Helvetica,sans-serif}a{color:inherit}.wrap{max-width:1120px;margin:auto;padding:0 6%}.nav{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #0002;font-size:12px}.brand{font-weight:800;font-size:19px}.brand i{color:${site.accent}}.nav-links{font-size:10px;letter-spacing:1px}.hero{position:relative;overflow:hidden;min-height:470px;padding:90px 0 70px;border-bottom:1px solid #0002}.kicker,small,.section-label{font-size:10px;letter-spacing:1.4px;text-transform:uppercase}.hero h1{font-size:clamp(48px,9vw,105px);letter-spacing:-.075em;line-height:.95;max-width:780px;margin:25px 0;position:relative;z-index:1}.hero p{max-width:470px;font-size:16px;line-height:1.8;color:#686960;position:relative;z-index:1}.cta{display:inline-flex;gap:12px;align-items:center;margin-top:20px;background:#24251f;color:white;text-decoration:none;padding:15px 20px;font-size:11px;letter-spacing:1px}.orb{position:absolute;width:240px;height:240px;border-radius:50%;background:${site.accent};right:0;bottom:25px;opacity:.72}.work{padding:60px 0}.section-head{display:flex;justify-content:space-between;font-size:10px;letter-spacing:1px;margin-bottom:30px}.projects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:35px 22px}.project-art{height:220px;display:flex;justify-content:space-between;padding:15px;background:#e5e5dc;color:#252620;font-size:13px}.art-1{background:#dfe8d6}.art-2{background:#e8dce8}.project small{display:block;margin-top:17px;color:#73746b}.project h2{font-size:23px;letter-spacing:-.7px;margin:9px 0}.project p{font-size:13px;line-height:1.7;color:#73746b}.about{padding:65px 0;border-top:1px solid #0002;display:grid;grid-template-columns:1fr 2fr;gap:25px}.about p{font-size:clamp(22px,3vw,36px);letter-spacing:-1px;line-height:1.3;margin:0}.footer{padding:24px 0;border-top:1px solid #0002;display:flex;justify-content:space-between;gap:12px;font-size:11px}.footer a{color:inherit}@media(max-width:600px){.nav{height:62px}.nav-links{font-size:8px}.hero{padding:65px 0 50px;min-height:400px}.orb{width:120px;height:120px;right:-25px;bottom:15px}.projects{grid-template-columns:1fr}.project-art{height:190px}.about{grid-template-columns:1fr;gap:20px}.footer{flex-wrap:wrap}.wrap{padding:0 5%}}</style></head><body><div class="wrap"><nav class="nav"><div class="brand">${esc(site.name)}<i>.</i></div><div class="nav-links">ABOUT &nbsp;&nbsp; WORK &nbsp;&nbsp; CONTACT</div></nav><header class="hero"><div class="kicker">${esc(site.role)} / PORTFOLIO</div><h1>${esc(site.headline)}</h1><p>${esc(site.intro)}</p><a class="cta" href="mailto:${esc(site.email)}">LET’S TALK ↗</a><div class="orb"></div></header><section class="work"><div class="section-head"><span>01 / SELECTED WORK</span><span>© 2026</span></div><div class="projects">${projects}</div></section><section class="about"><div class="section-label">02 / A LITTLE ABOUT ME</div><p>${esc(site.about)}</p></section><footer class="footer"><b>${esc(site.name)}</b><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><span>MADE WITH INTENTION ↗</span></footer></div></body></html>`;
    const blob = new Blob([html], {type:"text/html;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${(site.name||"my-portfolio").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "my-portfolio"}.html`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    notify("Your portfolio HTML has been downloaded.");
  }

  if (window.location.pathname.startsWith("/admin")) return <AdminDashboardPage />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><span>p</span></div><span className="brand-name">portfolia<span className="brand-dot">.</span></span>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar">A</div><div className="workspace-copy"><strong>Alex’s workspace</strong><span>Free plan</span></div><ChevronDown size={15}/>
        </div>
        {nav.map(group => <div className="nav-group" key={group.label}>
          <p className="nav-label">{group.label}</p>
          {group.items.map(([label, Icon]) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => go(label)}>
            <Icon size={18} strokeWidth={1.8}/><span>{label}</span>
            {label === "AI assistant" && <span className="nav-new">AI</span>}
            {label === "Premium" && <span className="nav-lock"><LockKeyhole size={12}/></span>}
          </button>)}
        </div>)}
        <div className="sidebar-spacer"/>
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Make it unforgettable.</strong><p>Unlock premium templates and smarter AI tools.</p><button onClick={() => go("Premium")}>Explore Pro <ArrowUpRight size={14}/></button></div>
        <div className="sidebar-footer"><div className="avatar-small">AM</div><div className="footer-user"><strong>{profile.name}</strong><span>{signedIn ? "Signed in · Demo" : "Local preview"}</span></div><button className="icon-button" onClick={() => go("Settings")} aria-label="Settings"><Settings size={17}/></button></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{active}</strong></div>
          <div className="top-actions"><div className="status-pill"><span className="status-dot"/> All changes saved</div><button className="button button-outline auth-top-button" onClick={() => {setAuthMode("signin");setShowSignIn(true);}}>Sign in</button><button className="button button-dark auth-top-button" onClick={() => {setAuthMode("signup");setShowSignIn(true);}}>Sign up</button><button className="icon-button notification" onClick={() => notify("You’re all caught up.")} aria-label="Notifications"><Bell size={18}/><i/></button><button className="top-avatar" onClick={() => go("My profile")}>AM</button></div>
        </header>

        <div className="page-content">
          {active === "Overview" && <>
            <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR CREATIVE SPACE</div><h1>Make your work<br className="desktop-break"/> <em>impossible to ignore.</em></h1><p className="welcome-sub">Everything you need to create a portfolio that feels like you.</p></div><button className="button button-dark" onClick={() => {setActive("Templates");setSelected(initialTemplates[0]);}}><Plus size={17}/> Create a portfolio</button></section>
            <section className="hero-banner">
              <div className="hero-copy"><span className="mini-pill"><Sparkles size={12}/> YOUR NEXT CHAPTER STARTS HERE</span><h2>Your talent deserves<br/>a better <em>stage.</em></h2><p>Choose a template, make it yours, and publish a portfolio you’re proud to share.</p><button className="button button-light" onClick={() => go("Templates")}>Explore templates <ArrowRight size={16}/></button></div>
              <div className="hero-art" aria-label="Portfolio website preview">
                <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
                <div className="floating-card floating-tag"><span className="tag-star">✳</span> DESIGN WITH INTENTION</div>
                <div className="mock-window"><div className="mock-top"><span/><span/><span/><small>alexmorgan.design</small><ArrowUpRight size={12}/></div><div className="mock-page"><div className="mock-nav"><b>AM.</b><span>WORK&nbsp;&nbsp;&nbsp; ABOUT&nbsp;&nbsp;&nbsp; CONTACT</span></div><div className="mock-hero"><small>DESIGNER · DEVELOPER</small><strong>Ideas into<br/><i>experiences.</i></strong><div className="mock-shape"><div className="shape-inner">AM</div></div></div><div className="mock-bottom"><span>SELECTED WORK — 2024/26</span><ArrowUpRight size={12}/></div></div></div>
                <div className="floating-card floating-note"><span className="note-icon"><Check size={13}/></span><span><b>Looking good!</b><small>Portfolio ready to share</small></span></div>
                <div className="hero-sticker">MAKE<br/>SOME<br/><em>THING.</em></div>
              </div>
              <div className="hero-index">01 <span/> 03</div>
            </section>
            <section className="stats-grid">
              <Stat icon={PanelsTopLeft} label="Templates to explore" value="24+" note="Curated for every creative" />
              <Stat icon={Sparkles} label="AI creative tools" value="06" note="From bio to case study" />
              <Stat icon={Globe2} label="Your online presence" value="1 place" note="Projects, profile and links" />
            </section>
            <section className="section-heading"><div><div className="eyebrow">A GOOD PLACE TO START</div><h2>Made for your kind of work.</h2></div><button className="text-button" onClick={() => go("Templates")}>Browse all templates <ArrowRight size={15}/></button></section>
            <div className="template-grid home-templates">{initialTemplates.slice(0,3).map(t => <TemplateCard key={t.id} item={t} onClick={() => {setSelected(t);go("Templates");}}/>)}</div>
            <section className="ai-strip"><div className="ai-strip-icon"><WandSparkles size={23}/></div><div><span className="eyebrow">MEET YOUR CREATIVE CO-PILOT</span><h3>Big idea? Start with a conversation.</h3><p>Generate a personal bio, sharpen your project story, or get a design direction in seconds.</p></div><button className="button button-dark" onClick={() => go("AI assistant")}>Try AI assistant <ArrowUpRight size={16}/></button></section>
            <LongHomeSections onNavigate={go} />
          </>}

          {active === "Templates" && <><PageIntro eyebrow="THE TEMPLATE LIBRARY" title={<>A good first impression<br/><em>starts here.</em></>} desc="Pick a starting point. Every layout is designed to put your work first." action={<button className="button button-dark" onClick={() => notify("Template request saved.")}><Plus size={16}/> Request a template</button>}/><div className="template-controls"><div className="search-field"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search templates, styles..." /></div><div className="filter-tabs">{["All","Minimal","Playful","Modern","Elegant"].map(f=><button key={f} className={filter===f?"selected":""} onClick={()=>setFilter(f)}>{f}</button>)}</div></div><div className="template-grid library-grid">{filtered.map(t=><TemplateCard key={t.id} item={t} onClick={()=>setSelected(t)}/>)}</div>{filtered.length===0&&<div className="empty-state">No templates match that search. Try another style.</div>}</>}

          {active === "Website editor" && <>
            <PageIntro eyebrow="YOUR WEBSITE BUILDER" title={<>Make it yours.<br/><em>See it come alive.</em></>} desc="Edit your content, personalize the style and export a real standalone portfolio website." action={<button className="button button-dark" onClick={downloadPortfolio}><Download size={16}/> Export website</button>}/>
            <div className="editor-toolbar">
              <div className="editor-template-label"><span className="editor-live-dot"/><div><b>{editorTemplate?.name || "My portfolio"}</b><small>All edits update the preview instantly</small></div></div>
              <div className="preview-switch"><button className={previewMode==="Desktop"?"on":""} onClick={()=>setPreviewMode("Desktop")}><PanelsTopLeft size={14}/> Desktop</button><button className={previewMode==="Mobile"?"on":""} onClick={()=>setPreviewMode("Mobile")}><SmartphoneIcon/> Mobile</button></div>
            </div>
            <div className="website-editor">
              <aside className="editor-controls">
                <div className="editor-tabs">{["Content","Projects","Style"].map(t=><button key={t} className={editorTab===t?"active":""} onClick={()=>setEditorTab(t)}>{t}</button>)}</div>
                {editorTab==="Content"&&<div className="editor-fields">
                  <span className="eyebrow">INTRODUCTION</span>
                  <label>Your name<input value={site.name} onChange={e=>setSite({...site,name:e.target.value})}/></label>
                  <label>Professional title<input value={site.role} onChange={e=>setSite({...site,role:e.target.value})}/></label>
                  <label>Hero headline<textarea rows={2} value={site.headline} onChange={e=>setSite({...site,headline:e.target.value})}/></label>
                  <label>Short introduction<textarea rows={3} value={site.intro} onChange={e=>setSite({...site,intro:e.target.value})}/></label>
                  <span className="eyebrow editor-section-label">ABOUT YOU</span>
                  <label>About section<textarea rows={4} value={site.about} onChange={e=>setSite({...site,about:e.target.value})}/></label>
                  <label>Contact email<input type="email" value={site.email} onChange={e=>setSite({...site,email:e.target.value})}/></label>
                </div>}
                {editorTab==="Projects"&&<div className="editor-fields">
                  <span className="eyebrow">SELECTED WORK</span>
                  <p className="editor-help">Add up to six projects. Keep titles and descriptions clear so visitors understand your contribution.</p>
                  {site.projects.map((project,i)=><div className="project-edit-card" key={i}><div className="project-edit-head"><b>Project {String(i+1).padStart(2,"0")}</b><button className="icon-button" aria-label="Remove project" onClick={()=>setSite({...site,projects:site.projects.filter((_,j)=>j!==i)})}><X size={15}/></button></div><label>Project title<input value={project.title} onChange={e=>setSite({...site,projects:site.projects.map((p,j)=>j===i?{...p,title:e.target.value}:p)})}/></label><label>Category / year<input value={project.category} onChange={e=>setSite({...site,projects:site.projects.map((p,j)=>j===i?{...p,category:e.target.value}:p)})}/></label><label>Description<textarea rows={2} value={project.description} onChange={e=>setSite({...site,projects:site.projects.map((p,j)=>j===i?{...p,description:e.target.value}:p)})}/></label></div>)}
                  {site.projects.length<6&&<button className="button button-outline full-button" onClick={()=>setSite({...site,projects:[...site.projects,{title:"New project",category:"Project type · 2026",description:"Describe the challenge, your role and the result."}]})}><Plus size={15}/> Add project</button>}
                </div>}
                {editorTab==="Style"&&<div className="editor-fields">
                  <span className="eyebrow">VISUAL IDENTITY</span>
                  <label>Accent color<div className="color-picker-row"><input aria-label="Accent color" type="color" value={site.accent} onChange={e=>setSite({...site,accent:e.target.value})}/><code>{site.accent.toUpperCase()}</code><button className="text-button" onClick={()=>setSite({...site,accent:editorTemplate?.accent||"#b6d63f"})}>Reset</button></div></label>
                  <label>Page background<div className="color-picker-row"><input aria-label="Background color" type="color" value={site.background} onChange={e=>setSite({...site,background:e.target.value})}/><code>{site.background.toUpperCase()}</code></div></label>
                  <span className="eyebrow editor-section-label">QUICK PALETTES</span>
                  <div className="palette-grid">{[["#b6d63f","#f7f7f3"],["#4263d8","#f2f5ff"],["#e45e78","#fff5f6"],["#3d5b49","#f0f4ef"],["#bf6e35","#fff6ec"],["#7958b5","#f7f3ff"]].map(([a,b])=><button key={a} className="palette-option" onClick={()=>setSite({...site,accent:a,background:b})}><i style={{background:a}}/><i style={{background:b}}/><span>{a.toUpperCase()}</span></button>)}</div>
                  <p className="editor-help">Try to keep strong contrast between text and background for accessibility.</p>
                </div>}
                <div className="editor-control-footer"><button className="button button-dark full-button" onClick={downloadPortfolio}><Download size={15}/> Export my website</button><button className="text-button" onClick={()=>{setSite({...site,name:"Alex Morgan",role:"Designer & creative developer",headline:"Ideas into experiences.",intro:"I create thoughtful digital experiences that bring ambitious ideas to life.",about:"I’m a multidisciplinary creative who enjoys turning complex problems into clear, useful and beautiful experiences.",email:"hello@example.com",accent:editorTemplate?.accent||"#b6d63f",background:"#f7f7f3",projects:[{title:"Brand identity for Forma",category:"Branding · 2026",description:"A fresh visual identity built around clarity and confidence."},{title:"Digital experience for Kin",category:"Web design · 2025",description:"A welcoming, responsive website designed around real people."},{title:"The everyday objects",category:"Art direction · 2025",description:"An editorial direction celebrating thoughtful product design."}]});notify("Starter content restored.");}}>Reset to starter content</button></div>
              </aside>
              <div className="live-preview-stage"><div className="preview-stage-top"><span><Eye size={14}/> LIVE PREVIEW</span><span>{previewMode==="Desktop"?"Responsive desktop":"Mobile preview"}</span></div><div className={`live-site-frame ${previewMode==="Mobile"?"mobile-preview":""}`} style={{"--site-accent":site.accent,"--site-bg":site.background}}><div className="live-site-nav"><b>{site.name||"Your Name"}<i>.</i></b><span>ABOUT&nbsp;&nbsp;&nbsp; WORK&nbsp;&nbsp;&nbsp; CONTACT</span></div><section className="live-site-hero"><span className="live-site-kicker">{(site.role||"CREATIVE").toUpperCase()} / PORTFOLIO</span><h2>{site.headline||"Your headline goes here."}</h2><p>{site.intro}</p><a href={`mailto:${site.email}`} onClick={e=>e.preventDefault()}>LET’S TALK <ArrowUpRight size={13}/></a><div className="live-hero-shape"><span>{(site.name||"Y").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span></div></section><section className="live-site-work"><div className="live-section-heading"><span>01 / SELECTED WORK</span><span>© 2026</span></div><div className="live-project-grid">{site.projects.map((project,i)=><article className="live-project" key={i}><div className={`live-project-art art-${i%3}`}><span>0{i+1}</span><ArrowUpRight size={16}/></div><small>{project.category}</small><h3>{project.title}</h3><p>{project.description}</p></article>)}</div></section><section className="live-site-about"><span>02 / A LITTLE ABOUT ME</span><p>{site.about}</p></section><footer className="live-site-footer"><b>{site.name||"Your Name"}<i>.</i></b><a href={`mailto:${site.email}`} onClick={e=>e.preventDefault()}>{site.email}</a><span>MADE WITH INTENTION ↗</span></footer></div><div className="preview-hint"><CheckCircle2 size={14}/> Your changes appear here as you type.</div></div>
            </div>
          </>}

          {active === "AI assistant" && <><PageIntro eyebrow="YOUR CREATIVE CO-PILOT" title={<>Think it. Shape it.<br/><em>Make it real.</em></>} desc="A practical assistant for your portfolio, personal brand and creative process."/><div className="ai-workspace"><div className="ai-intro-card"><div className="ai-orb"><BrainCircuit size={27} strokeWidth={1.8}/></div><h3>What are we making today?</h3><p>Ask for a bio, project descriptions, a color palette, site structure, or feedback on your portfolio idea.</p><div className="suggestion-chips">{["Write my portfolio bio","Suggest a color palette","Improve my project case study","Plan my homepage"].map(s=><button key={s} onClick={()=>setPrompt(s)}><WandSparkles size={13}/>{s}</button>)}</div><div className="ai-note"><ShieldCheck size={15}/> Live AI works when you connect your server and API key.</div></div><div className="chat-panel"><div className="chat-head"><div className="chat-head-icon"><BrainCircuit size={18} strokeWidth={1.8}/></div><div><strong>Portfolia AI</strong><span><i/> Portfolio specialist</span></div><span className="chat-model">AI CO-PILOT</span></div><div className="chat-messages">{messages.map((m,i)=><div key={i} className={`chat-message ${m.role}`}><div className="message-avatar">{m.role==="assistant"?<BrainCircuit size={15}/>: "AM"}</div><div className="message-content"><span>{m.role==="assistant"?"Portfolia AI":"You"}</span><p>{m.text}</p></div></div>)}{aiBusy&&<div className="typing"><span/><span/><span/> Thinking through your idea...</div>}</div><form className="chat-compose" onSubmit={askAI}><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Tell me what you want to create..." rows={2}/><div className="compose-bottom"><span><Sparkles size={13}/> Clear ideas, better portfolios.</span><button type="submit" disabled={aiBusy||!prompt.trim()}><Send size={16}/> Send</button></div></form></div></div><div className="ai-features">{[[WandSparkles,"Brand voice","Write in a tone that sounds like you."],[Code2,"Website structure","Turn an idea into a clear page plan."],[Palette,"Creative direction","Explore palettes, type and visual style."]].map(([I,t,d])=><div className="ai-feature" key={t}><I size={19}/><strong>{t}</strong><p>{d}</p></div>)}</div></>}

          {active === "My profile" && <><PageIntro eyebrow="YOUR PERSONAL BRAND" title={<>A little more <em>you.</em></>} desc="Keep your details polished and ready to use across your portfolio." action={<button className="button button-dark" onClick={()=>setEditingProfile(v=>!v)}>{editingProfile?"Cancel":"Edit profile"}</button>}/><div className="profile-layout"><div className="profile-card"><div className="profile-cover"><div className="cover-sun"/><span>CREATIVE / 2026</span></div><div className="profile-body"><div className="profile-avatar">AM</div><div className="profile-title"><div><h2>{profile.name}</h2><p>{profile.role}</p></div><span className="profile-badge"><CheckCircle2 size={13}/> PROFILE</span></div><p className="profile-bio">{profile.bio}</p><div className="profile-contact"><Globe2 size={15}/>{profile.email}</div><div className="profile-completion"><div><span>Profile completeness</span><b>80%</b></div><div className="progress"><span/></div><small>Add a project and social link to finish your profile.</small></div></div></div><div className="profile-edit-panel"><span className="eyebrow">PROFILE DETAILS</span><h3>Your story, your way.</h3>{editingProfile?<div className="edit-fields"><label>Display name<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></label><label>Professional title<input value={profile.role} onChange={e=>setProfile({...profile,role:e.target.value})}/></label><label>Short bio<textarea value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})}/></label><label>Contact email<input value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></label><button className="button button-dark" onClick={()=>{setEditingProfile(false);notify("Profile updated.");}}>Save changes <Check size={15}/></button></div>:<><p>These details help your visitors understand who you are and what you bring to the table.</p><div className="profile-tip"><Sparkles size={17}/><div><b>Try an AI-written bio</b><p>Get a first draft, then make it sound unmistakably like you.</p><button className="text-button" onClick={()=>generateCopy("bio")}>Generate bio <ArrowRight size={14}/></button></div></div>{generated&&<div className="generated-copy"><p>{generated}</p><button className="text-button" onClick={()=>{navigator.clipboard?.writeText(generated);notify("Bio copied if clipboard access is available.");}}><Copy size={14}/> Copy draft</button></div>}</>}</div></div></>}

          {active === "Premium" && <><PageIntro eyebrow="PORTFOLIA PRO" title={<>Your best work.<br/><em>Without limits.</em></>} desc="A premium toolkit for creatives ready to make their next move."/><div className="premium-hero"><div className="premium-visual"><div className="premium-big-star">✳</div><div className="premium-card-preview"><span>PORTFOLIA / PRO</span><strong>More room<br/>to <em>stand out.</em></strong><div className="premium-lines"/><div className="premium-orb"/></div></div><div className="premium-content"><span className="mini-pill dark-pill"><Crown size={13}/> THE CREATOR PLAN</span><h2>Make more than<br/>a good impression.</h2><p>Everything you need to turn a personal portfolio into a powerful professional presence.</p><div className="price-line"><strong>₦4,500</strong><span>/ month · example price</span></div><ul>{["Premium portfolio templates","Expanded AI writing and idea tools","Custom domain connection guide","More project and case-study layouts","Priority creative resources"].map(x=><li key={x}><Check size={15}/>{x}</li>)}</ul><button className="button button-dark" onClick={()=>notify("Premium checkout is a demo. Connect a payment provider before launch.")}>Get Portfolia Pro <ArrowRight size={16}/></button><small>No payment is collected in this prototype.</small></div></div><div className="premium-footnote"><ShieldCheck size={16}/> Secure payments and subscription management should be connected before production.</div></>}

          {active === "Admin dashboard" && <><PageIntro eyebrow="ADMINISTRATION" title={<>The bigger<br/><em>picture.</em></>} desc="Manage accounts, check published websites, review paid plans and keep Portfolia running smoothly." action={<span className="settings-status"><ShieldCheck size={14}/> Demo admin view</span>}/><div className="admin-warning"><ShieldCheck size={17}/><span><b>Prototype only.</b> This dashboard uses sample data and is not protected by real admin authentication. Never expose admin tools without server-verified role permissions.</span></div><div className="admin-stats"><Stat icon={UserRound} label="People with accounts" value="1,284" note="+12.8% this month" /><Stat icon={PanelsTopLeft} label="Portfolio templates" value="24" note="6 featured collections" /><Stat icon={TrendingUp} label="Websites published" value="846" note="65.8% publish rate" /><Stat icon={Zap} label="AI tools used today" value="392" note="Usage sample only" /></div><div className="admin-columns"><section className="admin-table-card"><div className="admin-card-heading"><div><span className="eyebrow">MANAGE PEOPLE</span><h3>Recent accounts</h3></div><button className="text-button" onClick={()=>notify("Connect a database to view all members.")}>View all <ArrowRight size={14}/></button></div><div className="admin-table"><div className="admin-table-row admin-table-header"><span>MEMBER</span><span>PLAN</span><span>STATUS</span></div>{[["Jordan Lee","Pro","Active","JL"],["Amara Okafor","Free","Active","AO"],["Sam Rivera","Pro","Active","SR"],["Nina Patel","Free","Pending","NP"]].map((u,i)=><div className="admin-table-row" key={u[0]}><span className="admin-member"><i>{u[3]}</i><b>{u[0]}</b></span><span>{u[1]}</span><span><em className={u[2]==="Active"?"member-active":"member-pending"}>{u[2]}</em></span></div>)}</div></section><section className="admin-tools-card"><span className="eyebrow">QUICK ACTIONS</span><h3>Keep things running.</h3>{[[PanelsTopLeft,"Manage templates","Feature or update template listings"],[Crown,"Manage paid plans","View plans and billing status"],[MessageCircle,"Help requests","Respond to member questions"],[Settings,"Website settings","Manage site-wide preferences"]].map(([I,title,desc])=><button className="admin-action" key={title} onClick={()=>notify(`${title}: connect this action to your backend.`)}><span><I size={16}/></span><div><b>{title}</b><small>{desc}</small></div><ArrowUpRight size={14}/></button>)}</section></div></>}

          {active === "Settings" && <><PageIntro eyebrow="PREFERENCES" title={<>Make it work<br/><em>your way.</em></>} desc="Manage your workspace and preview preferences."/><div className="settings-panel"><div className="settings-row"><div><strong>Workspace name</strong><p>How your creative space appears in the dashboard.</p></div><input defaultValue="Alex’s workspace"/></div><div className="settings-row"><div><strong>Interface theme</strong><p>Portfolia’s default light studio appearance.</p></div><span className="theme-preview"><i/> Soft white <Check size={14}/></span></div><div className="settings-row"><div><strong>AI assistance</strong><p>Enable the AI co-pilot after setting up a secure API server.</p></div><span className="settings-status">Setup required</span></div><div className="settings-row"><div><strong>Account access</strong><p>{signedIn?"Demo session active.":"You’re exploring in preview mode."}</p></div><button className="button button-outline" onClick={()=>setShowSignIn(true)}>{signedIn?"Switch demo account":"Sign in / create account"}</button></div></div></>}

          {!["Overview","Templates","Website editor","AI assistant","My profile","Premium","Admin dashboard","Settings"].includes(active) && <PageIntro eyebrow="PORTFOLIA" title={<>Your creative space.</>} desc="Choose a section from the navigation to get started."/>}
          <footer className="page-footer"><span>© 2026 Portfolia Studio</span><span>Designed for people with ideas <span className="footer-heart">✳</span></span><div><button onClick={()=>notify("Help center content can be added here.")}><CircleHelp size={14}/> Help</button><button onClick={()=>notify("Privacy policy page needs to be added before launch.")}>Privacy</button></div></footer>
        </div>
      </main>

      {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="template-modal" onClick={e=>e.stopPropagation()}><button className="modal-close icon-button" onClick={()=>setSelected(null)}><X size={18}/></button><TemplatePreview item={selected}/><div className="modal-info"><span className="eyebrow">{selected.tag} · {selected.style.toUpperCase()}</span><h2>{selected.name}</h2><p>{selected.desc}</p><div className="modal-meta"><span><Eye size={14}/> {selected.uses} uses</span><span><CheckCircle2 size={14}/> Responsive layout</span></div><button className="button button-dark full-button" onClick={()=>{setEditorTemplate(selected);setSite({...site,accent:selected.accent,background:selected.tone==="mono"?"#f7f7f3":selected.color});setSelected(null);setEditorTab("Content");go("Website editor");notify(`${selected.name} opened in the website editor.`);}}>Use this template <ArrowRight size={16}/></button></div></div></div>}

      {showSignIn&&<div className="modal-backdrop" onClick={()=>setShowSignIn(false)}><form className="signin-modal" onSubmit={signIn} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close icon-button" onClick={()=>setShowSignIn(false)} aria-label="Close sign in"><X size={18}/></button><div className="brand-mark signin-mark"><span>p</span></div><span className="eyebrow">{authMode === "signup" ? "CREATE YOUR FREE ACCOUNT" : "WELCOME BACK TO PORTFOLIA"}</span><h2>{authMode === "signup" ? <>Your story.<br/><em>Your space.</em></> : <>Your next chapter<br/><em>starts here.</em></>}</h2><p>{authMode === "signup" ? "Create an account to get ready to build and personalize your portfolio." : "Sign in to continue building your personal portfolio."}</p>{authMode === "signup"&&<label>Full name<input type="text" autoComplete="name" value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Your full name" required/></label>}<label>Email address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><label>Password<input type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8}/></label>{authMode === "signup"&&<label>Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Enter your password again" required minLength={8}/></label>}<button className="button button-dark full-button" type="submit">{authMode === "signup" ? "Create account" : "Sign in"} <ArrowRight size={16}/></button><div className="auth-switch">{authMode === "signup" ? "Already have an account?" : "New to Portfolia?"}<button type="button" onClick={()=>{setAuthMode(authMode === "signup" ? "signin" : "signup");setConfirmPassword("");}}>{authMode === "signup" ? "Sign in" : "Create an account"}</button></div><small>Frontend preview only · Connect your backend to enable secure accounts.</small></form></div>}

      <BottomNavigation active={active} onNavigate={go} />
      {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}


function BottomNavigation({active,onNavigate}) { const tabs=[{label:"Home",page:"Overview",icon:"⌂"},{label:"Templates",page:"Templates",icon:"▦"},{label:"AI Assistant",page:"AI assistant",icon:"✳"},{label:"Premium",page:"Premium",icon:"♛"}]; return <nav className="bottom-tabbar" aria-label="Main navigation">{tabs.map(t=><button key={t.page} type="button" className={active===t.page?"bottom-tab active":"bottom-tab"} onClick={()=>onNavigate(t.page)}><span className="bottom-tab-icon">{t.icon}</span><span>{t.label}</span>{active===t.page&&<i className="tab-indicator"/>}</button>)}</nav>; }
function LongHomeSections({onNavigate}) { const features=[["01","Choose your design","Browse professional templates for designers, developers, students and creatives.","Browse templates","Templates"],["02","Create with AI","Get help writing your biography, describing projects and improving your portfolio.","Open AI assistant","AI assistant"],["03","Make it yours","Personalize your content, showcase your best work and prepare your website for publishing.","Open website editor","Website editor"]]; const faqs=[["What is Portfolia?","Portfolia helps you create a professional personal portfolio website without building everything from scratch."],["Do I need to know how to code?","No. Select a template, edit your content and customize your design through a simple interface."],["Can AI help write my portfolio?","Once connected to an AI service, it can help draft your bio, project descriptions and professional introduction."],["Can I publish my portfolio online?","The editor can export HTML. Online publishing and custom portfolio links will be connected later."]]; return <div className="long-home"><section className="welcome-banner"><span className="home-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Your work deserves<br/><em>a beautiful home.</em></h2><p>Build your portfolio, show off your skills and turn your ideas into a website you are proud to share.</p><button className="home-primary-button" onClick={()=>onNavigate("Templates")}>Start creating <span>↗</span></button><div className="welcome-decoration">P.</div></section><section className="home-section"><div className="home-section-heading"><div><span className="home-eyebrow">A SIMPLE PROCESS</span><h2>From idea to online.</h2></div><span className="home-count">01 — 03</span></div><div className="home-feature-grid">{features.map(f=><article className="home-feature-card" key={f[0]}><span className="home-feature-number">{f[0]}</span><h3>{f[1]}</h3><p>{f[2]}</p><button onClick={()=>onNavigate(f[4])}>{f[3]} <span>→</span></button></article>)}</div></section><section className="home-ai-banner"><div className="home-ai-symbol">✳</div><span className="home-eyebrow">YOUR CREATIVE PARTNER</span><h2>Meet your AI assistant.</h2><p>Stuck on what to write? Get help with your bio, project descriptions, portfolio structure and creative direction.</p><button className="home-primary-button" onClick={()=>onNavigate("AI assistant")}>Explore AI tools <span>↗</span></button></section><section className="home-section"><div className="home-section-heading"><div><span className="home-eyebrow">BUILT FOR YOUR AMBITION</span><h2>Make more room to grow.</h2></div></div><div className="home-premium-card"><div><span className="home-premium-label">PORTFOLIA PRO</span><h3>Take your portfolio further.</h3><p>Explore premium design options and additional creative tools as your portfolio grows.</p></div><button onClick={()=>onNavigate("Premium")}>Explore plans ↗</button></div></section><section className="home-section home-faq"><span className="home-eyebrow">GOT QUESTIONS?</span><h2>Good to know.</h2>{faqs.map(f=><details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</section><footer className="long-home-footer"><div><strong>portfolia<span>.</span></strong><p>Your ideas. Your work. Your space.</p></div><span>Made for the next generation of creatives.</span></footer></div>; }

function SmartphoneIcon(){return <span style={{fontSize:13,lineHeight:1}}>▯</span>;}
function Stat({icon:Icon,label,value,note}) {return <div className="stat-card"><div className="stat-top"><span className="stat-icon"><Icon size={17}/></span><ArrowUpRight size={15} className="stat-arrow"/></div><div className="stat-value">{value}</div><strong>{label}</strong><p>{note}</p></div>;}
function PageIntro({eyebrow,title,desc,action}) {return <section className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action&&<div className="intro-action">{action}</div>}</section>;}
function TemplateCard({item,onClick}) {return <button className="template-card" onClick={onClick}><TemplatePreview item={item}/><div className="template-card-info"><div><h3>{item.name}</h3><p>{item.type}</p></div><span className="template-open"><ArrowUpRight size={16}/></span></div><div className="template-card-foot"><span className="template-tag">{item.tag}</span><span>{item.uses} uses</span></div></button>;}
function TemplatePreview({item}) {return <div className={`template-preview tone-${item.tone}`} style={{"--preview-bg":item.color,"--preview-accent":item.accent}}><div className="preview-nav"><b>{item.layout}.</b><span>ABOUT&nbsp;&nbsp; WORK&nbsp;&nbsp; CONTACT</span><MoreHorizontal size={15}/></div><div className="preview-content"><span className="preview-kicker">SELECTED WORK / 2026</span><strong>{item.tone==="pink"?"A little more":item.tone==="blue"?"Build beyond":item.tone==="green"?"Made with":item.tone==="orange"?"Hello, I'm":item.tone==="purple"?"Shape the":"Ideas into"}</strong><em>{item.tone==="pink"?"wonderful.":item.tone==="blue"?"ordinary.":item.tone==="green"?"intention.":item.tone==="orange"?"your next.":item.tone==="purple"?"the future.":"experiences."}</em><div className="preview-decoration"><div/><div/><div/></div></div><div className="preview-footer"><span>{item.type.toUpperCase()}</span><span>↗</span></div></div>;}


function AdminDashboardPage(){
  const [section,setSection]=useState("Overview");
  const items=[{label:"Overview",icon:LayoutDashboard},{label:"People",icon:UserRound},{label:"Websites",icon:Globe2},{label:"Plans & billing",icon:Crown},{label:"Support",icon:MessageCircle},{label:"Settings",icon:Settings}];
  return <div className="admin-standalone">
    <aside className="admin-side"><a className="admin-brand" href="/">portfolia<span>.</span></a><p className="admin-side-caption">ADMIN AREA</p>{items.map(item=><button key={item.label} className={section===item.label?"admin-side-link selected":"admin-side-link"} onClick={()=>setSection(item.label)}><item.icon size={17}/>{item.label}</button>)}<a className="admin-back-link" href="/">← Back to portfolio builder</a></aside>
    <main className="admin-main"><div className="admin-topline"><span>Administration / {section}</span><span className="admin-connection"><i/> Backend not connected</span></div><header className="admin-page-heading"><div><p className="admin-kicker">PORTFOLIA CONTROL CENTRE</p><h1>{section==="Overview"?"Admin dashboard":section}</h1><p>Manage the platform from one clear place. Real account data will appear after you connect your backend.</p></div><a href="/" className="admin-return-button">Open website ↗</a></header>
    <div className="admin-connect-note"><ShieldCheck size={20}/><div><b>Ready for your backend</b><p>This is a separate admin interface, not a demo account. No fake users, payments or statistics are shown. Connect your API and protect this route with server-verified admin permissions before launch.</p></div></div>
    {section==="Overview"?<><div className="admin-empty-stats">{[[UserRound,"Registered users"],[Globe2,"Published websites"],[Zap,"AI requests"],[Crown,"Active plans"]].map(([Icon,label])=><article className="admin-empty-stat" key={label}><span><Icon size={18}/></span><p>{label}</p><strong>—</strong><small>Waiting for backend data</small></article>)}</div><section className="admin-empty-panel"><div><span className="admin-kicker">GET STARTED</span><h2>Your admin workspace is ready.</h2><p>When your backend is connected, this area can show platform activity and let authorized admins manage users, websites, subscriptions and support requests.</p></div><div className="admin-setup-steps"><p><b>01</b><span><strong>Connect the API</strong><small>Set your backend URL in Vercel environment variables.</small></span></p><p><b>02</b><span><strong>Secure admin access</strong><small>Verify the admin role on the server for every protected request.</small></span></p><p><b>03</b><span><strong>Load real records</strong><small>Replace empty states with your API responses.</small></span></p></div></section></>:<section className="admin-empty-panel admin-section-empty"><span className="admin-empty-icon"><Settings size={22}/></span><h2>{section} will appear here</h2><p>Connect your backend to load and manage real {section.toLowerCase()} data. This page currently contains no sample accounts or fake records.</p></section>}
    <footer className="admin-footer">Portfolia Admin <span>Separate workspace · Backend integration pending</span></footer></main></div>
}
