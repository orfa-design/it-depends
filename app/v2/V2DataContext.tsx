'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { type Step, type CalibrationCard, type StepCategory, CATS } from '@/lib/data-v2';
import { type AppCopy, DEFAULT_COPY } from '@/lib/copy';

export interface UserProgress {
  overrides: Record<string, 'inprogress' | 'done'>;
  results: Record<string, string>;
  calibrationReactions?: Record<string, 'wow' | 'heard' | 'skip'>; // tree reactions
  notInterested?: Record<string, boolean>;
  tasks?: Record<string, string>; // custom edited tasks
}

interface V2DataContextType {
  username: string | null;
  setUsername: (name: string | null) => void;
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  copy: AppCopy;
  setCopy: React.Dispatch<React.SetStateAction<AppCopy>>;
  progress: UserProgress;
  recommendedSteps: Step[];
  loading: boolean;
  isAdmin: boolean;
  takeInWork: (id: string) => Promise<void>;
  markStepDone: (id: string, resultUrl: string) => Promise<void>;
  toggleNotInterested: (id: string) => Promise<void>;
  saveCustomTask: (id: string, taskText: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  getStatus: (s: Step) => 'avail' | 'done' | 'current' | 'future';
  getStatusString: (s: Step) => 'available' | 'done' | 'inprogress' | 'future';
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showCopyDrawer: boolean;
  setShowCopyDrawer: (show: boolean) => void;
  syncStepsList: (updatedSteps: Step[]) => Promise<void>;
  syncCopyContent: (updatedCopy: AppCopy) => Promise<void>;
}

const V2DataContext = createContext<V2DataContextType | undefined>(undefined);

export function V2DataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsernameState] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [copy, setCopy] = useState<AppCopy>(DEFAULT_COPY);
  const [progress, setProgress] = useState<UserProgress>({
    overrides: {},
    results: {},
    calibrationReactions: {},
    notInterested: {},
    tasks: {},
  });
  const [loading, setLoading] = useState(true);

  // Modal/Drawer controls shared globally
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCopyDrawer, setShowCopyDrawer] = useState(false);

  const isAdmin = username ? ['mliudmyla', 'mvladyslav'].includes(username.toLowerCase().trim()) : false;

  // Custom setUsername that also sets localStorage
  const setUsername = (name: string | null) => {
    setUsernameState(name);
    if (name) {
      localStorage.setItem('id_username', name);
    } else {
      localStorage.removeItem('id_username');
    }
  };

  // 1. Initial mounting checks & fetch V2 DB data
  useEffect(() => {
    const initApp = async () => {
      try {
        const storedUser = localStorage.getItem('id_username');
        
        // Skip auth check if we are on login page
        if (!storedUser && !pathname.startsWith('/v2/login')) {
          router.push('/v2/login');
          setLoading(false);
          return;
        }

        if (storedUser) {
          setUsernameState(storedUser);
          
          const calibrated = localStorage.getItem('id_calibrated');
          if (!calibrated && !pathname.startsWith('/v2/calibrate') && !pathname.startsWith('/v2/login')) {
            router.push('/v2/calibrate');
            setLoading(false);
            return;
          }

          // Fetch user progress
          const userRes = await fetch(`/api/v2/user?username=${encodeURIComponent(storedUser)}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setProgress({
              overrides: userData.overrides || {},
              results: userData.results || {},
              calibrationReactions: userData.calibrationReactions || {},
              notInterested: userData.notInterested || {},
              tasks: userData.tasks || {},
            });
          }
        }

        // Fetch shared steps and copy
        const [stepsRes, copyRes] = await Promise.all([
          fetch('/api/v2/steps'),
          fetch('/api/v2/copy')
        ]);

        if (stepsRes.ok && copyRes.ok) {
          const stepsData = await stepsRes.json();
          const copyData = await copyRes.json();
          setSteps(stepsData);
          setCopy(copyData);
        }
      } catch (err) {
        console.error('Failed to initialize V2 Data Provider:', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [pathname, router]);

  // Sync state to Vercel KV via API
  const persistUserProgress = async (nextProgress: UserProgress) => {
    if (!username) return;
    try {
      await fetch('/api/v2/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          progress: nextProgress,
        }),
      });
    } catch (err) {
      console.error('Failed to sync progress with database:', err);
    }
  };

  const takeInWork = async (id: string) => {
    const nextProgress: UserProgress = {
      ...progress,
      overrides: { ...progress.overrides, [id]: 'inprogress' as const },
    };
    setProgress(nextProgress);
    await persistUserProgress(nextProgress);
  };

  const markStepDone = async (id: string, resultUrl: string) => {
    const nextProgress: UserProgress = {
      ...progress,
      overrides: { ...progress.overrides, [id]: 'done' as const },
      results: { ...progress.results, [id]: resultUrl },
    };
    setProgress(nextProgress);
    await persistUserProgress(nextProgress);
  };

  const toggleNotInterested = async (id: string) => {
    const nextProgress: UserProgress = {
      ...progress,
      notInterested: {
        ...progress.notInterested,
        [id]: !progress.notInterested?.[id],
      },
    };
    setProgress(nextProgress);
    await persistUserProgress(nextProgress);
  };

  const saveCustomTask = async (id: string, taskText: string) => {
    const nextProgress: UserProgress = {
      ...progress,
      tasks: {
        ...progress.tasks,
        [id]: taskText,
      },
    };
    setProgress(nextProgress);
    await persistUserProgress(nextProgress);
  };

  const resetProgress = async () => {
    const emptyProgress: UserProgress = {
      overrides: {},
      results: {},
      calibrationReactions: {},
      notInterested: {},
      tasks: {},
    };
    setProgress(emptyProgress);
    localStorage.removeItem('id_calibrated');
    if (username) {
      await persistUserProgress(emptyProgress);
    }
    router.push('/v2/calibrate');
  };

  const syncStepsList = async (updatedSteps: Step[]) => {
    setSteps(updatedSteps);
    if (!isAdmin) return;
    try {
      await fetch('/api/v2/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, steps: updatedSteps }),
      });
    } catch (err) {
      console.error('Failed to sync steps list:', err);
    }
  };

  const syncCopyContent = async (updatedCopy: AppCopy) => {
    setCopy(updatedCopy);
    if (!isAdmin) return;
    try {
      await fetch('/api/v2/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, copy: updatedCopy }),
      });
    } catch (err) {
      console.error('Failed to sync copy content:', err);
    }
  };

  const getStatus = (s: Step): 'avail' | 'done' | 'current' | 'future' => {
    if (progress.notInterested?.[s.id]) return 'avail';
    const over = progress.overrides?.[s.id];
    if (over === 'done') return 'done';
    if (over === 'inprogress') return 'current';
    return s.state as any; // fallback to data-level
  };

  const getStatusString = (s: Step): 'available' | 'done' | 'inprogress' | 'future' => {
    const status = getStatus(s);
    if (status === 'done') return 'done';
    if (status === 'current') return 'inprogress';
    if (status === 'future') return 'future';
    return 'available';
  };

  // Intelligent Recommendation Engine (Spec: твій старт 5–7 кроків)
  const getRecommendedStepsList = (): Step[] => {
    const isSkipped = typeof window !== 'undefined' ? localStorage.getItem('id_calibrated') === 'skipped' : false;
    const reactions = progress.calibrationReactions || {};
    const hasReactions = Object.keys(reactions).length > 0;

    if (isSkipped || !hasReactions) {
      // Default path: first 5-7 quick-steps
      return steps.filter(s => s.effortLevel === 'quick').slice(0, 7);
    }

    // Adapt category weighting based on calibration choices
    const categoryScores: Record<StepCategory, number> = {
      research: 1,
      prototyping: 1,
      code: 1,
      workflow: 1,
      planning: 2, // universal bridge category starts slightly higher
    };

    Object.entries(reactions).forEach(([cardId, reaction]) => {
      let cat: StepCategory | null = null;
      if (cardId === 'anya') cat = 'research';
      else if (cardId === 'masha') cat = 'prototyping';
      else if (cardId === 'daryna') cat = 'workflow';
      else if (cardId === 'olena') cat = 'code';

      if (cat) {
        if (reaction === 'wow') categoryScores[cat] += 4;
        else if (reaction === 'heard') categoryScores[cat] += 2;
        else if (reaction === 'skip') categoryScores[cat] -= 2;
      }
    });

    // Score steps using category weights and effort levels
    const scoredSteps = steps.map(s => {
      const catScore = categoryScores[s.cat] || 1;
      let effortBonus = 0;
      if (s.effortLevel === 'quick') effortBonus = 2;
      else if (s.effortLevel === 'iterative') effortBonus = 1;

      return {
        step: s,
        score: catScore + effortBonus,
      };
    });

    // Sort descending by score and pick top 5-7
    scoredSteps.sort((a, b) => b.score - a.score);
    return scoredSteps.map(x => x.step).slice(0, 7);
  };

  const recommendedSteps = getRecommendedStepsList();

  if (loading || !copy) {
    return (
      <div className="analysis" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '32px' }}>
          завантажую<span className="cursor">_</span>
        </h1>
      </div>
    );
  }

  return (
    <V2DataContext.Provider
      value={{
        username,
        setUsername,
        steps,
        setSteps,
        copy,
        setCopy,
        progress,
        recommendedSteps,
        loading,
        isAdmin,
        takeInWork,
        markStepDone,
        toggleNotInterested,
        saveCustomTask,
        resetProgress,
        getStatus,
        getStatusString,
        showAddModal,
        setShowAddModal,
        showCopyDrawer,
        setShowCopyDrawer,
        syncStepsList,
        syncCopyContent,
      }}
    >
      {children}
    </V2DataContext.Provider>
  );
}

export function useV2Data() {
  const context = useContext(V2DataContext);
  if (!context) {
    throw new Error('useV2Data must be used within a V2DataProvider');
  }
  return context;
}
