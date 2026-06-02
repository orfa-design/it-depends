'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../V2DataContext';
import { CALIBRATION_CARDS, type CalibrationCard, type StepCategory, CATS } from '@/lib/data-v2';

// Shared Icons
const Icon = {
  arrow: (props: any) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
};

const EFFORT_LABELS = {
  quick: "one session",
  iterative: "iterative",
  project: "multi-session project",
};

export default function CalibratePage() {
  const router = useRouter();
  
  const {
    username,
    copy,
    progress,
    resetProgress
  } = useV2Data();

  const [screen, setScreen] = useState<'intro' | 'calibrate' | 'analysis'>('intro');
  const [currentCardId, setCurrentCardId] = useState<string>('anya');
  const [history, setHistory] = useState<string[]>(['anya']);
  const [reactions, setReactions] = useState<Record<string, 'wow' | 'heard' | 'skip'>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      router.push('/v2/login');
    }
  }, [username, router]);

  const handleStart = () => {
    setScreen('calibrate');
  };

  const handleSkip = () => {
    try {
      if (username) {
        localStorage.setItem(`id_calibrated_${username.toLowerCase().trim()}`, 'skipped');
      } else {
        localStorage.setItem('id_calibrated', 'skipped');
      }
      router.push('/v2/map');
    } catch (err: any) {
      setErrorLog(`Calibration skip error: ${err.message || err}`);
    }
  };

  const handleReact = useCallback((reactionIndex: number) => {
    if (picked !== null) return;
    setPicked(reactionIndex);

    const reactionKey: 'wow' | 'heard' | 'skip' = 
      reactionIndex === 0 ? 'wow' : reactionIndex === 1 ? 'heard' : 'skip';

    const card = CALIBRATION_CARDS.find(c => c.id === currentCardId);
    if (!card) return;

    const nextReactions = { ...reactions, [currentCardId]: reactionKey };
    setReactions(nextReactions);

    setTimeout(() => {
      setPicked(null);
      
      // Spec: 3 questions/cards visited
      if (history.length >= 3) {
        setScreen('analysis');
      } else {
        const nextCardId = card.next[reactionKey];
        // Prevent cyclic loop if nextId is already in history, fallback to find next unvisited card
        let pickId = nextCardId;
        if (history.includes(pickId)) {
          const unvisited = CALIBRATION_CARDS.find(c => !history.includes(c.id));
          pickId = unvisited ? unvisited.id : CALIBRATION_CARDS[0].id;
        }

        setCurrentCardId(pickId);
        setHistory(prev => [...prev, pickId]);
      }
    }, 360);
  }, [picked, reactions, currentCardId, history]);

  // Bind key inputs for 1, 2, 3
  useEffect(() => {
    if (screen !== 'calibrate') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3'].includes(e.key)) {
        handleReact(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleReact]);

  const handleFinishCalibration = async () => {
    if (username) {
      try {
        // Fetch current user progress
        const res = await fetch(`/api/v2/user?username=${encodeURIComponent(username)}`);
        let currentProgress = { 
          overrides: {}, 
          results: {}, 
          calibrationReactions: {}, 
          notInterested: {},
          tasks: {}
        };
        if (res.ok) {
          currentProgress = await res.json();
        }
        
        // Save tree path reactions to progress
        currentProgress.calibrationReactions = reactions;
        await fetch('/api/v2/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, progress: currentProgress }),
        });
      } catch (err: any) {
        console.error('Failed to sync progress to server:', err);
        setErrorLog(`Failed to sync calibration to database: ${err.message || err}`);
        return;
      }
    }
    
    try {
      if (username) {
        localStorage.setItem(`id_calibrated_${username.toLowerCase().trim()}`, 'done');
      } else {
        localStorage.setItem('id_calibrated', 'done');
      }
      router.push('/v2/map');
    } catch (err: any) {
      setErrorLog(`Calibration save error: ${err.message || err}`);
    }
  };

  if (errorLog) {
    return (
      <div className="analysis" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#221111', color: '#ffaaaa' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '14px', fontFamily: 'var(--font-head)' }}>Calibration error (Diagnostics)</h2>
        <pre style={{ padding: '16px', background: '#110505', border: '1px solid #552222', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', maxWidth: '600px', width: '100%' }}>
          {errorLog}
        </pre>
        <button 
          className="btn btn-ghost" 
          style={{ marginTop: '20px', border: '1px solid #552222' }} 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Reset session and restart
        </button>
      </div>
    );
  }

  if (screen === 'intro') {
    return (
      <div className="intro fade-in">
        <div className="intro-wm wordmark">
          <span className="dot">·</span>
          <span className="it">It Depends</span>
        </div>
        <div className="intro-inner">
          <div className="eyebrow">· {CALIBRATION_CARDS.length} cases&nbsp;&nbsp;·&nbsp;&nbsp;≈2 minutes</div>
          <h1>Let's see<br/>where you are.</h1>
          <p>Real situations from DataArt design practice. React honestly — and get your personal route.</p>
          <div className="intro-cta">
            <button className="btn btn-primary" onClick={handleStart}>
              start <Icon.arrow />
            </button>
            <span className="intro-hint">or <kbd>Enter</kbd> (keyboard 1·2·3)</span>
          </div>
          <a className="skip-link" onClick={handleSkip} style={{ cursor: 'pointer' }}>skip → straight to gallery</a>
        </div>
      </div>
    );
  }

  if (screen === 'calibrate') {
    const card = CALIBRATION_CARDS.find(c => c.id === currentCardId) || CALIBRATION_CARDS[0];
    
    const REACTIONS = [
      { num: "01", label: copy.calibrate.wowBtn, out: "new territory" },
      { num: "02", label: copy.calibrate.heardBtn, out: "on my radar" },
      { num: "03", label: copy.calibrate.skipBtn, out: "I've got this" },
    ];

    return (
      <div className="calib fade-in">
        <div className="calib-top">
          <div className="wordmark">
            <span className="dot">·</span>
            <span className="it">It Depends</span>
          </div>
          <div className="calib-count">
            <b>{history.length}</b> / 3
          </div>
        </div>

        <div className="calib-stage">
          <div className="story-card">
            <div className="story-main">
              <h2 className="story-name">{card.name}</h2>
              <div className="story-role">{card.role}</div>
              
              <div className="moments">
                <div className="moment">
                  <div className="moment-tag">before</div>
                  <div className="moment-text">{card.pain}</div>
                </div>
                <div className="moment did">
                  <div className="moment-tag">what she did</div>
                  <div className="moment-text">{card.move}</div>
                </div>
                <div className="moment">
                  <div className="moment-tag">after</div>
                  <div className="moment-text">{card.out}</div>
                </div>
              </div>
            </div>
            
            <div className="story-stat">
              <div className="stat-effort">{EFFORT_LABELS[card.effort]}</div>
              <div className="stat-label">{CATS[card.category].label}</div>
            </div>
          </div>

          <div className="reaction-block">
            <div className="reaction-head">
              <span className="q">how does this land for you?</span>
              <span className="reaction-hint">press 1 · 2 · 3</span>
            </div>
            <div className="reactions">
              {REACTIONS.map((r, idx) => (
                <button
                  key={idx}
                  className={`reaction ${picked === idx ? 'picked' : ''}`}
                  onClick={() => handleReact(idx)}
                >
                  <span className="reaction-num">{r.num}</span>
                  <span className="reaction-label">{r.label}</span>
                  <span className="reaction-out">
                    {r.out} <Icon.arrow style={{ width: 12, height: 12 }} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnalysisScreen onContinue={handleFinishCalibration} />
  );
}

function AnalysisScreen({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'analyzing' | 'done'>('analyzing');

  const chips = ["transcription", "clustering", "copywriting", "design critique", "prototype", "dashboard", "planning"];

  useEffect(() => {
    const t1 = setInterval(() => {
      setStep(s => Math.min(s + 1, chips.length));
    }, 180);
    return () => clearInterval(t1);
  }, [chips.length]);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setPhase('done');
          return 100;
        }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="analysis fade-in">
      <div className="analysis-chips">
        {chips.slice(0, step).map((c, i) => (
          <span key={i} className="an-chip">{c}</span>
        ))}
      </div>
      <h1>{phase === 'analyzing' ? <>analysing<span className="cursor">_</span></> : "done."}</h1>
      {phase === 'analyzing' ? (
        <div className="an-progress">
          <span style={{ width: progress + "%" }} />
        </div>
      ) : (
        <button className="btn btn-primary an-done-cta animate-fade-in" onClick={onContinue}>
          view map <Icon.arrow />
        </button>
      )}
    </div>
  );
}
