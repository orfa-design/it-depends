'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useV2Data } from './V2DataContext';
import { Icon, ACCENTS, HEAD_FONTS, TweaksPanel, CopyDrawer, AddStepModal, SaveModal } from './V2ClientApp';
import { type Step } from '@/lib/data-v2';

export default function V2AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    username,
    isAdmin,
    steps,
    copy,
    progress,
    nextStep,
    showAddModal,
    setShowAddModal,
    showCopyDrawer,
    setShowCopyDrawer,
    syncStepsList,
    syncCopyContent,
    markStepDone,
    resetProgress,
    getStatus
  } = useV2Data();

  // Theme & Tweaks settings
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showTweaks, setShowTweaks] = useState(false);
  const [tweaks, setTweaks] = useState({
    accent: '#f5a623',
    headFont: 'Unbounded',
    width: 'full',
    style: 'calm'
  });

  const [saveFor, setSaveFor] = useState<string | null>(null);

  // Active in-progress tasks count
  const activeCount = steps.filter(s => getStatus(s) === 'current').length;

  // Initialize theme choice
  useEffect(() => {
    const storedTheme = localStorage.getItem('id_theme');
    if (storedTheme === 'light') {
      setTheme('light');
    }
  }, []);

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

  const appCls = `app width-${tweaks.width === 'fixed' ? 'fixed' : 'full'} style-${tweaks.style === 'exp' ? 'exp' : 'calm'}`;

  const handlePathTab = () => {
    router.push(nextStep ? `/v2/step/${nextStep.id}` : '/v2/map');
  };

  const handleResetAll = async () => {
    if (confirm('Reset all your progress and start over?')) {
      await resetProgress();
    }
  };

  const handleAddStepCMS = async (newStep: Step) => {
    const updatedSteps = [...steps, newStep];
    await syncStepsList(updatedSteps);
    setShowAddModal(false);
  };

  const handleSaveCopyCMS = async (updatedCopy: any) => {
    await syncCopyContent(updatedCopy);
    setShowCopyDrawer(false);
  };

  const handleMarkDone = async (url: string) => {
    if (saveFor) {
      await markStepDone(saveFor, url);
      const finishedId = saveFor;
      setSaveFor(null);
      router.push(`/v2/step/${finishedId}/done`);
    }
  };

  // Determine active tab key based on pathname
  let tab: 'path' | 'gallery' | 'active' = 'path';
  if (pathname.includes('/gallery')) tab = 'gallery';
  else if (pathname.includes('/progress')) tab = 'active';

  if (!username) return null;

  return (
    <div className={appCls}>
      {/* HEADER */}
      <header className="header">
        <div className="wordmark" onClick={() => router.push('/v2')} style={{ cursor: 'pointer' }}>
          <span className="dot">·</span>
          <span className="it">{copy.global.headerLogo}</span>
          {isAdmin && <span style={{ fontSize: '10px', background: 'var(--accent)', color: 'var(--accent-ink)', padding: '2px 5px', borderRadius: '4px', marginLeft: '6px' }}>ADMIN</span>}
        </div>

        <nav className="tabs">
          <button
            className={"tab" + (tab === "path" ? " active" : "")}
            onClick={handlePathTab}
          >
            Path
          </button>
          <button
            className={"tab" + (tab === "gallery" ? " active" : "")}
            onClick={() => router.push('/v2/gallery')}
          >
            Gallery
          </button>
        </nav>

        <div className="header-right">
          <button 
            className={"h-counter" + (activeCount === 0 ? " empty" : "")} 
            onClick={() => router.push('/v2/progress')}
            title="active tasks"
          >
            <span className="n">{activeCount}</span>
            <span>active</span>
          </button>
          
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
          <span className="h-user" onClick={() => router.push('/v2/login')} style={{ cursor: 'pointer' }}>{username}</span>
          <button className="icon-btn" onClick={handleResetAll} title="rebuild path">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="theme">
            {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
          </button>
        </div>
      </header>

      {/* RENDER BODY */}
      <div className="body">
        {/* Pass down local page states via clone / context if necessary, but route components take from V2DataContext */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type === 'function') {
            return React.cloneElement(child as React.ReactElement<any>, { setSaveFor });
          }
          return child;
        })}
      </div>

      {/* SAVE PROGRESS MODAL */}
      {saveFor && (
        <SaveModal 
          stepId={saveFor} 
          copy={copy} 
          onClose={() => setSaveFor(null)} 
          onSave={handleMarkDone} 
        />
      )}

      {/* TWEAKS PRESET TOGGLER */}
      <button 
        className="icon-btn" 
        style={{ position: 'fixed', right: '16px', bottom: '16px', zIndex: 100, background: 'var(--bg-2)', border: '1px solid var(--line-strong)' }}
        onClick={() => setShowTweaks(!showTweaks)}
        title="Appearance settings"
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

      {/* ADMIN CMS DRAWERS */}
      {showCopyDrawer && (
        <CopyDrawer 
          copy={copy} 
          onSave={handleSaveCopyCMS} 
          onClose={() => setShowCopyDrawer(false)} 
        />
      )}

      {showAddModal && (
        <AddStepModal 
          onAdd={handleAddStepCMS} 
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
}
