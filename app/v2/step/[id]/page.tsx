'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useV2Data } from '../../V2DataContext';
import { Icon, Sidebar, EditStepModal, SaveModal } from '../../V2ClientApp';
import V2AppShell from '../../V2AppShell';
import { type Step, CATS, EFFORT } from '@/lib/data-v2';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function V2StepDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const {
    steps,
    copy,
    progress,
    getStatus,
    getStatusString,
    takeInWork,
    markStepDone,
    toggleNotInterested,
    saveCustomTask,
    savePhaseOutput,
    isAdmin,
    syncStepsList,
    recommendedSteps
  } = useV2Data();

  const step = steps.find(s => s.id === id);

  // States
  const [task, setTask] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true });
  const [completedPhases, setCompletedPhases] = useState<Record<number, boolean>>({});
  const [editStepId, setEditStepId] = useState<string | null>(null);
  const [saveFor, setSaveFor] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [adaptedPrompt, setAdaptedPrompt] = useState<string | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [isLevelUpExpanded, setIsLevelUpExpanded] = useState(false);
  const [pitchOpen, setPitchOpen] = useState(true);
  const [phaseOutputs, setPhaseOutputs] = useState<Record<number, string>>({});

  // Synchronize task state with KV stored custom task or default task
  useEffect(() => {
    if (step) {
      const s = getStatusString(step);
      setTask(progress.tasks?.[step.id] || step.defaultTask);
      setPhaseOutputs(progress.phaseOutputs?.[step.id] || {});
      setAdaptedPrompt(null);
      setExpandedPhases({ 1: true });
      setCompletedPhases({});
      setIsLevelUpExpanded(false);
      setPitchOpen(s !== 'inprogress');
      localStorage.setItem('id_last_step', step.id);
    }
  }, [step, progress.tasks, progress.phaseOutputs]);

  if (!step) {
    return (
      <V2AppShell>
        <div className="analysis" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Step not found</h2>
          <button className="btn btn-ghost" style={{ marginTop: '20px' }} onClick={() => router.push('/v2/map')}>
            Back to map
          </button>
        </div>
      </V2AppShell>
    );
  }

  const status = getStatusString(step);

  // Handle task text change and persist to KV
  const handleTaskChange = async (val: string) => {
    setTask(val);
    await saveCustomTask(step.id, val);
  };

  // Dynamic AI-Task Generator (Queries the actual /api/v2/generate-task server-side)
  const handleGenTask = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/v2/generate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: step.id, currentTask: task }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.task) {
          await handleTaskChange(data.task);
        }
      }
    } catch (err) {
      console.error('Failed to generate task via AI API:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAdaptPrompt = async () => {
    if (!task || isAdapting) return;
    setIsAdapting(true);
    try {
      const res = await fetch('/api/v2/adapt-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: step.id, userTask: task }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prompt) setAdaptedPrompt(data.prompt);
      }
    } catch (err) {
      console.error('Failed to adapt prompt:', err);
    } finally {
      setIsAdapting(false);
    }
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

  const handlePhaseOutput = async (phaseN: number, output: string) => {
    setPhaseOutputs(prev => ({ ...prev, [phaseN]: output }));
    await savePhaseOutput(step.id, phaseN, output);
  };

  const handleEditSave = async (updatedStep: any) => {
    const updatedSteps = steps.map(s => s.id === updatedStep.id ? updatedStep : s);
    await syncStepsList(updatedSteps);
    setEditStepId(null);
  };

  const handleDeleteStep = async (deletedId: string) => {
    await syncStepsList(steps.filter(s => s.id !== deletedId));
    router.push('/v2/gallery');
  };

  const handleMarkDone = async (url: string) => {
    await markStepDone(step.id, url);
    setSaveFor(null);
    router.push(`/v2/step/${step.id}/done`);
  };

  // Replace task placeholder
  const formattedPrompt = step.prompt ? step.prompt.replace('{task}', task) : '';

  // Filter out steps marked "not interested" from the visual map strip
  const visibleSteps = recommendedSteps.filter(s => !progress.notInterested?.[s.id]);

  return (
    <V2AppShell>
      <div className="map">
        {/* LEFT COLUMN: Map Strip (Persistent Railroad) */}
        <div className="strip">
          <div className="strip-head">
            <span className="eyebrow">{copy.map.heading}</span>
            <span className="prog">
              <b>{recommendedSteps.filter(s => getStatus(s) === 'done').length}</b> / {recommendedSteps.length} done
            </span>
          </div>
          <div className="strip-list scroll">
            {visibleSteps.map((s) => {
              const st = getStatus(s);
              const isSel = s.id === step.id;
              return (
                <button 
                  key={s.id} 
                  className={`node ${isSel ? 'sel' : ''} ${st}`} 
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

        {/* CENTER COLUMN: Main Content Step Guide */}
        <div className="center scroll">
          <div className="center-inner">
            <div className="step fade-in">
              {/* CORE */}
              <div className="step-sec">
                <h1 className="step-title">{step.title}</h1>
                <p className="step-sub">{step.subtitle}</p>
                <div className="step-meta">
                  <span className="badge kind">{step.kind === 'build' ? 'Build' : 'Simple'}</span>
                  <span className="badge effort">{EFFORT[step.effortLevel || 'quick']}</span>
                  <span className="badge accent" style={{ background: CATS[step.cat].color, color: 'var(--bg)', fontWeight: 'bold' }}>
                    {CATS[step.cat].label}
                  </span>
                </div>
              </div>

              {/* PITCH — collapsed when inprogress or done, expanded when available */}
              <div className={`step-sec${!pitchOpen ? ' collapsed' : ''}`}>
                  <button
                    className="sec-tag sec-tag-btn"
                    onClick={() => setPitchOpen(o => !o)}
                    aria-expanded={pitchOpen}
                  >
                    <span>{copy.step.pitchLabel}</span>
                    <Icon.chev className="sec-chev" />
                  </button>
                  {pitchOpen && (
                    <>
                      <p className="promise" dangerouslySetInnerHTML={{ __html: step.promise.replace(/(You)/g, '<b>$1</b>') }} />
                      <div className="pitch-use">
                        <div className="pv">{step.usedWhen}</div>
                      </div>
                      {step.kind === 'simple' && (
                        <div className="pitch-tool">
                          <span className="tl">Tool:</span>
                          <span className="tv">{step.toolName}</span>
                        </div>
                      )}
                      {step.author && (
                        <div className="pitch-author">
                          <div className="pa-l">colleague experience</div>
                          <div className="pa-t">«{step.author}»</div>
                        </div>
                      )}
                      {step.authorExample && (
                        <div className="pitch-author-example" style={{ marginTop: '16px' }}>
                          {step.authorExample.type === 'image' ? (
                            <div style={{ border: '1px solid var(--line-2)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-2)' }}>
                              <img
                                src={step.authorExample.url}
                                alt={step.authorExample.label || "Example"}
                                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '200px', objectFit: 'cover' }}
                              />
                              {step.authorExample.label && (
                                <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-3)', borderTop: '1px solid var(--line-2)' }}>
                                  📷 {step.authorExample.label}
                                </div>
                              )}
                            </div>
                          ) : (
                            <a
                              href={step.authorExample.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost"
                              style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid var(--line-2)' }}
                            >
                              🔗 {step.authorExample.label || "View colleague example"}
                            </a>
                          )}
                        </div>
                      )}
                    </>
                  )}
              </div>

              {/* GUIDE */}
              <div className="step-sec">
                <div className="sec-tag">guide</div>
                
                <div className="task-label-row">
                  <span className="task-label">
                    {copy.step.taskLabel} {status === 'done' && <span className="task-state">(done ✓)</span>}
                  </span>
                  <button className="task-gen" onClick={handleGenTask} disabled={generating} title="Generate another variant">
                    {generating ? 'generating...' : '🎲 generate another'}
                  </button>
                </div>

                <textarea 
                  className="task-edit" 
                  value={task} 
                  onChange={(e) => handleTaskChange(e.target.value)}
                  placeholder="Describe your task..."
                />

                {step.kind === 'simple' ? (
                  <>
                    <div className="prompt">
                      <div className="prompt-bar">
                        <span className="pb-l">{step.toolName || 'Claude.ai'} prompt</span>
                        <div className="pb-r">
                          {adaptedPrompt && (
                            <button className="task-gen" onClick={() => setAdaptedPrompt(null)}>
                              ↩ template
                            </button>
                          )}
                          <button className="task-gen" onClick={handleAdaptPrompt} disabled={isAdapting}>
                            {isAdapting ? '...' : '✨ adapt'}
                          </button>
                          <span className="char-count">{(adaptedPrompt ?? formattedPrompt).length} chars</span>
                          <button
                            className={`copy-btn ${copied ? 'copied' : ''}`}
                            onClick={() => handleCopyPrompt(adaptedPrompt ?? formattedPrompt)}
                          >
                            {copied ? <><Icon.check /> copied</> : <><Icon.copy /> copy</>}
                          </button>
                        </div>
                      </div>
                      <pre className="prompt-body">{adaptedPrompt ?? formattedPrompt}</pre>
                    </div>

                    {step.howto && (
                      <>
                        <h3 className="howto-label">How it goes</h3>
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
                      const prevOutput = phaseOutputs[p.n - 1];
                      const phasePrompt = p.prompt.replace('{task}', task)
                        + (prevOutput ? `\n\nResult from previous phase:\n${prevOutput}` : '');

                      return (
                        <div key={p.n} className={`phase ${isOpen ? 'open' : ''} ${isDone ? 'done' : ''}`}>
                          <div className="phase-head" role="button" tabIndex={0}
                            onClick={() => togglePhase(p.n)}
                            onKeyDown={e => e.key === 'Enter' && togglePhase(p.n)}>
                            <span className="phase-n">{p.n}</span>
                            <span className="phase-t">{p.title}</span>
                            {prevOutput && <span className="phase-context-badge">↑ from phase {p.n - 1}</span>}
                            <span className="phase-tool">{p.tool}</span>
                            <button
                              className={`phase-finish ${isDone ? 'done' : ''}`}
                              onClick={(e) => togglePhaseComplete(p.n, e)}
                            >
                              {isDone ? 'Done ✓' : 'finish phase'}
                            </button>
                          </div>

                          {isOpen && (
                            <div className="phase-body fade-in">
                              <p className="phase-action">{p.action}</p>

                              <div className="prompt" style={{ marginTop: '8px', marginBottom: '8px' }}>
                                <div className="prompt-bar">
                                  <span className="pb-l">{p.tool} prompt</span>
                                  <div className="pb-r">
                                    <span className="char-count">{phasePrompt.length} chars</span>
                                    <button
                                      className="copy-btn"
                                      onClick={() => handleCopyPrompt(phasePrompt)}
                                    >
                                      <Icon.copy /> copy
                                    </button>
                                  </div>
                                </div>
                                <pre className="prompt-body">{phasePrompt}</pre>
                              </div>

                              <div className="phase-check">
                                <span className="pc-i"><Icon.check /></span>
                                <span><b>Phase checkpoint:</b> {p.checkpoint}</span>
                              </div>
                            </div>
                          )}

                          <div className="phase-output">
                            <span className="po-label">📋 What came out?</span>
                            <textarea
                              className="field-input"
                              value={phaseOutputs[p.n] || ''}
                              onChange={e => handlePhaseOutput(p.n, e.target.value)}
                              placeholder="Paste or describe the result of this phase..."
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Collapsible Level Up (⚡ Next: go deeper) */}
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
                          Next: go deeper
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
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar Actions */}
        <div className="side">
          <Sidebar 
            step={step} 
            copy={copy}
            status={status} 
            resultUrl={progress.results?.[step.id]}
            isNotInterested={!!progress.notInterested?.[step.id]}
            onTake={() => takeInWork(step.id)}
            onDone={() => setSaveFor(step.id)}
            onToggleNotInterested={() => toggleNotInterested(step.id)}
            relatedSteps={steps.filter(s => step.related.includes(s.id))}
            onSelectRelated={(relatedId) => router.push(`/v2/step/${relatedId}`)}
            isAdmin={isAdmin}
            onEdit={() => setEditStepId(step.id)}
          />
        </div>
      </div>

      {/* ADMIN EDIT CMS DRAWER */}
      {editStepId && (
        <EditStepModal
          step={step}
          onSave={handleEditSave}
          onClose={() => setEditStepId(null)}
          onDelete={handleDeleteStep}
        />
      )}

      {/* SAVE RESULT PROGRESS DIALOG */}
      {saveFor && (
        <SaveModal 
          stepId={saveFor} 
          copy={copy} 
          onClose={() => setSaveFor(null)} 
          onSave={handleMarkDone} 
        />
      )}
    </V2AppShell>
  );
}
