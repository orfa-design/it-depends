'use client';

import React, { useState, useEffect } from 'react';
import { type Step, type StepCategory, CATS, genTask, TOOLS } from '@/lib/data-v2';
import { type AppCopy, DEFAULT_COPY } from '@/lib/copy';

// Standard SVG Icons matching ui.jsx in handoff
export const Icon = {
  copy: (props: any) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>
    </svg>
  ),
  check: (props: any) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  arrow: (props: any) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  chev: (props: any) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  ),
  sun: (props: any) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </svg>
  ),
  moon: (props: any) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  ),
  edit: (props: any) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
    </svg>
  ),
  close: (props: any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
};

export const ACCENTS = [
  { key: "amber", hex: "#f5a623", rgb: "245, 166, 35" },
  { key: "coral", hex: "#ff6b4a", rgb: "255, 107, 74" },
  { key: "acid",  hex: "#c4f042", rgb: "196, 240, 66" },
  { key: "gold",  hex: "#e8b84b", rgb: "232, 184, 75" },
];

export const HEAD_FONTS = ["Unbounded", "Manrope", "Geologica", "Lora"];

interface V2ClientAppProps {
  username: string;
  initialSteps: Step[];
  initialCopy: AppCopy;
}

export default function V2ClientApp({ username, initialSteps, initialCopy }: V2ClientAppProps) {
  const isAdmin = ['mliudmyla', 'mvladyslav'].includes(username.toLowerCase().trim());

  // App layouts and themes
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [tab, setTab] = useState<'path' | 'gallery' | 'active'>('path');
  
  // Stateful steps & copy from KV
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [copy, setCopy] = useState<AppCopy>(initialCopy);

  // User progress synced to Vercel KV
  const [overrides, setOverrides] = useState<Record<string, 'inprogress' | 'done'>>({});
  const [results, setResults] = useState<Record<string, string>>({});
  const [notInterested, setNotInterested] = useState<Record<string, boolean>>({});

  // Dynamic overlays & modal controls
  const [selectedId, setSelectedId] = useState<string>('transcribe');
  const [modalId, setModalId] = useState<string | null>(null);
  const [saveFor, setSaveFor] = useState<string | null>(null);
  const [doneView, setDoneView] = useState<string | null>(null);
  const [editStepId, setEditStepId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCopyDrawer, setShowCopyDrawer] = useState(false);
  const [showTweaks, setShowTweaks] = useState(false);

  // Client tweaks values
  const [tweaks, setTweaks] = useState({
    accent: '#f5a623',
    headFont: 'Unbounded',
    width: 'повна',
    style: 'стримано'
  });

  // Sync client progress from KV on load
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch(`/api/v2/user?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          setOverrides(data.overrides || {});
          setResults(data.results || {});
          setNotInterested(data.notInterested || {});
        }
      } catch (err) {
        console.error('Failed to sync progress on startup:', err);
      }
    };
    loadProgress();

    // Read stored theme
    const storedTheme = localStorage.getItem('id_theme');
    if (storedTheme === 'light') {
      setTheme('light');
    }
  }, [username]);

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem('id_theme', theme);
  }, [theme]);

  // Apply tweaks + theme directly to Document Element
  useEffect(() => {
    const root = document.documentElement;
    const acc = ACCENTS.find(a => a.hex === tweaks.accent) || ACCENTS[0];
    root.style.setProperty('--accent', acc.hex);
    root.style.setProperty('--accent-rgb', acc.rgb);
    root.style.setProperty('--font-head', `"${tweaks.headFont}", "Manrope", system-ui, sans-serif`);
    root.setAttribute('data-theme', theme);
  }, [tweaks.accent, tweaks.headFont, theme]);

  const appCls = "app width-" + (tweaks.width === "фікс" ? "fixed" : "full") + " style-" + (tweaks.style === "експес" ? "exp" : "calm");

  // Save changes to database progress
  const syncProgress = async (newOverrides: any, newResults: any, newNotInterested: any) => {
    try {
      await fetch('/api/v2/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          progress: {
            overrides: newOverrides,
            results: newResults,
            notInterested: newNotInterested,
          }
        }),
      });
    } catch (err) {
      console.error('Failed to save progress to Vercel KV:', err);
    }
  };

  const takeInWork = (id: string) => {
    const nextOver = { ...overrides, [id]: 'inprogress' as const };
    setOverrides(nextOver);
    syncProgress(nextOver, results, notInterested);
  };

  const markStepDone = (id: string, resultUrl: string) => {
    const nextOver = { ...overrides, [id]: 'done' as const };
    const nextResults = { ...results, [id]: resultUrl };
    setOverrides(nextOver);
    setResults(nextResults);
    setSaveFor(null);
    setModalId(null);
    setDoneView(id);
    syncProgress(nextOver, nextResults, notInterested);
  };

  const toggleNotInterested = (id: string) => {
    const nextNot = { ...notInterested, [id]: !notInterested[id] };
    setNotInterested(nextNot);
    syncProgress(overrides, results, nextNot);
  };

  const getStatus = (s: Step) => {
    if (notInterested[s.id]) return 'avail'; // Hidden steps are still technically available
    const over = overrides[s.id];
    if (over === 'done') return 'done';
    if (over === 'inprogress') return 'current';
    return s.state; // default from data
  };

  const getStatusString = (s: Step) => {
    const status = getStatus(s);
    if (status === 'done') return 'done';
    if (status === 'current') return 'inprogress';
    if (status === 'future') return 'future';
    return 'available';
  };

  // Filtered active in-progress tasks count
  const activeCount = steps.filter(s => getStatus(s) === 'current').length;

  const handleResetAll = () => {
    if (confirm('Ви впевнені, що хочете повністю скинути весь ваш прогрес?')) {
      setOverrides({});
      setResults({});
      setNotInterested({});
      syncProgress({}, {}, {});
    }
  };

  // Admin CMS handlers
  const handleSaveStepCMS = async (updatedStep: Step) => {
    const nextSteps = steps.map(s => s.id === updatedStep.id ? updatedStep : s);
    setSteps(nextSteps);
    setEditStepId(null);

    try {
      await fetch('/api/v2/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-session': username
        },
        body: JSON.stringify(nextSteps)
      });
    } catch (err) {
      console.error('Failed to save CMS steps:', err);
    }
  };

  const handleAddStepCMS = async (newStep: Step) => {
    const nextSteps = [...steps, newStep];
    setSteps(nextSteps);
    setShowAddModal(false);

    try {
      await fetch('/api/v2/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-session': username
        },
        body: JSON.stringify(nextSteps)
      });
    } catch (err) {
      console.error('Failed to add CMS step:', err);
    }
  };

  const handleSaveCopyCMS = async (updatedCopy: AppCopy) => {
    setCopy(updatedCopy);
    try {
      await fetch('/api/v2/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-session': username
        },
        body: JSON.stringify(updatedCopy)
      });
    } catch (err) {
      console.error('Failed to save CMS copy:', err);
    }
  };

  return (
    <div className={appCls}>
      {/* HEADER */}
      <header className="header">
        <div className="wordmark">
          <span className="dot">·</span>
          <span className="it">{copy.global.headerLogo}</span>
          {isAdmin && <span style={{ fontSize: '10px', background: 'var(--accent)', color: 'var(--accent-ink)', padding: '2px 5px', borderRadius: '4px', marginLeft: '6px' }}>ADMIN</span>}
        </div>

        <nav className="tabs">
          <button 
            className={"tab" + (tab === "path" ? " active" : "")} 
            onClick={() => { setTab("path"); setDoneView(null); }}
          >
            Шлях
          </button>
          <button 
            className={"tab" + (tab === "gallery" ? " active" : "")} 
            onClick={() => { setTab("gallery"); setDoneView(null); }}
          >
            Галерея
          </button>
        </nav>

        <div className="header-right">
          {tab !== "active" && (
            <button 
              className={"h-counter" + (activeCount === 0 ? " empty" : "")} 
              onClick={() => { setTab("active"); setDoneView(null); }}
              title="активні задачі"
            >
              <span className="n">{activeCount}</span>
              <span>активні</span>
            </button>
          )}
          
          {isAdmin && (
            <>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setShowAddModal(true)}>
                {copy.global.headerAddStep}
              </button>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setShowCopyDrawer(true)}>
                {copy.global.headerCopy}
              </button>
            </>
          )}

          <span className="h-divider" />
          <span className="h-user">{username}</span>
          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="тема">
            {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
          </button>
        </div>
      </header>

      {/* RENDER BODY SECTIONS */}
      {doneView ? (
        <DonePage 
          stepId={doneView} 
          steps={steps} 
          copy={copy} 
          results={results} 
          onMap={(id) => { setDoneView(null); setTab('path'); if (id) setSelectedId(id); }} 
          onOpenStep={(id) => { setDoneView(null); setTab('gallery'); setModalId(id); }} 
        />
      ) : (
        <div className="body">
          {tab === "path" ? (
            <MapMode 
              steps={steps} 
              copy={copy}
              selectedId={selectedId} 
              setSelectedId={setSelectedId} 
              getStatus={getStatus} 
              getStatusString={getStatusString}
              takeInWork={takeInWork}
              results={results}
              notInterested={notInterested}
              toggleNotInterested={toggleNotInterested}
              setSaveFor={setSaveFor}
              isAdmin={isAdmin}
              setEditStepId={setEditStepId}
            />
          ) : tab === "gallery" ? (
            <GalleryView 
              steps={steps} 
              copy={copy} 
              getStatus={getStatus} 
              getStatusString={getStatusString}
              onOpenCard={(id) => setModalId(id)} 
              notInterested={notInterested}
            />
          ) : (
            <ActivePage 
              steps={steps} 
              copy={copy}
              getStatus={getStatus} 
              onOpenCard={(id) => setModalId(id)} 
              onGoGallery={() => setTab('gallery')} 
            />
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {modalId && (
        <StepModal 
          stepId={modalId} 
          steps={steps} 
          copy={copy} 
          getStatus={getStatus} 
          getStatusString={getStatusString}
          takeInWork={takeInWork} 
          results={results}
          notInterested={notInterested}
          toggleNotInterested={toggleNotInterested}
          setSaveFor={setSaveFor} 
          onClose={() => setModalId(null)} 
          isAdmin={isAdmin}
          setEditStepId={setEditStepId}
          onSelectRelated={(id) => setModalId(id)}
        />
      )}

      {/* SAVE PROGRESS MODAL */}
      {saveFor && (
        <SaveModal 
          stepId={saveFor} 
          copy={copy} 
          onClose={() => setSaveFor(null)} 
          onSave={(url) => markStepDone(saveFor, url)} 
        />
      )}

      {/* TWEAKS PANEL */}
      <button 
        className="icon-btn" 
        style={{ position: 'fixed', right: '16px', bottom: '16px', zIndex: 100, background: 'var(--bg-2)', border: '1px solid var(--line-strong)' }}
        onClick={() => setShowTweaks(!showTweaks)}
        title="Налаштування вигляду"
      >
        ⚙️
      </button>

      {showTweaks && (
        <TweaksPanel 
          tweaks={tweaks} 
          setTweaks={setTweaks} 
          onReset={handleResetAll} 
          onClose={() => setShowTweaks(false)} 
        />
      )}

      {/* ADMIN CMS DRAWER */}
      {showCopyDrawer && (
        <CopyDrawer 
          copy={copy} 
          onSave={handleSaveCopyCMS} 
          onClose={() => setShowCopyDrawer(false)} 
        />
      )}

      {/* ADMIN ADD STEP MODAL */}
      {showAddModal && (
        <AddStepModal 
          onAdd={handleAddStepCMS} 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {/* ADMIN EDIT STEP MODAL */}
      {editStepId && (
        <EditStepModal 
          step={steps.find(s => s.id === editStepId)!} 
          onSave={handleSaveCMSStep => handleSaveStepCMS(handleSaveCMSStep)} 
          onClose={() => setEditStepId(null)} 
        />
      )}
    </div>
  );
}

/* ============================================================
   MAP MODE COMPONENT (3 Columns layout)
   ============================================================ */
interface MapModeProps {
  steps: Step[];
  copy: AppCopy;
  selectedId: string;
  setSelectedId: (id: string) => void;
  getStatus: (s: Step) => string;
  getStatusString: (s: Step) => string;
  takeInWork: (id: string) => void;
  results: Record<string, string>;
  notInterested: Record<string, boolean>;
  toggleNotInterested: (id: string) => void;
  setSaveFor: (id: string | null) => void;
  isAdmin: boolean;
  setEditStepId: (id: string | null) => void;
}

function MapMode({
  steps, copy, selectedId, setSelectedId, getStatus, getStatusString,
  takeInWork, results, notInterested, toggleNotInterested, setSaveFor, isAdmin, setEditStepId
}: MapModeProps) {
  // Filter out steps marked "not interested" from the visual map strip
  const visibleSteps = steps.filter(s => !notInterested[s.id]);
  const currentStep = steps.find(s => s.id === selectedId);

  return (
    <div className="map">
      {/* LEFT COLUMN: Map Strip */}
      <div className="strip">
        <div className="strip-head">
          <span className="eyebrow">{copy.map.heading}</span>
          <span className="prog">
            <b>{steps.filter(s => getStatus(s) === 'done').length}</b> / {steps.length} виконано
          </span>
        </div>
        <div className="strip-list scroll">
          {visibleSteps.map((s, idx) => {
            const st = getStatus(s);
            const isSel = s.id === selectedId;
            return (
              <button 
                key={s.id} 
                className={`node ${isSel ? 'sel' : ''} ${st}`} 
                onClick={() => setSelectedId(s.id)}
              >
                <div className="node-rail">
                  <span className="node-dot" />
                </div>
                <div className="node-body">
                  <div className="node-title">
                    {s.title}
                    {st === 'done' && <span className="check"><Icon.check style={{ width: 11, height: 11 }} /></span>}
                    {s.kind === 'build' && <span className="node-phases">{s.phases?.length} етапи</span>}
                  </div>
                  <div className="node-sub">{s.subtitle}</div>
                </div>
              </button>
            );
          })}

          <div className="node-locked">
            <div className="nl-icon">🔒</div>
            <div className="nl-text">Скоро тут з'являться нові кроки — ми їх зараз додаємо.</div>
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Main Content */}
      <div className="center scroll">
        <div className="center-inner">
          {currentStep ? (
            <StepContent 
              step={currentStep} 
              copy={copy} 
              getStatusString={getStatusString} 
            />
          ) : (
            <div className="map-overview">
              <h1>Ось де ти зараз.</h1>
              <p>{copy.map.defaultPathNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky Sidebar */}
      <div className="side">
        {currentStep && (
          <Sidebar 
            step={currentStep} 
            copy={copy}
            status={getStatusString(currentStep)} 
            resultUrl={results[currentStep.id]}
            isNotInterested={!!notInterested[currentStep.id]}
            onTake={() => takeInWork(currentStep.id)}
            onDone={() => setSaveFor(currentStep.id)}
            onToggleNotInterested={() => toggleNotInterested(currentStep.id)}
            relatedSteps={steps.filter(s => currentStep.related.includes(s.id))}
            onSelectRelated={(id) => setSelectedId(id)}
            isAdmin={isAdmin}
            onEdit={() => setEditStepId(currentStep.id)}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STEP CONTENT RENDERER (CORE / PITCH / GUIDE)
   ============================================================ */
interface StepContentProps {
  step: Step;
  copy: AppCopy;
  getStatusString: (s: Step) => string;
}

export function StepContent({ step, copy, getStatusString }: StepContentProps) {
  const [task, setTask] = useState(step.defaultTask);
  const [copied, setCopied] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true });
  const [completedPhases, setCompletedPhases] = useState<Record<number, boolean>>({});
  const [isLevelUpExpanded, setIsLevelUpExpanded] = useState(false);
  const status = getStatusString(step);

  // Sync state if step changes
  useEffect(() => {
    setTask(step.defaultTask);
    setExpandedPhases({ 1: true });
    setCompletedPhases({});
    setIsLevelUpExpanded(false);
  }, [step]);

  const handleGenTask = () => {
    setTask(genTask(step, task));
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePhase = (n: number) => {
    setExpandedPhases(prev => ({ ...prev, [n]: !prev[n] }));
  };

  const togglePhaseComplete = (n: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedPhases(prev => ({ ...prev, [n]: !prev[n] }));
  };

  // Replace task placeholder
  const formattedPrompt = step.prompt ? step.prompt.replace('{task}', task) : '';

  return (
    <div className="step fade-in">
      {/* CORE */}
      <div className="step-sec">
        <h1 className="step-title">{step.title}</h1>
        <p className="step-sub">{step.subtitle}</p>
        <div className="step-meta">
          <span className="badge kind">{step.kind === 'build' ? 'Збірка' : 'Простий'}</span>
          <span className="badge effort">{step.effort}</span>
          <span className="badge accent" style={{ background: CATS[step.cat].color, color: 'var(--bg)', fontWeight: 'bold' }}>
            {CATS[step.cat].label}
          </span>
        </div>
      </div>

      {/* PITCH */}
      <div className="step-sec">
        <div className="sec-tag">{copy.step.pitchLabel}</div>
        <p className="promise" dangerouslySetInnerHTML={{ __html: step.promise.replace(/(Ти)/g, '<b>$1</b>') }} />
        <div className="pitch-use">
          <div className="pv"><span className="dl-label">{copy.step.usedWhenLabel}</span> {step.usedWhen}</div>
        </div>
        {step.kind === 'simple' && (
          <div className="pitch-tool">
            <span className="tl">Інструмент:</span>
            <span className="tv">{step.toolName}</span>
          </div>
        )}
        {step.author && (
          <div className="pitch-author">
            <div className="pa-l">досвід колег</div>
            <div className="pa-t">«{step.author}»</div>
          </div>
        )}
      </div>

      {/* GUIDE */}
      <div className="step-sec">
        <div className="sec-tag">гайд</div>
        
        <div className="task-label-row">
          <span className="task-label">
            {copy.step.taskLabel} {status === 'done' && <span className="task-state">(виконано ✓)</span>}
          </span>
          <button className="task-gen" onClick={handleGenTask} title="Згенерувати інший варіант">
            🎲 згенерувати іншу
          </button>
        </div>

        <textarea 
          className="task-edit" 
          value={task} 
          onChange={(e) => setTask(e.target.value)}
          placeholder="Опишіть ваше завдання..."
        />

        {step.kind === 'simple' ? (
          <>
            <div className="prompt">
              <div className="prompt-bar">
                <span className="pb-l">Claude.ai промпт</span>
                <div className="pb-r">
                  <span className="char-count">{formattedPrompt.length} символів</span>
                  <button 
                    className={`copy-btn ${copied ? 'copied' : ''}`} 
                    onClick={() => handleCopyPrompt(formattedPrompt)}
                  >
                    {copied ? <><Icon.check /> скопійовано</> : <><Icon.copy /> копіювати</>}
                  </button>
                </div>
              </div>
              <pre className="prompt-body">{formattedPrompt}</pre>
            </div>

            {step.howto && (
              <>
                <h3 className="howto-label">Як це піде</h3>
                <div className="howto">
                  {step.howto.map((h, idx) => (
                    <div key={idx} className="howto-item">
                      <span className="hn" />
                      <span className="ht">{h}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step.checkpoint && (
              <div className="checkpoint">
                <span className="cp-i"><Icon.check /></span>
                <span className="cp-t" dangerouslySetInnerHTML={{ __html: step.checkpoint.replace(/(\*\*.*?\*\*)/g, '<b>$1</b>').replace(/\*\*/g, '') }} />
              </div>
            )}
          </>
        ) : (
          <div className="phases">
            {step.phases?.map((p) => {
              const isOpen = !!expandedPhases[p.n];
              const isDone = !!completedPhases[p.n];
              const phasePrompt = p.prompt.replace('{task}', task);
              
              return (
                <div key={p.n} className={`phase ${isOpen ? 'open' : ''} ${isDone ? 'done' : ''}`}>
                  <button className="phase-head" onClick={() => togglePhase(p.n)}>
                    <span className="phase-n">{p.n}</span>
                    <span className="phase-t">{p.title}</span>
                    <span className="phase-tool">{p.tool}</span>
                    <button 
                      className={`phase-finish ${isDone ? 'done' : ''}`}
                      onClick={(e) => togglePhaseComplete(p.n, e)}
                    >
                      {isDone ? 'Виконано ✓' : 'закінчити фазу'}
                    </button>
                  </button>

                  {isOpen && (
                    <div className="phase-body fade-in">
                      <p className="phase-action">{p.action}</p>
                      
                      <div className="prompt" style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <div className="prompt-bar">
                          <span className="pb-l">{p.tool} промпт</span>
                          <div className="pb-r">
                            <span className="char-count">{phasePrompt.length} символів</span>
                            <button 
                              className="copy-btn" 
                              onClick={() => handleCopyPrompt(phasePrompt)}
                            >
                              <Icon.copy /> копіювати
                            </button>
                          </div>
                        </div>
                        <pre className="prompt-body">{phasePrompt}</pre>
                      </div>

                      <div className="phase-check">
                        <span className="pc-i"><Icon.check /></span>
                        <span><b>Перевірка фази:</b> {p.checkpoint}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Collapsible Level Up (⚡ Далі: потужніший шлях) */}
        {((step.levelUp && step.levelUp.length > 0) || step.nextPath) && (
          <div className="level-up-section" style={{ marginTop: '30px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
            <button 
              type="button" 
              onClick={() => setIsLevelUpExpanded(!isLevelUpExpanded)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: 'var(--text)',
                textAlign: 'left',
                outline: 'none',
                userSelect: 'none'
              }}
              className="level-up-header-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', color: 'var(--accent)' }}>⚡</span>
                <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--text)' }}>
                  Далі: потужніший шлях
                </span>
              </div>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                transform: isLevelUpExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                transition: 'transform 0.2s ease',
                color: 'var(--text-dim)' 
              }}>
                <Icon.chev style={{ width: '16px', height: '16px' }} />
              </span>
            </button>

            {isLevelUpExpanded && (
              <div className="fade-in">
                {step.levelUp && step.levelUp.length > 0 && (
                  <div className="level-up-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {step.levelUp.map((item, idx) => (
                      <div key={idx} className="level-up-item" style={{ padding: '12px 16px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: '8px', fontSize: '14px', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>⚡</span>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </div>
                    ))}
                  </div>
                )}
                
                {step.nextPath && (
                  <div className="next-body" dangerouslySetInnerHTML={{ __html: step.nextPath }} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR COMPONENT
   ============================================================ */
interface SidebarProps {
  step: Step;
  copy: AppCopy;
  status: string;
  resultUrl?: string;
  isNotInterested: boolean;
  onTake: () => void;
  onDone: () => void;
  onToggleNotInterested: () => void;
  relatedSteps: Step[];
  onSelectRelated: (id: string) => void;
  isAdmin: boolean;
  onEdit: () => void;
}

export function Sidebar({
  step, copy, status, resultUrl, isNotInterested,
  onTake, onDone, onToggleNotInterested, relatedSteps, onSelectRelated, isAdmin, onEdit
}: SidebarProps) {
  return (
    <div className="side-inner">
      <div className="side-actions" style={{ marginBottom: '24px' }}>
        {status === 'available' && (
          <>
            <button className="btn btn-primary btn-block" onClick={onTake}>
              {copy.step.takeBtn}
            </button>
            <button className="btn btn-ghost btn-block" onClick={onDone}>
              {copy.step.doneBtn}
            </button>
          </>
        )}

        {status === 'inprogress' && (
          <>
            <div className="status-banner prog" style={{ marginBottom: '12px' }}>
              <span className="sb-mark" style={{ marginRight: '8px' }}>◑</span>
              <span>в роботі</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={onDone}>
              {copy.step.doneBtn} <Icon.arrow style={{ marginLeft: '4px' }} />
            </button>
          </>
        )}

        {status === 'done' && (
          <div className="status-banner ok" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="sb-mark">✓</span>
              <span>Крок виконано</span>
            </div>
            {resultUrl && (
              <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="result-link" style={{ marginTop: '4px', width: '100%' }}>
                <span className="dl-label">Результат:</span>
                <span className="dl-file" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{resultUrl}</span>
                <span className="dl-arr">→</span>
              </a>
            )}
          </div>
        )}

        {status === 'available' && (
          <button 
            className={`not-interested ${isNotInterested ? 'active' : ''}`} 
            onClick={onToggleNotInterested}
          >
            {isNotInterested ? '✓ повернути в маршрут' : 'не цікаво'}
          </button>
        )}

        {isAdmin && (
          <button className="btn btn-ghost btn-block" onClick={onEdit} style={{ marginTop: '8px' }}>
            <Icon.edit /> Редагувати крок
          </button>
        )}
      </div>

      <div className="divider" />

      {/* RELATED STEPS */}
      {relatedSteps.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div className="side-block-h">{copy.step.alsoTryHeading}</div>
          <div className="related">
            {relatedSteps.map(r => (
              <button 
                key={r.id} 
                className="related-item btn-block" 
                onClick={() => onSelectRelated(r.id)}
              >
                <div className="ri-t">
                  {r.title}
                  <div className="ri-s">{r.subtitle}</div>
                </div>
                <span className="arr">→</span>
              </button>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}

/* ============================================================
   GALLERY VIEW COMPONENT
   ============================================================ */
interface GalleryViewProps {
  steps: Step[];
  copy: AppCopy;
  getStatus: (s: Step) => string;
  getStatusString: (s: Step) => string;
  onOpenCard: (id: string) => void;
  notInterested: Record<string, boolean>;
}

export function GalleryView({ steps, copy, getStatus, getStatusString, onOpenCard, notInterested }: GalleryViewProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('all');

  const visibleSteps = steps.filter(s => !notInterested[s.id]);

  const categories = [
    { value: 'all', label: 'Всі' },
    { value: 'research', label: 'Дослідження' },
    { value: 'proto', label: 'Прототипування' },
    { value: 'code', label: 'Код' },
    { value: 'plan', label: 'Планування' },
    { value: 'flow', label: 'Воркфлоу' },
  ];

  const tools = [
    { value: 'all', label: 'Всі' },
    { value: 'Claude.ai', label: 'Claude.ai' },
    { value: 'Claude Code', label: 'Claude Code' },
    { value: 'Figma Make', label: 'Figma Make' },
    { value: 'AI Studio', label: 'AI Studio' },
  ];

  const filteredSteps = visibleSteps.filter(s => {
    const catMatch = selectedCat === 'all' || s.cat === selectedCat;
    const toolMatch = selectedTool === 'all' || s.tool === selectedTool || (s.phases && s.phases.some(p => p.tool === selectedTool));
    return catMatch && toolMatch;
  });

  return (
    <div className="gallery">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-row">
          <span className="fr-l">Розділ:</span>
          {categories.map(c => (
            <button 
              key={c.value} 
              className={`chip ${selectedCat === c.value ? 'active' : ''}`}
              onClick={() => setSelectedCat(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <span className="fr-l">Інструмент:</span>
          {tools.map(t => (
            <button 
              key={t.value} 
              className={`chip ${selectedTool === t.value ? 'active' : ''}`}
              onClick={() => setSelectedTool(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of cards */}
      <div className="gallery-scroll scroll">
        <div className="gallery-inner">
          {filteredSteps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-mark">📭</div>
              <h2>{copy.gallery.emptyState}</h2>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredSteps.map(s => {
                const status = getStatus(s);
                const statusStr = getStatusString(s);
                return (
                  <button 
                    key={s.id} 
                    className={`card ${status === 'future' ? 'future' : ''}`} 
                    onClick={() => onOpenCard(s.id)}
                  >
                    <div className="card-top">
                      <span className="cat-label" style={{ color: CATS[s.cat].color }}>
                        {CATS[s.cat].label}
                      </span>
                      <span className="badge effort">{s.effort}</span>
                      <span className="badge kind">{s.kind === 'build' ? 'Збірка' : 'Простий'}</span>
                    </div>
                    
                    <h3 className="card-title">{s.title}</h3>
                    <p className="card-sub">{s.subtitle}</p>
                    <p className="card-doable">{s.doable}</p>

                    <div className="card-foot">
                      <div className="card-status">
                        {statusStr === 'done' && <span className="cs ok"><Icon.check style={{ width: 11, height: 11 }} /> виконано</span>}
                        {statusStr === 'inprogress' && <span className="cs prog">◑ в роботі</span>}
                      </div>
                      <span className="card-act">отримати промпт →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ACTIVE TASKS PAGE COMPONENT
   ============================================================ */
interface ActivePageProps {
  steps: Step[];
  copy: AppCopy;
  getStatus: (s: Step) => string;
  onOpenCard: (id: string) => void;
  onGoGallery: () => void;
}

export function ActivePage({ steps, copy, getStatus, onOpenCard, onGoGallery }: ActivePageProps) {
  const activeSteps = steps.filter(s => getStatus(s) === 'current');

  return (
    <div className="active-page">
      <div className="active-inner">
        <div className="active-head">
          <h1>{copy.progress.heading}</h1>
          <p>Ці кроки зараз знаходяться у вас в активній роботі.</p>
        </div>

        {activeSteps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-mark">🎯</div>
            <h2>{copy.progress.emptyState}</h2>
            <p>Виберіть відповідні завдання з галереї та візьміть їх у роботу для старту.</p>
            <button className="btn btn-primary" onClick={onGoGallery}>
              {copy.progress.toGalleryBtn}
            </button>
          </div>
        ) : (
          <div className="gallery-grid">
            {activeSteps.map(s => (
              <button 
                key={s.id} 
                className="card" 
                onClick={() => onOpenCard(s.id)}
              >
                <div className="card-top">
                  <span className="cat-label" style={{ color: CATS[s.cat].color }}>
                    {CATS[s.cat].label}
                  </span>
                  <span className="badge effort">{s.effort}</span>
                </div>
                
                <h3 className="card-title">{s.title}</h3>
                <p className="card-sub">{s.subtitle}</p>
                <p className="card-doable">{s.doable}</p>

                <div className="card-foot">
                  <div className="card-status">
                    <span className="cs prog">◑ в роботі</span>
                  </div>
                  <span className="card-act">переглянути гайд →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STEP DETAILS MODAL DIALOG
   ============================================================ */
interface StepModalProps {
  stepId: string;
  steps: Step[];
  copy: AppCopy;
  getStatus: (s: Step) => string;
  getStatusString: (s: Step) => string;
  takeInWork: (id: string) => void;
  results: Record<string, string>;
  notInterested: Record<string, boolean>;
  toggleNotInterested: (id: string) => void;
  setSaveFor: (id: string | null) => void;
  onClose: () => void;
  isAdmin: boolean;
  setEditStepId: (id: string | null) => void;
  onSelectRelated: (id: string) => void;
}

function StepModal({
  stepId, steps, copy, getStatus, getStatusString, takeInWork,
  results, notInterested, toggleNotInterested, setSaveFor, onClose, isAdmin, setEditStepId,
  onSelectRelated
}: StepModalProps) {
  const step = steps.find(s => s.id === stepId);
  if (!step) return null;

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} title="закрити">
          <Icon.close />
        </button>

        <div className="modal-main scroll">
          <StepContent 
            step={step} 
            copy={copy} 
            getStatusString={getStatusString} 
          />
        </div>

        <div className="modal-side">
          <Sidebar 
            step={step} 
            copy={copy}
            status={getStatusString(step)} 
            resultUrl={results[step.id]}
            isNotInterested={!!notInterested[step.id]}
            onTake={() => takeInWork(step.id)}
            onDone={() => setSaveFor(step.id)}
            onToggleNotInterested={() => toggleNotInterested(step.id)}
            relatedSteps={steps.filter(s => step.related.includes(s.id))}
            onSelectRelated={onSelectRelated}
            isAdmin={isAdmin}
            onEdit={() => { setEditStepId(step.id); onClose(); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SAVE URL MODAL DIALOG
   ============================================================ */
interface SaveModalProps {
  stepId: string;
  copy: AppCopy;
  onClose: () => void;
  onSave: (url: string) => void;
}

export function SaveModal({ stepId, copy, onClose, onSave }: SaveModalProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(url.trim());
  };

  return (
    <div className="save-scrim" onClick={onClose}>
      <div className="save-modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn sm-close" onClick={onClose}>
          <Icon.close />
        </button>

        <div className="sm-mark">Готово!</div>
        <h2>{copy.done.heading}</h2>
        <p className="sm-sub">Вітаємо із завершенням кроку. Збережіть посилання на ваш результат для команди.</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="resultUrl">{copy.done.urlLabel}</label>
          <input 
            id="resultUrl"
            type="url" 
            className="field-input" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://figma.com/... або https://github.com/..."
            autoComplete="off"
          />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn btn-primary">{copy.done.saveBtn}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   SUCCESS CELEBRATION PAGE (replaces shell)
   ============================================================ */
interface DonePageProps {
  stepId: string;
  steps: Step[];
  copy: AppCopy;
  results: Record<string, string>;
  onMap: (id?: string) => void;
  onOpenStep: (id: string) => void;
}

export function DonePage({ stepId, steps, copy, results, onMap, onOpenStep }: DonePageProps) {
  const step = steps.find(s => s.id === stepId);
  if (!step) return null;

  const url = results[stepId];
  const relatedSteps = steps.filter(s => step.related.includes(s.id));

  return (
    <div className="done-page fade-in">
      <div className="done-top">
        <div className="wordmark">
          <span className="dot">·</span>
          <span className="it">{copy.global.headerLogo}</span>
        </div>
      </div>

      <div className="done-stage scroll">
        <div className="done-inner">
          <div className="done-eyebrow">
            <span className="check" style={{ color: 'var(--ok)' }}><Icon.check /></span>
            <span>КРОК УСПІШНО ЗАВЕРШЕНО</span>
          </div>

          <h1 className="done-name">{step.title}</h1>

          {url && (
            <div className="done-result">
              <span className="dr-l">URL результату:</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="dr-v" style={{ textDecoration: 'underline' }}>
                {url}
              </a>
            </div>
          )}

          {/* Share links */}
          <div className="share-row">
            <a 
              className="share-btn" 
              href={`https://wa.me/?text=${encodeURIComponent(`Я щойно виконала крок з AI: ${step.title}! ${url || ''}`)}`}
              target="_blank" rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a 
              className="share-btn" 
              href={`https://t.me/share/url?url=${encodeURIComponent(url || 'https://it-depends.vercel.app')}&text=${encodeURIComponent(`Я щойно виконала крок з AI: ${step.title}!`)}`}
              target="_blank" rel="noopener noreferrer"
            >
              Telegram
            </a>
            <a 
              className="share-btn" 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url || 'https://it-depends.vercel.app')}`}
              target="_blank" rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="done-cta">
            <button className="btn btn-primary" onClick={() => onMap(stepId)}>
              {copy.done.mapBtn}
            </button>
          </div>

          {/* Related steps */}
          {relatedSteps.length > 0 && (
            <div className="also-try">
              <div className="at-h">{copy.step.alsoTryHeading}</div>
              <div className="also-grid">
                {relatedSteps.map(r => (
                  <button 
                    key={r.id} 
                    className="card"
                    onClick={() => onOpenStep(r.id)}
                  >
                    <div className="card-top">
                      <span className="cat-label" style={{ color: CATS[r.cat].color }}>
                        {CATS[r.cat].label}
                      </span>
                      <span className="badge effort">{r.effort}</span>
                    </div>
                    <h3 className="card-title">{r.title}</h3>
                    <p className="card-sub">{r.subtitle}</p>
                    <span className="card-act" style={{ marginTop: 'auto', paddingTop: '8px' }}>переглянути →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TWEAKS PANEL VIEW
   ============================================================ */
interface TweaksPanelProps {
  tweaks: { accent: string; headFont: string; width: string; style: string };
  setTweaks: React.Dispatch<React.SetStateAction<any>>;
  onReset: () => void;
  onClose: () => void;
}

export function TweaksPanel({ tweaks, setTweaks, onReset, onClose }: TweaksPanelProps) {
  return (
    <div className="twk-panel">
      <div className="twk-hd" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', cursor: 'default' }}>
        <b>⚙️ Налаштування вигляду</b>
        <button className="twk-x" onClick={onClose}>✕</button>
      </div>
      <div className="twk-body" style={{ padding: '14px' }}>
        
        {/* Accent Color Selection */}
        <div className="twk-row">
          <div className="twk-lbl"><span>Колір акценту</span></div>
          <div className="twk-chips" style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {ACCENTS.map(a => {
              const on = a.hex === tweaks.accent;
              return (
                <button 
                  key={a.key} 
                  type="button" 
                  className="twk-chip"
                  data-on={on ? '1' : '0'} 
                  style={{ background: a.hex, height: '30px', width: '30px', borderRadius: '50%', flex: '0 0 30px', boxShadow: on ? '0 0 0 2px #1a1a19, 0 0 0 4px ' + a.hex : '' }}
                  onClick={() => setTweaks((prev: any) => ({ ...prev, accent: a.hex }))}
                />
              );
            })}
          </div>
        </div>

        <div className="divider" style={{ margin: '10px 0' }} />

        {/* Heading Font Selection */}
        <div className="twk-row">
          <div className="twk-lbl"><span>Шрифт заголовків</span></div>
          <select 
            className="twk-field" 
            style={{ marginTop: '4px', height: '30px', borderRadius: '6px', padding: '0 8px' }}
            value={tweaks.headFont} 
            onChange={(e) => setTweaks((prev: any) => ({ ...prev, headFont: e.target.value }))}
          >
            {HEAD_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="divider" style={{ margin: '10px 0' }} />

        {/* Width selection */}
        <div className="twk-row">
          <div className="twk-lbl"><span>Ширина екрану</span></div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {['повна', 'фікс'].map(w => (
              <button 
                key={w}
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '6px', fontSize: '11px', background: tweaks.width === w ? 'var(--accent)' : '', color: tweaks.width === w ? 'var(--accent-ink)' : '' }}
                onClick={() => setTweaks((prev: any) => ({ ...prev, width: w }))}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: '10px 0' }} />

        {/* Style Variant selection */}
        <div className="twk-row">
          <div className="twk-lbl"><span>Стиль</span></div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {['стримано', 'експес'].map(s => (
              <button 
                key={s}
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '6px', fontSize: '11px', background: tweaks.style === s ? 'var(--accent)' : '', color: tweaks.style === s ? 'var(--accent-ink)' : '' }}
                onClick={() => setTweaks((prev: any) => ({ ...prev, style: s }))}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: '10px 0' }} />

        <button 
          className="btn btn-block btn-ghost" 
          style={{ fontSize: '11px', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '6px' }}
          onClick={onReset}
        >
          Скинути весь прогрес
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN CMS MICROCOPY DRAWER
   ============================================================ */
interface CopyDrawerProps {
  copy: AppCopy;
  onSave: (c: AppCopy) => void;
  onClose: () => void;
}

export function CopyDrawer({ copy, onSave, onClose }: CopyDrawerProps) {
  const [draft, setDraft] = useState<AppCopy>({ ...copy });
  const [activeTab, setActiveTab] = useState<'global' | 'step' | 'done' | 'progress'>('global');

  const handleFieldChange = (section: keyof AppCopy, field: string, val: string) => {
    setDraft((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: val
      }
    }));
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="scrim" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={onClose}>
      <div 
        className="modal-side scroll" 
        style={{ width: '480px', height: '100vh', background: 'var(--bg-1)', borderLeft: '1px solid var(--line-strong)', padding: '24px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px' }}>✏️ Копі Drawer (CMS)</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tabs" style={{ marginBottom: '18px', width: '100%' }}>
          {(['global', 'step', 'done', 'progress'] as const).map(t => (
            <button 
              key={t}
              className={`tab ${activeTab === t ? 'active' : ''}`}
              style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {Object.keys(draft[activeTab] || {}).map(field => (
            <div key={field} className="twk-row">
              <label className="field-label" style={{ fontSize: '11px' }}>{field.toUpperCase()}</label>
              <textarea 
                className="field-input" 
                style={{ minHeight: '60px', marginBottom: 0, padding: '8px' }}
                value={(draft[activeTab] as any)[field] || ''}
                onChange={(e) => handleFieldChange(activeTab, field, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Скасувати</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Зберегти тексти</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN ADD NEW STEP DIALOG
   ============================================================ */
interface AddStepModalProps {
  onAdd: (step: Step) => void;
  onClose: () => void;
}

export function AddStepModal({ onAdd, onClose }: AddStepModalProps) {
  const [stage, setStage] = useState(1); // Step 1: core, Step 2: guide
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cat: 'research' as StepCategory,
    kind: 'simple' as 'simple' | 'build',
    effort: '5 хв',
    promise: 'Ти отримаєш ',
    usedWhen: 'Після ',
    toolName: 'Claude.ai',
    defaultTask: 'Маю ',
    prompt: '',
    howto: '',
    checkpoint: 'Якщо '
  });

  const handleInputChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (!formData.title || !formData.subtitle) {
      alert('Будь ласка, заповніть заголовок та підзаголовок!');
      return;
    }
    setStage(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStep: Step = {
      id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: formData.title,
      subtitle: formData.subtitle,
      cat: formData.cat,
      tool: formData.toolName,
      kind: formData.kind,
      effort: formData.effort,
      layer: formData.kind === 'build' ? 2 : 1,
      state: 'avail',
      doable: formData.subtitle,
      promise: formData.promise,
      usedWhen: formData.usedWhen,
      toolName: formData.toolName,
      defaultTask: formData.defaultTask,
      prompt: formData.kind === 'simple' ? formData.prompt : '',
      howto: formData.kind === 'simple' ? formData.howto.split('\n').filter(h => h.trim() !== '') : [],
      checkpoint: formData.kind === 'simple' ? formData.checkpoint : '',
      related: [],
      notes: [],
      phases: formData.kind === 'build' ? [
        {
          n: 1,
          title: "Перша фаза",
          tool: "Claude.ai",
          action: "Опишіть вашу задачу.",
          checkpoint: "Отримано першу версію.",
          task: "Зробіть першу задачу.",
          prompt: "Промпт першої фази"
        }
      ] : undefined
    };

    onAdd(newStep);
  };

  return (
    <div className="save-scrim" onClick={onClose}>
      <div className="save-modal" style={{ width: '560px' }} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn sm-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>➕ Додати новий крок</h2>
        <p className="sm-sub" style={{ marginBottom: '18px' }}>Крок {stage} з 2</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stage === 1 ? (
            <>
              <div className="twk-row">
                <label className="field-label">ЗАГОЛОВОК</label>
                <input 
                  type="text" className="field-input" style={{ marginBottom: 0 }}
                  value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="напр. Розшифрувати бриф" required
                />
              </div>

              <div className="twk-row">
                <label className="field-label">ПІДЗАГОЛОВОК (КОРОТКИЙ ОПИС)</label>
                <input 
                  type="text" className="field-input" style={{ marginBottom: 0 }}
                  value={formData.subtitle} onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="напр. Текст брифу → структуроване ТЗ" required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="twk-row" style={{ flex: 1 }}>
                  <label className="field-label">РОЗДІЛ (КАТЕГОРІЯ)</label>
                  <select 
                    className="twk-field" style={{ height: '38px', borderRadius: '8px' }}
                    value={formData.cat} onChange={(e) => handleInputChange('cat', e.target.value)}
                  >
                    {Object.keys(CATS).map(c => <option key={c} value={c}>{(CATS as any)[c].label}</option>)}
                  </select>
                </div>

                <div className="twk-row" style={{ flex: 1 }}>
                  <label className="field-label">Складність (Effort)</label>
                  <input 
                    type="text" className="field-input" style={{ marginBottom: 0 }}
                    value={formData.effort} onChange={(e) => handleInputChange('effort', e.target.value)}
                    placeholder="5 хв / 20 хв" required
                  />
                </div>
              </div>

              <div className="twk-row">
                <label className="field-label">ТИП КРОКУ</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['simple', 'build'].map(k => (
                    <button 
                      key={k} type="button" className="btn btn-ghost" 
                      style={{ flex: 1, padding: '8px', fontSize: '12px', background: formData.kind === k ? 'var(--accent)' : '', color: formData.kind === k ? 'var(--accent-ink)' : '' }}
                      onClick={() => handleInputChange('kind', k)}
                    >
                      {k === 'simple' ? 'Простий (один промпт)' : 'Збірка (кілька фаз)'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button type="button" className="btn btn-ghost" onClick={onClose}>Скасувати</button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>Далі →</button>
              </div>
            </>
          ) : (
            <>
              <div className="twk-row">
                <label className="field-label">ОБІЦЯНКА (PROMISE)</label>
                <input 
                  type="text" className="field-input" style={{ marginBottom: 0 }}
                  value={formData.promise} onChange={(e) => handleInputChange('promise', e.target.value)}
                  placeholder="напр. Ти отримаєш ТЗ, яке..." required
                />
              </div>

              <div className="twk-row">
                <label className="field-label">ПРАКТИЧНЕ ВИКОРИСТАННЯ (USED WHEN)</label>
                <input 
                  type="text" className="field-input" style={{ marginBottom: 0 }}
                  value={formData.usedWhen} onChange={(e) => handleInputChange('usedWhen', e.target.value)}
                  placeholder="напр. Коли клієнт приніс бриф..." required
                />
              </div>

              <div className="twk-row">
                <label className="field-label">ДЕФОЛТНА ЗАДАЧА</label>
                <textarea 
                  className="field-input" style={{ minHeight: '50px', marginBottom: 0 }}
                  value={formData.defaultTask} onChange={(e) => handleInputChange('defaultTask', e.target.value)}
                  required
                />
              </div>

              {formData.kind === 'simple' ? (
                <>
                  <div className="twk-row">
                    <label className="field-label">ПРОМПТ-ШАБЛОН (ВСТАВТЕ {"{task}"} ДЛЯ ЗАДАЧІ)</label>
                    <textarea 
                      className="field-input mono" style={{ minHeight: '90px', marginBottom: 0, fontSize: '12px' }}
                      value={formData.prompt} onChange={(e) => handleInputChange('prompt', e.target.value)}
                      placeholder="Ти AI асистент...\n\n{task}" required
                    />
                  </div>

                  <div className="twk-row">
                    <label className="field-label">ЯК ЦЕ ПІДЕ (ПО РЯДКУ НА КРОК)</label>
                    <textarea 
                      className="field-input" style={{ minHeight: '60px', marginBottom: 0 }}
                      value={formData.howto} onChange={(e) => handleInputChange('howto', e.target.value)}
                      placeholder="Встав бриф у чат\nОтримай готове ТЗ..." required
                    />
                  </div>
                </>
              ) : (
                <div className="status-banner prog" style={{ fontSize: '12px', padding: '10px' }}>
                  Для кроків-збірок буде автоматично створена перша базова фаза. Інші фази ви зможете детально налаштувати через редагування кроку.
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStage(1)}>Назад</button>
                <button type="submit" className="btn btn-primary">Створити крок</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN EDIT STEP DIALOG
   ============================================================ */
interface EditStepModalProps {
  step: Step;
  onSave: (step: Step) => void;
  onClose: () => void;
}

export function EditStepModal({ step, onSave, onClose }: EditStepModalProps) {
  const [formData, setFormData] = useState({ ...step });
  const [hasAuthorExample, setHasAuthorExample] = useState(!!step.authorExample || !!step.author);
  const [hasLevelUp, setHasLevelUp] = useState(!!(step.levelUp && step.levelUp.length > 0));

  const handleFieldChange = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handlePhaseFieldChange = (idx: number, field: string, val: any) => {
    if (!formData.phases) return;
    const nextPhases = formData.phases.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    setFormData(prev => ({ ...prev, phases: nextPhases }));
  };

  const handleAddPhase = () => {
    const nextPhases = [...(formData.phases || [])];
    const n = nextPhases.length + 1;
    nextPhases.push({
      n,
      title: `Фаза ${n}`,
      tool: "Claude.ai",
      action: "Нова фаза.",
      checkpoint: "Готово.",
      task: "Нова задача.",
      prompt: "Промпт нової фази."
    });
    setFormData(prev => ({ ...prev, phases: nextPhases }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    
    if (!hasAuthorExample) {
      delete finalData.author;
      delete finalData.authorExample;
    } else {
      if (finalData.author && finalData.author.trim() === '') {
        delete finalData.author;
      }
      if (!finalData.authorExample) {
        finalData.authorExample = { type: 'link', url: '', label: '' };
      }
    }

    if (!hasLevelUp) {
      delete finalData.levelUp;
    } else {
      if (!finalData.levelUp) {
        finalData.levelUp = [];
      }
      finalData.levelUp = finalData.levelUp.filter(x => x.trim() !== '');
    }

    onSave(finalData);
  };

  return (
    <div className="save-scrim" onClick={onClose}>
      <div className="save-modal scroll" style={{ width: '640px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn sm-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize: '20px', marginBottom: '14px' }}>✏️ Редагувати крок</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="twk-row">
            <label className="field-label">ЗАГОЛОВОК</label>
            <input 
              type="text" className="field-input" style={{ marginBottom: 0 }}
              value={formData.title} onChange={(e) => handleFieldChange('title', e.target.value)}
              required
            />
          </div>

          <div className="twk-row">
            <label className="field-label">ПІДЗАГОЛОВОК (КОРОТКИЙ ОПИС)</label>
            <input 
              type="text" className="field-input" style={{ marginBottom: 0 }}
              value={formData.subtitle} onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              required
            />
          </div>

          <div className="twk-row">
            <label className="field-label">ОБІЦЯНКА (PROMISE)</label>
            <textarea 
              className="field-input" style={{ minHeight: '50px', marginBottom: 0 }}
              value={formData.promise} onChange={(e) => handleFieldChange('promise', e.target.value)}
              required
            />
          </div>

          <div className="twk-row">
            <label className="field-label">ПРАКТИЧНЕ ВИКОРИСТАННЯ (USED WHEN)</label>
            <input 
              type="text" className="field-input" style={{ marginBottom: 0 }}
              value={formData.usedWhen} onChange={(e) => handleFieldChange('usedWhen', e.target.value)}
              required
            />
          </div>

          <div className="twk-row">
            <label className="field-label">ДЕФОЛТНА ЗАДАЧА</label>
            <textarea 
              className="field-input" style={{ minHeight: '50px', marginBottom: 0 }}
              value={formData.defaultTask} onChange={(e) => handleFieldChange('defaultTask', e.target.value)}
              required
            />
          </div>

          {formData.kind === 'simple' ? (
            <>
              <div className="twk-row">
                <label className="field-label">ПРОМПТ-ШАБЛОН</label>
                <textarea 
                  className="field-input mono" style={{ minHeight: '100px', marginBottom: 0, fontSize: '12px' }}
                  value={formData.prompt || ''} onChange={(e) => handleFieldChange('prompt', e.target.value)}
                  required
                />
              </div>

              <div className="twk-row">
                <label className="field-label">ЧЕКПОІНТ (ПЕРЕВІРКА КРОКУ)</label>
                <input 
                  type="text" className="field-input" style={{ marginBottom: 0 }}
                  value={formData.checkpoint || ''} onChange={(e) => handleFieldChange('checkpoint', e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="twk-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="field-label" style={{ marginBottom: 0 }}>ЕТАПИ ЗБІРКИ (PHASES)</label>
                <button type="button" className="task-gen" onClick={handleAddPhase}>
                  + Додати фазу
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {formData.phases?.map((p, idx) => (
                  <div key={idx} style={{ padding: '12px', border: '1px solid var(--line-strong)', borderRadius: '8px', background: 'var(--bg-2)' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input 
                        type="text" className="field-input" style={{ flex: 1, marginBottom: 0, fontSize: '13px' }}
                        value={p.title} onChange={(e) => handlePhaseFieldChange(idx, 'title', e.target.value)}
                        placeholder="Назва фази" required
                      />
                      <input 
                        type="text" className="field-input" style={{ width: '120px', marginBottom: 0, fontSize: '13px' }}
                        value={p.tool} onChange={(e) => handlePhaseFieldChange(idx, 'tool', e.target.value)}
                        placeholder="Tool" required
                      />
                    </div>

                    <textarea 
                      className="field-input" style={{ minHeight: '40px', marginBottom: '8px', fontSize: '12.5px' }}
                      value={p.action} onChange={(e) => handlePhaseFieldChange(idx, 'action', e.target.value)}
                      placeholder="Інструкція (Action)" required
                    />

                    <textarea 
                      className="field-input mono" style={{ minHeight: '60px', marginBottom: '8px', fontSize: '11.5px' }}
                      value={p.prompt} onChange={(e) => handlePhaseFieldChange(idx, 'prompt', e.target.value)}
                      placeholder="Промпт фази" required
                    />

                    <input 
                      type="text" className="field-input" style={{ marginBottom: 0, fontSize: '12.5px' }}
                      value={p.checkpoint} onChange={(e) => handlePhaseFieldChange(idx, 'checkpoint', e.target.value)}
                      placeholder="Чекпоінт" required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPTIONAL SECTIONS TOGGLES */}
          <div style={{ height: '1px', background: 'var(--line)', margin: '10px 0' }}></div>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>Опційні секції</h3>

          <div style={{ display: 'flex', gap: '14px' }}>
            {/* Toggle Author Example */}
            <div className="toggle-row" style={{ padding: '10px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg-2)', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="field-label" style={{ marginBottom: 0, textTransform: 'none', letterSpacing: 'normal', fontSize: '13px' }}>
                👥 Досвід колег (відгук + приклад)
              </span>
              <button 
                type="button" 
                className={`switch ${hasAuthorExample ? 'on' : ''}`} 
                onClick={() => {
                  const nextVal = !hasAuthorExample;
                  setHasAuthorExample(nextVal);
                  if (nextVal && !formData.authorExample) {
                    setFormData(prev => ({
                      ...prev,
                      authorExample: { type: 'link', url: '', label: '' }
                    }));
                  }
                }}
              />
            </div>

            {/* Toggle Level Up */}
            <div className="toggle-row" style={{ padding: '10px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: 'var(--bg-2)', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="field-label" style={{ marginBottom: 0, textTransform: 'none', letterSpacing: 'normal', fontSize: '13px' }}>
                ⚡ Рівень вище (Level Up)
              </span>
              <button 
                type="button" 
                className={`switch ${hasLevelUp ? 'on' : ''}`} 
                onClick={() => {
                  const nextVal = !hasLevelUp;
                  setHasLevelUp(nextVal);
                  if (nextVal && (!formData.levelUp || formData.levelUp.length === 0)) {
                    setFormData(prev => ({
                      ...prev,
                      levelUp: [""]
                    }));
                  }
                }}
              />
            </div>
          </div>

          {/* Author Example Fields */}
          {hasAuthorExample && (
            <div style={{ padding: '14px', border: '1px solid var(--line-strong)', borderRadius: '8px', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Налаштування досвіду колег</div>
              
              <div>
                <label className="field-label">Цитата/відгук від колеги (author)</label>
                <textarea 
                  className="field-input" style={{ minHeight: '50px', marginBottom: 0, fontSize: '13px' }}
                  value={formData.author || ''} 
                  onChange={(e) => handleFieldChange('author', e.target.value)}
                  placeholder="напр. Так Марина зібрала онбординг за вечір замість тижня узгоджень."
                />
              </div>

              <div style={{ borderTop: '1px solid var(--line)', margin: '4px 0' }}></div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-2)' }}>Вкладений приклад (артефакт)</div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Тип прикладу</label>
                  <select 
                    className="twk-field" style={{ height: '38px', borderRadius: '8px', width: '100%', padding: '0 8px', background: 'var(--bg-3)', border: '1px solid var(--line)', color: 'var(--text)' }}
                    value={formData.authorExample?.type || 'link'}
                    onChange={(e) => {
                      const val = e.target.value as 'image' | 'link';
                      setFormData(prev => ({
                        ...prev,
                        authorExample: {
                          ...(prev.authorExample || { type: 'link', url: '', label: '' }),
                          type: val
                        }
                      }));
                    }}
                  >
                    <option value="link">🔗 Посилання (link)</option>
                    <option value="image">📷 Зображення (image)</option>
                  </select>
                </div>

                <div style={{ flex: 2 }}>
                  <label className="field-label">Текст посилання / підпис</label>
                  <input 
                    type="text" className="field-input" style={{ marginBottom: 0 }}
                    value={formData.authorExample?.label || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        authorExample: {
                          ...(prev.authorExample || { type: 'link', url: '', label: '' }),
                          label: val
                        }
                      }));
                    }}
                    placeholder={formData.authorExample?.type === 'image' ? "напр. Результат роботи" : "напр. Дивитись на Figma"}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">URL посилання або зображення</label>
                <input 
                  type="text" className="field-input" style={{ marginBottom: 0 }}
                  value={formData.authorExample?.url || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      authorExample: {
                        ...(prev.authorExample || { type: 'link', url: '', label: '' }),
                        url: val
                      }
                    }));
                  }}
                  placeholder="https://..."
                  required={hasAuthorExample}
                />
              </div>
            </div>
          )}

          {/* Level Up Fields */}
          {hasLevelUp && (
            <div style={{ padding: '14px', border: '1px solid var(--line-strong)', borderRadius: '8px', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>⚡ Пункти Level Up</div>
                <button type="button" className="task-gen" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    levelUp: [...(prev.levelUp || []), '']
                  }));
                }}>
                  + Додати пункт
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(formData.levelUp || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text" className="field-input" style={{ flex: 1, marginBottom: 0, fontSize: '12.5px' }}
                      value={item}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => {
                          const nextLevelUp = [...(prev.levelUp || [])];
                          nextLevelUp[idx] = val;
                          return { ...prev, levelUp: nextLevelUp };
                        });
                      }}
                      placeholder={`Пункт ${idx + 1}`}
                      required={hasLevelUp}
                    />
                    <button 
                      type="button" 
                      className="icon-btn" 
                      style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-3)', color: 'var(--error, #ff6b6b)' }}
                      onClick={() => {
                        setFormData(prev => {
                          const nextLevelUp = (prev.levelUp || []).filter((_, i) => i !== idx);
                          return { ...prev, levelUp: nextLevelUp };
                        });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {(formData.levelUp || []).length === 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontStyle: 'italic' }}>Немає доданих пунктів. Додайте перший пункт.</div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn btn-primary">Зберегти зміни</button>
          </div>
        </form>
      </div>
    </div>
  );
}
