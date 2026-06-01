'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../V2DataContext';
import { Icon, Sidebar, EditStepModal } from '../V2ClientApp';
import { CATS } from '@/lib/data-v2';
import V2AppShell from '../V2AppShell';

export default function V2MapPage() {
  const router = useRouter();
  const {
    recommendedSteps,
    copy,
    progress,
    getStatus,
    getStatusString,
    takeInWork,
    toggleNotInterested,
    isAdmin,
    steps,
    syncStepsList
  } = useV2Data();

  const [editStepId, setEditStepId] = useState<string | null>(null);

  // Filter out steps marked "not interested" from the visual map strip
  const visibleSteps = recommendedSteps.filter(s => !progress.notInterested?.[s.id]);

  const handleEditSave = async (updatedStep: any) => {
    const updatedSteps = steps.map(s => s.id === updatedStep.id ? updatedStep : s);
    await syncStepsList(updatedSteps);
    setEditStepId(null);
  };

  const handleRebuildRoute = () => {
    alert("Скоро тут можна буде перебудувати маршрут — ця функція в розробці.");
  };

  return (
    <V2AppShell>
      <div className="map">
        {/* LEFT COLUMN: Map Strip */}
        <div className="strip">
          <div className="strip-head">
            <span className="eyebrow">{copy.map.heading}</span>
            <span className="prog">
              <b>{recommendedSteps.filter(s => getStatus(s) === 'done').length}</b> / {recommendedSteps.length} виконано
            </span>
          </div>
          <div className="strip-list scroll">
            {visibleSteps.map((s, idx) => {
              const st = getStatus(s);
              return (
                <button 
                  key={s.id} 
                  className={`node ${st}`} 
                  onClick={() => router.push(`/v2/step/${s.id}`)}
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
            <div className="map-overview">
              <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '32px', marginBottom: '20px' }}>
                Ось де ти зараз.
              </h1>
              <p style={{ color: 'var(--text-3)', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px', maxWidth: '580px' }}>
                {copy.map.defaultPathNote}
              </p>
              
              <div className="rebuild-route-section" style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: '12px' }}>
                <button className="btn btn-ghost" style={{ fontSize: '13px' }} onClick={handleRebuildRoute}>
                  🔄 Перебудувати маршрут
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar (Empty overview placeholder on path root) */}
        <div className="side">
          <div className="side-block" style={{ padding: '24px', color: 'var(--text-3)', textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '12px' }}>🧭</span>
            Обери крок на мапі ліворуч, щоб почати або продовжити роботу.
          </div>
        </div>
      </div>

      {/* EDIT MODAL OVERLAY */}
      {editStepId && (
        <EditStepModal 
          step={steps.find(s => s.id === editStepId)!} 
          onSave={handleEditSave} 
          onClose={() => setEditStepId(null)} 
        />
      )}
    </V2AppShell>
  );
}
