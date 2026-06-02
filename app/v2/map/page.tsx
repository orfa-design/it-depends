'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../V2DataContext';
import { Icon, EditStepModal } from '../V2ClientApp';
import V2AppShell from '../V2AppShell';

const infoCardStyle: React.CSSProperties = {
  background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)',
  padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start',
};
const iconWrapStyle: React.CSSProperties = { fontSize: '24px', lineHeight: 1 };
const infoCardHeadStyle: React.CSSProperties = { fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px', fontFamily: 'var(--font-head)' };
const infoCardParaStyle: React.CSSProperties = { fontSize: '13.5px', color: 'var(--text-2)', lineHeight: '1.5' };
const mockBtnStyle: React.CSSProperties = {
  padding: '12px', background: 'var(--bg-3)', border: '1px solid var(--line)',
  borderRadius: 'var(--r-sm)', opacity: 0.9,
};
const mockBtnDescStyle: React.CSSProperties = { fontSize: '11.5px', color: 'var(--text-2)', lineHeight: '1.4' };
const mockBtnDescDimStyle: React.CSSProperties = { fontSize: '11.5px', color: 'var(--text-3)', lineHeight: '1.4' };

export default function V2MapPage() {
  const router = useRouter();
  const {
    recommendedSteps,
    copy,
    progress,
    getStatus,
    steps,
    syncStepsList,
  } = useV2Data();

  const [editStepId, setEditStepId] = useState<string | null>(null);

  const handleEditSave = async (updatedStep: any) => {
    const updatedSteps = steps.map(s => s.id === updatedStep.id ? updatedStep : s);
    await syncStepsList(updatedSteps);
    setEditStepId(null);
  };

  const visibleSteps = recommendedSteps.filter(s => !progress.notInterested?.[s.id]);
  const doneCount = recommendedSteps.filter(s => getStatus(s) === 'done').length;

  return (
    <V2AppShell>
      <div className="map">
        {/* LEFT COLUMN: Map Strip */}
        <div className="strip">
          <div className="strip-head">
            <span className="eyebrow">{copy.map.heading}</span>
            <span className="prog">
              <b>{doneCount}</b> / {recommendedSteps.length} done
            </span>
          </div>
          <div className="strip-list scroll">
            {visibleSteps.map((s) => {
              const st = getStatus(s);
              return (
                <button
                  key={s.id}
                  className={`node ${st}`}
                  onClick={() => router.push(`/v2/step/${s.id}`)}
                >
                  <div className="node-rail">
                    {st === 'done' ? (
                      <span className="node-check">
                        <Icon.check style={{ width: 10, height: 10 }} />
                      </span>
                    ) : (
                      <span className="node-dot" />
                    )}
                  </div>
                  <div className="node-body">
                    <div className="node-title">
                      {s.title}
                      {s.kind === 'build' && <span className="node-phases">{s.phases?.length} phases</span>}
                    </div>
                    <div className="node-sub">{s.subtitle}</div>
                  </div>
                </button>
              );
            })}

            <div className="node-locked">
              <div className="nl-icon">🔒</div>
              <div className="nl-text">More steps coming soon — we're adding them now.</div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Welcome Dashboard */}
        <div className="center scroll">
          <div className="center-inner" style={{ padding: '40px 32px' }}>
            <div className="map-overview animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '24px', marginBottom: '24px' }}>
                🧭
              </div>
              <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '32px', marginBottom: '16px', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Welcome to your Path!
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: '1.6', marginBottom: '36px' }}>
                Your personalised route is built from your calibration. Here you'll level up your skills and automate your work with AI, step by step. Here's how it all works:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Card 1 (now Left) */}
                <div style={infoCardStyle}>
                  <div style={iconWrapStyle}>👈</div>
                  <div>
                    <h3 style={infoCardHeadStyle}>Left: Your personal Path</h3>
                    <p style={infoCardParaStyle}>A sequence of 5–7 key steps, automatically selected for your needs. They'll help you tackle real pain points from DataArt practice.</p>
                  </div>
                </div>

                {/* Card 2 (now Top) */}
                <div style={infoCardStyle}>
                  <div style={iconWrapStyle}>👆</div>
                  <div>
                    <h3 style={infoCardHeadStyle}>Top: Mode switcher</h3>
                    <p style={infoCardParaStyle}>The "Path" tab keeps focus on your personal map. Switch to "Gallery" to freely browse all 10 practices without limits.</p>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--accent-soft)', border: '1px dashed var(--accent-line)', borderRadius: 'var(--r-md)' }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>◯</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                  Choose your first step in the left column to open it and get started!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Mock Sidebar Control Guide */}
        <div className="side">
          <div className="side-inner" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="eyebrow" style={{ color: 'var(--text-3)' }}>⚡ Step controls</div>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5' }}>
              When you select any step on the left, an action panel will appear here to manage your progress:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Card 1 (now top) */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', lineHeight: 1 }}>👈</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px', fontFamily: 'var(--font-head)' }}>
                    Ліворуч: Твій персональний Шлях
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: '1.5' }}>
                    Послідовність із 5–7 найважливіших кроків, автоматично підібраних під твої потреби. Вони допоможуть тобі вирішити реальні болі з практики DataArt.
                  </p>
                </div>
              </div>

              {/* Card 2 (now bottom) */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', lineHeight: 1 }}>👆</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px', fontFamily: 'var(--font-head)' }}>
                    Зверху: Перемикач режимів
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: '1.5' }}>
                    Вкладка «Шлях» завжди тримає фокус на твоїй індивідуальній карті. Перемикайся на «Галерею», щоб вільно шукати й вибирати серед усіх 10 практик без обмежень.
                  </p>
                </div>
              </div>

              <div style={mockBtnStyle}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-3)', marginBottom: '4px' }}>
                  Not interested (toggle)
                </div>
                <div style={mockBtnDescDimStyle}>
                  Hides the step from your personal Path if it's not relevant right now.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </V2AppShell>
  );
}
