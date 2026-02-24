import { useState, useEffect } from "react";

/* ─── UTILS ─────────────────────────────────────────────────────────────── */
const rndHex  = (n) => Array.from({length:n},()=>"0123456789abcdef"[Math.random()*16|0]).join("");
const rndHash = ()  => "0x" + rndHex(64);
const rndTx   = ()  => "0x" + rndHex(40);
const tick    = ()  => new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────── */


/* ─── SHARED COMPONENTS ──────────────────────────────────────────────────── */
function Styles() { return <style dangerouslySetInnerHTML={{__html:CSS}} />; }
function GBG()    { return <div className="grid-bg" aria-hidden="true" />; }

function Nav({ screen, onNav }) {
  return (
    <nav>
      <div className="brand" onClick={() => onNav("search")}>
        <div className="brand-icon">🔒</div>
        <div>
          <span className="brand-name">Secure Clinical Trials Blockchain</span>
          <span className="brand-sub">Verified Research Network · Est. 2024</span>
        </div>
      </div>
      <div className="nav-right">
        {(screen==="login"||screen==="register") ? (
          <button className="btn btn-ghost" onClick={()=>onNav("search")}>← Home</button>
        ) : (
          <>
            <button className="btn btn-outline btn-pill" onClick={()=>onNav("login")}>Login</button>
            <button className="btn btn-primary btn-pill" onClick={()=>onNav("register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer>
      {["Home","Search","About","FAQ","Contact","Privacy Policy","Terms of Use"].map(l=><a key={l}>{l}</a>)}
    </footer>
  );
}

/* ─── BLOCKCHAIN PANEL ───────────────────────────────────────────────────── */
function BlockchainPanel() {
  const [hash,  setHash]  = useState(rndHash());
  const [block, setBlock] = useState(19_482_301);
  const [tx,    setTx]    = useState(rndTx());
  const [ts,    setTs]    = useState(tick());
  const [cp,    setCp]    = useState(null);

  useEffect(() => {
    const t = setInterval(() => { setBlock(n=>n+1); setTs(tick()); setHash(rndHash()); }, 13000);
    return () => clearInterval(t);
  }, []);

  const copy = (v,k) => { navigator.clipboard?.writeText(v).catch(()=>{}); setCp(k); setTimeout(()=>setCp(null),1500); };

  return (
    <div className="bc-panel">
      <div className="eyebrow" style={{color:"#93b8ff",marginBottom:".8rem"}}>
        <span style={{width:16,height:2,background:"#93b8ff",borderRadius:1,display:"inline-block"}} />
        🔗 Blockchain Verification
      </div>
      {[["Data Hash",hash,"h"],["Block Number",`#${block.toLocaleString()}`,"b"],["Timestamp",ts,"t"],["Transaction ID",tx,"tx"]].map(([k,v,id])=>(
        <div className="bc-row" key={id}>
          <div><div className="bc-k">{k}</div><div className="bc-v">{v}</div></div>
          <button className={`bc-copy ${cp===id?"ok":""}`} onClick={()=>copy(v,id)}>{cp===id?"✓ Done":"⎘ Copy"}</button>
        </div>
      ))}
      <div style={{display:"flex",flexDirection:"column",gap:".6rem",marginTop:"1rem"}}>
        <button className="btn btn-sm" style={{background:"rgba(147,184,255,0.15)",border:"1px solid rgba(147,184,255,0.25)",color:"#93b8ff",borderRadius:8,cursor:"pointer",fontFamily:"var(--cond)",fontWeight:700,letterSpacing:".06em",fontSize:".72rem",padding:".5rem"}}>🔍 Verify on Blockchain Explorer</button>
        <div className="verify-chip"><span className="dot dot-g" style={{width:6,height:6}}/>Data Verified — {ts}</div>
      </div>
    </div>
  );
}

/* ─── FULL ACCESS REQUEST MODAL ─────────────────────────────────────────── */
function FullAccessModal({ trial, onClose }) {
  const [step, setStep]     = useState(1); // 1=role, 2=details, 3=docs, 4=review, 5=success
  const [role, setRole]     = useState("researcher");
  const [inst, setInst]     = useState("");
  const [reason, setReason] = useState("");
  const [uploaded, setUpl]  = useState(false);

  const stepDone = s => step > s;
  const stepAct  = s => step === s;

  const stepNames = ["Role","Details","Documents","Review","Done"];

  const submit = () => setStep(5);

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.4rem"}}>
          <div>
            <div className="eyebrow">Full Data Access</div>
            <div className="modal-title">Request Full Access</div>
            <div className="modal-sub">
              {trial ? <>Trial: <strong>{trial}</strong></> : "Submit your institutional access request"}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Step indicator */}
        {step < 5 && (
          <div className="ar-steps">
            {stepNames.slice(0,4).map((nm,i)=>(
              <>
                <div className={`ar-step ${stepAct(i+1)?"active":""} ${stepDone(i+1)?"done":""}`} key={nm}>
                  <div className="ar-step-num">{stepDone(i+1)?"✓":i+1}</div>
                  <div className="ar-step-lbl">{nm}</div>
                </div>
                {i<3 && <div className={`ar-connector ${stepDone(i+1)?"done":""}`} key={"c"+i} />}
              </>
            ))}
          </div>
        )}

        {/* ── STEP 1: Role ── */}
        {step===1 && (
          <>
            <div className="sec-label">Select Your Access Role</div>
            <div className="role-grid">
              {[["🔬","Researcher","researcher"],["🏥","Institution","institution"],["💊","Pharma Sponsor","pharma"],["🏛","Regulator","regulator"],["🎓","Academic","academic"],["👤","Other","other"]].map(([ic,lb,val])=>(
                <div key={val} className={`role-card ${role===val?"sel":""}`} onClick={()=>setRole(val)}>
                  <div className="role-card-ico">{ic}</div>
                  <div className="role-card-lbl">{lb}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:".6rem",marginTop:".5rem"}}>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary btn-lg" onClick={()=>setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 2: Details ── */}
        {step===2 && (
          <>
            <div className="sec-label">Professional Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 .75rem"}}>
              <div className="field"><label className="f-lbl">First Name</label><input className="f-inp" placeholder="Sarah" /></div>
              <div className="field"><label className="f-lbl">Last Name</label><input className="f-inp" placeholder="Smith" /></div>
            </div>
            <div className="field"><label className="f-lbl">Institutional / Professional Email</label><input className="f-inp" type="email" placeholder="researcher@hospital.org" /></div>
            <div className="field">
              <label className="f-lbl">Institution / Organization</label>
              <input className="f-inp" placeholder="City Hospital Medical Center" value={inst} onChange={e=>setInst(e.target.value)} />
            </div>
            <div className="field">
              <label className="f-lbl">Data Access Purpose</label>
              <select className="f-select">
                <option>Clinical Research</option>
                <option>Regulatory Review</option>
                <option>Academic Study</option>
                <option>Drug Development</option>
                <option>Meta-Analysis</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label className="f-lbl">Justification for Access</label>
              <textarea className="f-textarea" placeholder="Describe why you need full access to this trial's data..." value={reason} onChange={e=>setReason(e.target.value)} />
            </div>
            <div style={{display:"flex",justifyContent:"space-between",gap:".6rem",marginTop:".5rem"}}>
              <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={()=>setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 3: Documents ── */}
        {step===3 && (
          <>
            <div className="sec-label">Supporting Documents</div>
            <div className="doc-upload" onClick={()=>setUpl(true)} style={{marginBottom:"1rem",borderColor:uploaded?"var(--green)":"var(--brand-md)",background:uploaded?"rgba(15,155,110,0.06)":"var(--brand-xl)"}}>
              <div className="doc-upload-ico">{uploaded?"✅":"📎"}</div>
              <div className="doc-upload-text">
                {uploaded ? <><strong style={{color:"var(--green)"}}>ethics_approval.pdf</strong> uploaded</> : <><strong>Click to upload</strong> or drag & drop<br/>IRB approval, ethics certificate, institutional letter</>}
              </div>
            </div>
            <div style={{fontSize:".76rem",color:"var(--muted)",background:"var(--bg)",padding:".75rem 1rem",borderRadius:8,border:"1px solid var(--border)",marginBottom:"1rem",lineHeight:1.65}}>
              <strong style={{color:"var(--text)"}}>Required documents:</strong> IRB / Ethics Board approval certificate, Institutional authorization letter, Researcher credentials (CV or institutional ID). All documents are encrypted and stored on-chain.
            </div>
            <div className="check-row">
              <input type="checkbox" id="irb" /><label htmlFor="irb">I confirm the attached IRB approval covers this dataset</label>
            </div>
            <div className="check-row">
              <input type="checkbox" id="gdpr" /><label htmlFor="gdpr">I agree to GDPR / HIPAA data handling obligations</label>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",gap:".6rem"}}>
              <button className="btn btn-outline" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={()=>setStep(4)}>Next →</button>
            </div>
          </>
        )}

        {/* ── STEP 4: Review ── */}
        {step===4 && (
          <>
            <div className="sec-label">Review & Submit</div>
            <div className="ar-summary">
              {[
                ["Trial","Diabetes Drug X — Phase 3"],
                ["Access Role", role.charAt(0).toUpperCase()+role.slice(1)],
                ["Institution", inst||"City Hospital Medical Center"],
                ["Purpose","Clinical Research"],
                ["Documents","ethics_approval.pdf"],
                ["Status","Pending review (1–3 business days)"],
              ].map(([l,v])=>(
                <div className="ar-sum-row" key={l}>
                  <span className="ar-sum-l">{l}</span>
                  <span className="ar-sum-v">{v}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:".74rem",color:"var(--muted)",background:"var(--brand-xl)",border:"1px solid var(--brand-md)",borderRadius:8,padding:".72rem 1rem",marginBottom:"1.2rem",lineHeight:1.65}}>
              🔗 Your request will be cryptographically signed and recorded on the blockchain. All access events are permanently auditable.
            </div>
            <div className="check-row">
              <input type="checkbox" id="terms2"/><label htmlFor="terms2">I agree to the data use agreement and terms of access</label>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",gap:".6rem"}}>
              <button className="btn btn-outline" onClick={()=>setStep(3)}>← Back</button>
              <button className="btn btn-success btn-lg" onClick={submit}>Submit Request ✓</button>
            </div>
          </>
        )}

        {/* ── STEP 5: Success ── */}
        {step===5 && (
          <div style={{textAlign:"center",padding:".5rem 0"}}>
            <span className="success-ico">🎉</span>
            <div className="success-title">Request Submitted!</div>
            <p className="success-sub">Your full data access request has been submitted and anchored to the blockchain. You'll receive an email within 1–3 business days once reviewed by the institutional committee.</p>
            <div className="tx-box">
              Request TX: 0x{rndHex(16)}…<br/>
              Block: #{(19_482_305).toLocaleString()}<br/>
              Status: <span style={{color:"var(--amber)"}}>Pending Review</span>
            </div>
            <div style={{display:"flex",gap:".6rem",justifyContent:"center"}}>
              <button className="btn btn-outline" onClick={onClose}>Close</button>
              <button className="btn btn-primary" onClick={()=>{ onClose(); }}>Track Application →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SCREEN 1: SEARCH ───────────────────────────────────────────────────── */
function SearchScreen({ onNav }) {
  const [block,    setBlock]    = useState(19_482_301);
  const [verified, setVerified] = useState(tick());
  const [rec,      setRec]      = useState(153);
  const [accessModal, setAccessModal] = useState(null);

  useEffect(()=>{
    const t1=setInterval(()=>{setBlock(n=>n+1);setVerified(tick());},10000);
    const t2=setInterval(()=>setRec(n=>n<298?n+1:n),7000);
    return()=>[t1,t2].forEach(clearInterval);
  },[]);

  const trials = [
    {
      icon:"🧬", title:"Diabetes Drug X — Phase 3", delay:"d2",
      researcher:"Dr. Sarah Smith · City Hospital",
      status:"Completed", statusIcon:"✅", badge:"b-green",
      stats:[["Posted","Jan 15, 2026"],["Patients","500"],["Effectiveness","78%",true],["Duration","12 months"],["Side Effects","Nausea 12%"],["Age Range","18–65 yrs"]],
    },
    {
      icon:"🧠", title:"Alzheimer's Drug Y — Phase 2", delay:"d3",
      researcher:"Dr. Michael Chen · University Medical",
      status:"Recruiting", statusIcon:"🔄", badge:"b-blue",
      stats:[["Enrolled",<span className="np">{rec}</span>],["Target","300"],["Preliminary","65%",true],["Duration","18 months"]],
      progress:{cur:rec,max:300},
    },
    {
      icon:"❤️", title:"Heart Disease Study Z", delay:"d4",
      researcher:"Dr. Emily Brown · Memorial Hospital",
      status:"Analysis Phase", statusIcon:"📊", badge:"b-amber",
      stats:[["Patients","450"],["Duration","24 months"],["Results","Pending"],["Sites","8"]],
    },
  ];

  return (
    <div className="screen">
      <GBG />
      {accessModal && <FullAccessModal trial={accessModal} onClose={()=>setAccessModal(null)} />}
      <Nav screen="search" onNav={onNav} />
      <main>
        {/* Status bar */}
        <div className="status-bar rise d1">
          <div className="si"><span className="dot dot-g dot-gl"/><span>Blockchain: <strong style={{color:"var(--green)"}}>Connected</strong></span></div>
          <span className="ss">·</span>
          <div className="si"><span>Block <strong>#{block.toLocaleString()}</strong></span></div>
          <span className="ss">·</span>
          <div className="si"><span>Last verified: <strong>{verified}</strong></span></div>
          <div className="si-verified"><span className="dot dot-g" style={{width:6,height:6}}/>✓ All data verified on-chain</div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="hero-label rise d1">Blockchain-Secured Medical Research</div>
          <h1 className="hero-title rise d1">Search Clinical Trials</h1>
          <p className="hero-sub rise d1">Discover verified, tamper-proof medical research secured on the blockchain and accessible to all.</p>
          <div className="search-wrap rise d1">
            <input className="search-input" placeholder="Search by disease, drug, researcher, institution…" />
            <button className="search-btn">Search →</button>
          </div>
        </div>

        {/* Notice */}
        <div className="notice rise d2">
          <span style={{fontSize:"1.1rem"}}>📢</span>
          <div><strong>Public Access Mode</strong> — You are viewing publicly available trial summaries only. <span style={{opacity:.8}}>Login or register for full data access.</span></div>
        </div>

        {/* Trials */}
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:"1.1rem"}}>
          <div className="eyebrow" style={{marginBottom:0}}>Latest Trials</div>
          <span style={{fontSize:".71rem",color:"var(--muted)",fontFamily:"var(--mono)"}}>3 active trials</span>
        </div>
        <div className="trial-grid">
          {trials.map((t,i)=>(
            <TrialCard key={i} trial={t} onView={()=>onNav("detail")} onAccess={()=>setAccessModal(t.title)} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TrialCard({ trial, onView, onAccess }) {
  const [saved,setSaved]=useState(false);
  return (
    <div className={`card trial-card rise ${trial.delay}`}>
      <div className="tc-head">
        <div className="tc-ico">{trial.icon}</div>
        <button className={`star ${saved?"on":""}`} onClick={()=>setSaved(s=>!s)}>{saved?"⭐":"☆"}</button>
      </div>
      <span className={`badge ${trial.badge}`}>{trial.statusIcon} {trial.status}</span>
      <div className="tc-title">{trial.title}</div>
      <div className="tc-res">{trial.researcher}</div>
      <div className="tc-stats">
        {trial.stats.map(([l,v,hi])=>(
          <div key={l}>
            <div className="ts-l">{l}</div>
            <div className={`ts-v ${hi?"hi":""}`}>{v}</div>
          </div>
        ))}
      </div>
      {trial.progress && (
        <div className="prog-wrap">
          <div className="prog-lbl"><span>Recruitment Progress</span><span>{trial.progress.cur}/{trial.progress.max}</span></div>
          <div className="prog-track"><div className="prog-fill" style={{width:`${(trial.progress.cur/trial.progress.max)*100}%`}}/></div>
        </div>
      )}
      <div className="tc-acts">
        <button className="ta-btn ta-view" onClick={onView}>📄 View Summary</button>
        <button className="ta-btn ta-lock" onClick={onAccess}>🔒 Full Access</button>
      </div>
    </div>
  );
}

/* ─── SCREEN 2: DETAIL ───────────────────────────────────────────────────── */
function DetailScreen({ onNav }) {
  const [accessModal, setAccessModal] = useState(false);

  return (
    <div className="screen">
      <GBG />
      {accessModal && <FullAccessModal trial="Diabetes Drug X — Phase 3" onClose={()=>setAccessModal(false)} />}
      <Nav screen="detail" onNav={onNav} />
      <main>
        <div className="breadcrumb">
          <a onClick={()=>onNav("search")}>← Search Results</a>
          <span className="bc-sep">›</span>
          <span>Trial NCT-DIAB-123</span>
        </div>

        <div className="rise d1" style={{display:"flex",flexWrap:"wrap",gap:".65rem",alignItems:"center",marginBottom:"1rem"}}>
          <h1 className="detail-title" style={{margin:0}}>🧬 Diabetes Drug X — Phase 3</h1>
          <span className="badge b-pub">Public View</span>
          <span className="badge b-green">✅ Completed</span>
        </div>

        <div className="meta-strip rise d1">
          {[["Trial ID","NCT-DIAB-123"],["Phase","Phase 3"],["Posted","Jan 15, 2026"],["Updated","Feb 1, 2026"],["Sites","15 US Sites"],["Sponsor","PharmaCorp"]].map(([l,v])=>(
            <div className="mi" key={l}><div className="mi-l">{l}</div><div className="mi-v">{v}</div></div>
          ))}
        </div>

        <div className="detail-grid">
          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>

            <div className="card rise d2">
              <div className="eyebrow">Principal Investigator</div>
              <div style={{fontFamily:"var(--serif)",fontSize:"1.05rem",fontWeight:700,marginBottom:".18rem"}}>Dr. Sarah Smith</div>
              <div style={{fontSize:".79rem",color:"var(--muted)",marginBottom:".05rem"}}>City Hospital Medical Center — Endocrinology</div>
              <div style={{fontSize:".79rem",color:"var(--muted)",marginBottom:".85rem"}}>Sponsor: <strong style={{color:"var(--text)"}}>PharmaCorp International</strong></div>
              <button className="btn btn-outline btn-sm">✉ Contact (blockchain-recorded)</button>
            </div>

            <div className="card rise d2">
              <div className="eyebrow">Study Summary</div>
              <p style={{fontSize:".82rem",color:"var(--muted)",lineHeight:1.78}}>A randomized, double-blind, placebo-controlled clinical trial conducted across <strong style={{color:"var(--text)"}}>15 sites</strong> in the United States evaluating the efficacy and safety of Drug X vs placebo in adults with Type 2 Diabetes Mellitus. Primary endpoint: HbA1c reduction at 52 weeks. All trial milestones are cryptographically anchored to the blockchain.</p>
            </div>

            <div className="card rise d3">
              <div className="eyebrow">Key Results</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".9rem",marginBottom:"1rem"}}>
                {[["Treatment Group (250)","78% effective","var(--brand)"],["Placebo Group (250)","22% effective","var(--muted)"]].map(([l,v,c])=>(
                  <div key={l} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,padding:".9rem",textAlign:"center"}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:".6rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".38rem"}}>{l}</div>
                    <div style={{fontFamily:"var(--serif)",fontSize:"1.4rem",fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              {[["Total Patients","500"],["HbA1c Reduction (Treatment)","−1.2%"],["HbA1c Reduction (Placebo)","−0.3%"],["Side Effects","Mild nausea 12%"],["Serious Adverse Events","1%"]].map(([l,v])=>(
                <div className="dr" key={l}><span className="dr-l">{l}</span><span className="dr-v">{v}</span></div>
              ))}
            </div>

            <div className="card rise d4">
              <div className="eyebrow">Eligibility Criteria</div>
              <div className="elig-grid">
                <div>
                  <div className="elig-head inc">✓ Inclusion</div>
                  {["Age 18–65 years","T2DM ≥ 6 months","HbA1c 7.5–10.5%","BMI 22–40 kg/m²","Stable metformin"].map(e=><div className="elig-item" key={e}><span style={{color:"var(--green)"}}>+</span>{e}</div>)}
                </div>
                <div>
                  <div className="elig-head exc">✗ Exclusion</div>
                  {["Type 1 Diabetes","eGFR < 45","Pregnancy / nursing","Recent cardiac event","Active insulin therapy"].map(e=><div className="elig-item" key={e}><span style={{color:"var(--red)"}}>−</span>{e}</div>)}
                </div>
              </div>
            </div>

            <div className="card rise d5">
              <div className="eyebrow">Public Documents</div>
              {[["📄","Study Protocol","PDF · 2.4 MB"],["📊","Results Summary","PDF · 1.1 MB"],["📝","Plain Language Summary","PDF · 680 KB"],["👤","Patient Info Sheet","PDF · 540 KB"]].map(([ic,nm,sz])=>(
                <div className="doc-row" key={nm}>
                  <div className="doc-ico">{ic}</div>
                  <span className="doc-nm">{nm}</span>
                  <span className="doc-sz">{sz}</span>
                  <button className="doc-dl">↓</button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{display:"flex",flexDirection:"column",gap:"1.2rem",position:"sticky",top:"80px"}}>
            <div className="rise d2"><BlockchainPanel /></div>
            <div className="locked-card rise d3">
              <span className="lc-ico">🔒</span>
              <div className="lc-title">Full Data Access Required</div>
              <p className="lc-text">Patient-level datasets, raw trial data, statistical analyses, and investigator notes require institutional authorization. Apply with your credentials and IRB approval.</p>
              <button className="btn-amber" onClick={()=>setAccessModal(true)}>Request Full Access →</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─── SCREEN 3: LOGIN ────────────────────────────────────────────────────── */
const LOG_POOL=[
  "Login attempt from 203.0.113.42 — Success",
  "MFA verification completed — FIDO2 key",
  "Session anchored to blockchain block",
  "Data access request logged on-chain",
  "Login attempt blocked — risk score 84",
  "Password reset — MFA verification pending",
  "New device fingerprint recorded",
];

function LoginScreen({ onNav }) {
  const [step,setStep]=useState("form");
  const [logs,setLogs]=useState([{t:tick(),m:"Security module initialized"}]);

  useEffect(()=>{
    const t=setInterval(()=>{setLogs(l=>[{t:tick(),m:LOG_POOL[Math.random()*LOG_POOL.length|0]},...l.slice(0,7)]);},4500);
    return()=>clearInterval(t);
  },[]);

  return (
    <div className="screen">
      <GBG />
      <div style={{position:"fixed",top:"25%",right:"8%",width:"440px",height:"440px",borderRadius:"50%",background:"radial-gradient(circle,rgba(69,103,183,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {step==="mfa" && (
        <div className="overlay">
          <div className="modal modal-sm">
            <button className="modal-close" onClick={()=>setStep("form")}>✕</button>
            <div className="eyebrow">Step 2 of 2</div>
            <div className="modal-title">🔑 Multi-Factor Auth</div>
            <div className="modal-sub">Choose your second factor to complete secure login</div>
            {[["📱","Authenticator App","Enter 6-digit TOTP code"],["🔑","FIDO2 Security Key","Insert & tap your hardware key"],["💬","SMS Code","Receive one-time code by text"]].map(([ic,lb,dc])=>(
              <div className="mfa-opt" key={lb} onClick={()=>setStep("success")}>
                <div className="mfa-ico">{ic}</div>
                <div><div className="mfa-lbl">{lb}</div><div className="mfa-desc">{dc}</div></div>
              </div>
            ))}
            <div className="mfa-note"><span className="dot dot-g" style={{width:5,height:5}}/>All auth events recorded on blockchain</div>
          </div>
        </div>
      )}

      {step==="success" && (
        <div className="overlay">
          <div className="modal modal-sm" style={{textAlign:"center"}}>
            <span className="success-ico">✅</span>
            <div className="success-title">Access Granted</div>
            <p className="success-sub">Authentication successful. Redirecting to your secure research dashboard…</p>
            <div className="tx-box">Session anchored to block #{(19_482_304).toLocaleString()}<br/>TX: 0x{rndHex(16)}…</div>
            <button className="btn btn-outline" onClick={()=>{setStep("form");onNav("search");}}>← Return to Search</button>
          </div>
        </div>
      )}

      <Nav screen="login" onNav={onNav} />
      <div className="login-wrap">
        <div className="card login-card rise d1">
          <div className="eyebrow">Secure Portal</div>
          <div className="login-title">Welcome Back</div>
          <div className="login-sub">Sign in to access your clinical trial data</div>
          <div className="sec-notice"><span>⚠️</span><span>Secure access — Multi-factor authentication required</span></div>
          <div className="field"><label className="f-lbl">Email Address</label><input className="f-inp" type="email" placeholder="researcher@institution.org"/></div>
          <div className="field"><label className="f-lbl">Password</label><input className="f-inp" type="password" placeholder="••••••••••••••"/></div>
          <div className="check-row" style={{marginBottom:".9rem"}}><input type="checkbox" id="rem"/><label htmlFor="rem">Remember this device for 30 days</label></div>
          <button className="btn-cta" onClick={()=>setStep("mfa")}>LOGIN SECURELY →</button>
          <div className="login-links"><a>Forgot password?</a><a>Need help?</a><a onClick={()=>onNav("register")}>Apply for access</a></div>
        </div>

        <div className="sec-panel">
          <div className="card rise d2">
            <div className="sec-label">Security Status</div>
            {[["Last Login","Feb 18, 2026 — 09:14 AM"],["IP Address","203.0.113."+Math.floor(Math.random()*200+20)],["Failed Attempts","0 this session"]].map(([l,v])=>(
              <div className="dr" key={l} style={{fontSize:".78rem"}}>
                <span className="dr-l" style={{fontSize:".72rem"}}>{l}</span>
                <span className="dr-v" style={{fontFamily:"var(--mono)",fontSize:".72rem"}}>{v}</span>
              </div>
            ))}
            <div className="risk-wrap">
              <div className="risk-lbl"><span>Security Risk Score</span><span className="risk-score" style={{color:"var(--green)"}}>12 / 100</span></div>
              <div className="risk-track"><div className="risk-fill" style={{width:"12%"}}/></div>
              <div style={{fontSize:".64rem",color:"var(--green)",marginTop:".35rem",fontFamily:"var(--mono)"}}>✓ LOW RISK — Trusted device</div>
            </div>
          </div>

          <div className="card rise d3">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".75rem"}}>
              <div className="sec-label" style={{margin:0}}>Live Auth Log</div>
              <div style={{display:"flex",alignItems:"center",gap:".35rem",fontSize:".66rem",color:"var(--brand)",fontFamily:"var(--mono)",fontWeight:700}}>
                <span className="dot dot-b" style={{width:5,height:5}}/>LIVE
              </div>
            </div>
            <div className="log-box">
              {logs.map((e,i)=>(
                <div className="log-entry" key={i}>
                  <span className="log-t">{e.t}</span>
                  <span className="log-m">{e.m}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:".64rem",color:"var(--muted)",marginTop:".55rem",fontFamily:"var(--mono)",display:"flex",alignItems:"center",gap:".38rem"}}>
              <span className="dot dot-b" style={{width:5,height:5}}/>All events immutably recorded on-chain
            </div>
          </div>

          <div className="card rise d4" style={{background:"var(--brand-xl)",border:"1px solid var(--brand-md)"}}>
            <div className="sec-label">Access Levels</div>
            {[["👁 Public","Trial summaries, public docs"],["🔬 Researcher","Full datasets, patient data"],["🏥 Institutional","Multi-trial access + analytics"]].map(([l,v])=>(
              <div className="dr" key={l} style={{fontSize:".75rem"}}>
                <span style={{color:"var(--text)",fontWeight:500}}>{l}</span>
                <span style={{color:"var(--muted)",fontSize:".7rem"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 4: REGISTER ─────────────────────────────────────────────────── */
function RegisterScreen({ onNav }) {
  const [step,setStep]=useState("form");
  const [role,setRole]=useState("researcher");

  return (
    <div className="screen">
      <GBG />
      <div style={{position:"fixed",top:"30%",right:"10%",width:"380px",height:"380px",borderRadius:"50%",background:"radial-gradient(circle,rgba(69,103,183,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {step==="verify" && (
        <div className="overlay">
          <div className="modal modal-sm">
            <div className="eyebrow">Email Verification</div>
            <div className="modal-title">📧 Verify Your Email</div>
            <div className="modal-sub">We've sent a 6-digit code to your email address.</div>
            <div className="otp-wrap">
              {[0,1,2,3,4,5].map(i=>(
                <input key={i} maxLength={1} className="otp-inp"
                  onFocus={e=>e.target.style.borderColor="var(--brand)"}
                  onBlur={e=>e.target.style.borderColor="var(--border)"}
                />
              ))}
            </div>
            <button className="btn-cta" onClick={()=>setStep("success")}>VERIFY & ACTIVATE →</button>
            <div className="mfa-note" style={{marginTop:".8rem",justifyContent:"center"}}><span className="dot dot-g" style={{width:5,height:5}}/>Verification recorded on blockchain</div>
          </div>
        </div>
      )}

      {step==="success" && (
        <div className="overlay">
          <div className="modal modal-sm" style={{textAlign:"center"}}>
            <span className="success-ico">🎉</span>
            <div className="success-title">Account Created!</div>
            <p className="success-sub">Your account has been registered and anchored to the blockchain. You can now log in to access your dashboard.</p>
            <div className="tx-box">Account TX: 0x{rndHex(16)}…<br/>Block #{(19_482_310).toLocaleString()}</div>
            <button className="btn-cta" onClick={()=>onNav("login")}>PROCEED TO LOGIN →</button>
          </div>
        </div>
      )}

      <Nav screen="register" onNav={onNav} />
      <div className="login-wrap" style={{alignItems:"flex-start",paddingTop:"2.5rem"}}>
        <div className="card login-card rise d1" style={{maxWidth:"480px"}}>
          <div className="eyebrow">Create Account</div>
          <div className="login-title">Register Access</div>
          <div className="login-sub">Apply for authorized access to the clinical trials network</div>
          <div className="sec-notice"><span>🔒</span><span>All registrations verified and permanently recorded on blockchain</span></div>

          <div style={{marginBottom:"1.1rem"}}>
            <div className="f-lbl" style={{marginBottom:".55rem"}}>Access Role</div>
            <div className="role-grid" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
              {[["🔬","Researcher","researcher"],["🏥","Institution","institution"],["👁","Public","public"]].map(([ic,lb,val])=>(
                <div key={val} className={`role-card ${role===val?"sel":""}`} onClick={()=>setRole(val)}>
                  <div className="role-card-ico">{ic}</div>
                  <div className="role-card-lbl">{lb}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 .75rem"}}>
            <div className="field"><label className="f-lbl">First Name</label><input className="f-inp" placeholder="Sarah"/></div>
            <div className="field"><label className="f-lbl">Last Name</label><input className="f-inp" placeholder="Smith"/></div>
          </div>
          <div className="field"><label className="f-lbl">Institutional Email</label><input className="f-inp" type="email" placeholder="researcher@hospital.org"/></div>
          <div className="field"><label className="f-lbl">Institution / Organization</label><input className="f-inp" placeholder="City Hospital Medical Center"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 .75rem"}}>
            <div className="field"><label className="f-lbl">Password</label><input className="f-inp" type="password" placeholder="Min 12 chars"/></div>
            <div className="field"><label className="f-lbl">Confirm Password</label><input className="f-inp" type="password" placeholder="Repeat"/></div>
          </div>
          <div className="check-row" style={{marginBottom:".6rem"}}><input type="checkbox" id="tos"/><label htmlFor="tos">I agree to the <span style={{color:"var(--brand)",cursor:"pointer"}}>Terms of Service</span> and <span style={{color:"var(--brand)",cursor:"pointer"}}>Privacy Policy</span></label></div>
          <div className="check-row"><input type="checkbox" id="bc"/><label htmlFor="bc">I consent to my registration being recorded on the blockchain</label></div>
          <button className="btn-cta" style={{marginTop:"1rem"}} onClick={()=>setStep("verify")}>CREATE ACCOUNT →</button>
          <div style={{textAlign:"center",marginTop:".9rem",fontSize:".78rem",color:"var(--muted)"}}>Already have an account? <span style={{color:"var(--brand)",cursor:"pointer"}} onClick={()=>onNav("login")}>Sign in →</span></div>
        </div>

        <div style={{flex:1,minWidth:"260px",maxWidth:"320px",display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div className="card rise d2" style={{background:"var(--brand-xl)",border:"1px solid var(--brand-md)"}}>
            <div className="eyebrow">Access Benefits</div>
            {[["🧬","Full trial datasets","Complete patient-level data"],["📊","Advanced analytics","Cross-trial comparison tools"],["🔗","Blockchain audit trail","Tamper-proof research history"],["🔔","Trial alerts","Real-time recruitment notifications"],["📥","Bulk data export","CSV / JSON download"]].map(([ic,lb,dc])=>(
              <div key={lb} style={{display:"flex",gap:".72rem",padding:".58rem 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:"1rem",marginTop:".1rem"}}>{ic}</span>
                <div><div style={{fontSize:".8rem",color:"var(--text)",fontWeight:500,marginBottom:".08rem"}}>{lb}</div><div style={{fontSize:".72rem",color:"var(--muted)"}}>{dc}</div></div>
              </div>
            ))}
          </div>

          <div className="card rise d3" style={{border:"1px solid rgba(201,125,16,0.18)",background:"#fffbf0"}}>
            <div className="eyebrow" style={{color:"var(--amber)"}}>Verification Process</div>
            {[["1","Submit application","Instant"],["2","Email verification","~2 min"],["3","Institutional review","1–3 days"],["4","Full access granted","On approval"]].map(([n,s,t])=>(
              <div key={n} style={{display:"flex",alignItems:"center",gap:".72rem",padding:".5rem 0",borderBottom:"1px solid rgba(201,125,16,0.1)"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(201,125,16,0.12)",border:"1px solid rgba(201,125,16,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".67rem",fontFamily:"var(--mono)",color:"var(--amber)",flexShrink:0}}>{n}</div>
                <div style={{flex:1,fontSize:".78rem",color:"var(--text)"}}>{s}</div>
                <div style={{fontSize:".67rem",color:"var(--muted)",fontFamily:"var(--mono)"}}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [screen,setScreen]=useState("search");
  return (
    <>
      <Styles/>
      {screen==="search"   && <SearchScreen   onNav={setScreen}/>}
      {screen==="detail"   && <DetailScreen   onNav={setScreen}/>}
      {screen==="login"    && <LoginScreen    onNav={setScreen}/>}
      {screen==="register" && <RegisterScreen onNav={setScreen}/>}
    </>
  );
}