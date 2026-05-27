// screens.jsx — story, map (split layout), prompt modal, completion

// ── helpers ────────────────────────────────────────────────────────────────
function parseTime(s) {
  const m = String(s).match(/^(\d+)\s*(.+)$/);
  if (m) return { num: m[1], unit: m[2] };
  return { word: s };
}

// ── Story ──────────────────────────────────────────────────────────────────
function StoryScreen({ idx, onPick }) {
  const story = STORIES[idx];
  const showIntro = idx === 0;
  const time = parseTime(story.time);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      const i = ['1', '2', '3'].indexOf(e.key);
      if (i >= 0) onPick(REACTIONS[i].v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPick]);

  return (
    <div className="story-stage" data-i={idx} key={idx}>
      <div className="story-frame">
        <div className="story-top anim-in delay-0">
          {showIntro ? (
            <div className="intro-overlay">
              <span className="dim">подивимось що ти вже вмієш —</span><br />
              і що відкривається далі.
            </div>
          ) : (
            <div className="eyebrow">що інші роблять із claude</div>
          )}
        </div>

        <div className="story-main">
          <div className="story-lhs">
            <div className="anim-in delay-1">
              <h1 className="story-name-hero">{story.name}</h1>
              <div className="story-role">{story.role}</div>
            </div>
            <div className="story-moments anim-in delay-2">
              <div className="moment">
                <div className="moment-tag">було</div>
                <div className="moment-text">{story.pain}</div>
              </div>
              <div className="moment moment-hero">
                <div className="moment-tag">що зробила</div>
                <div className="moment-text">{story.move}</div>
              </div>
              <div className="moment">
                <div className="moment-tag">стало</div>
                <div className="moment-text">{story.out}</div>
              </div>
            </div>
          </div>

          <div className="story-stat anim-in delay-0">
            {time.num != null ? (
              <React.Fragment>
                <div className="stat-num">{time.num}</div>
                <div className="stat-unit">{time.unit}</div>
              </React.Fragment>
            ) : (
              <div className="stat-word">{time.word}</div>
            )}
            <div className="stat-foot">фактичний час</div>
          </div>
        </div>

        <div className="story-bottom anim-in delay-3">
          <div className="react-label">
            <span>як це для тебе?</span>
            <span className="kbd-hint">натисни 1 · 2 · 3</span>
          </div>
          <div className="react-row">
            {REACTIONS.map((r, i) => (
              <button key={r.v} className="react-card" onClick={() => onPick(r.v)}>
                <span className="react-num">0{i + 1}</span>
                <span className="react-text">{r.label}</span>
                <span className="react-ic">{r.ic} →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Map — split layout ─────────────────────────────────────────────────────
const CUR_IDX = STEPS.findIndex(s => s.current); // 3

function MapScreen({ style, onStartPrompt }) {
  const [selectedIdx, setSelectedIdx] = React.useState(CUR_IDX);

  return (
    <div className="map-layout">
      {/* LEFT: nav (path / constellation / typographic) */}
      <div className="map-nav-col">
        <div className="map-header">
          <div className="eyebrow">your map</div>
          <div className="map-title">Ось де ти зараз.</div>
          <div className="map-sub">10 кроків. Карта росте, поки ти йдеш.</div>
        </div>
        {style === 'vertical'      && <MapVertical      selectedIdx={selectedIdx} onSelect={setSelectedIdx} />}
        {style === 'constellation' && <MapConstellation selectedIdx={selectedIdx} onSelect={setSelectedIdx} />}
        {style === 'typographic'   && <MapTypographic   selectedIdx={selectedIdx} onSelect={setSelectedIdx} />}
      </div>

      {/* RIGHT: inline step info */}
      <div className="map-info-col">
        <StepInfo
          key={selectedIdx}
          stepIdx={selectedIdx}
          onStart={onStartPrompt}
          onSelect={setSelectedIdx}
        />
      </div>
    </div>
  );
}

// ── Inline step info panel ─────────────────────────────────────────────────
function StepInfo({ stepIdx, onStart, onSelect }) {
  const step = STEPS[stepIdx];
  const st   = STATUS(stepIdx);

  if (st === 'done-no-link') {
    return (
      <div className="step-info step-info-done anim-in">
        <div className="done-badge done-badge-plain">виконано</div>
        <h2 className="step-info-title">{step.title}</h2>
        <p className="step-info-note">
          ти вже це вмієш. наступний крок —{' '}
          <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
            {STEPS[CUR_IDX].title.toLowerCase()}
          </button>
        </p>
      </div>
    );
  }

  if (st === 'done-link') {
    return (
      <div className="step-info step-info-done anim-in">
        <div className="done-badge done-badge-link">виконано · є результат</div>
        <h2 className="step-info-title">{step.title}</h2>
        <p className="step-info-note">
          ти вже це вмієш. наступний крок —{' '}
          <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
            {STEPS[CUR_IDX].title.toLowerCase()}
          </button>
        </p>
        <a href={step.result} target="_blank" rel="noopener noreferrer" className="result-btn">
          <span className="result-btn-label">{step.resultLabel || 'переглянути результат'}</span>
          <span className="result-btn-arrow">↗</span>
        </a>
      </div>
    );
  }

  if (st === 'future') {
    const extra = STEPS_EXTRA[step.id];
    return (
      <div className="step-info step-info-future anim-in">
        <div className="future-badge">складніше</div>
        <h2 className="step-info-title">{step.title}</h2>
        {extra ? (
          <React.Fragment>
            <div className="step-info-grid">
              <div className="step-info-block">
                <div className="label">що ти зможеш</div>
                <div className="value">{extra.doable}</div>
              </div>
              <div className="step-info-block">
                <div className="label">що вивчиш технічно</div>
                <div className="value">{extra.technical}</div>
              </div>
            </div>
            <div className="step-info-foot">
              <div className="detail-time">
                {extra.time} · легше після{' '}
                <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
                  кроку 04
                </button>
              </div>
              <button className="btn btn-primary" onClick={() => onStart(stepIdx)}>
                отримати промпт →
              </button>
            </div>
          </React.Fragment>
        ) : (
          <p className="step-info-note">
            Легше дасться після{' '}
            <button className="inline-link" onClick={() => onSelect(CUR_IDX)}>
              {STEPS[CUR_IDX].title.toLowerCase()}
            </button>
            {' '}— але нічого не зупиняє розібратись зараз.
          </p>
        )}
      </div>
    );
  }

  // current step
  const d = STEP_DETAIL;
  return (
    <div className="step-info step-info-cur anim-in">
      <div className="eyebrow eyebrow-accent" style={{ marginBottom: 20 }}>
        <span className="dot" /> наступний крок · {String(stepIdx + 1).padStart(2, '0')} з 10
      </div>
      <h2 className="step-info-title">{d.title}</h2>
      <div className="step-info-grid">
        <div className="step-info-block">
          <div className="label">що ти зможеш</div>
          <div className="value">{d.doable}</div>
        </div>
        <div className="step-info-block">
          <div className="label">що дізнаєшся технічно</div>
          <div className="value">{d.technical}</div>
        </div>
      </div>
      <div className="step-info-foot">
        <div className="detail-time">{d.time} · {d.prereqs}</div>
        <button className="btn btn-primary" onClick={() => onStart(stepIdx)}>
          отримати промпт →
        </button>
      </div>
    </div>
  );
}

// ── Map nav variants ───────────────────────────────────────────────────────
function MapVertical({ selectedIdx, onSelect }) {
  return (
    <div className="path">
      {STEPS.map((s, i) => {
        const st  = STATUS(i);
        const sel = i === selectedIdx;
        return (
          <React.Fragment key={s.id}>
            {i === CUR_IDX + 1 && (
              <div className="level-hint">
                <span>складніше</span>
                <span className="level-hint-dot">·</span>
                <span>краще після кроку 04</span>
              </div>
            )}
            <div
              className={`node ${st}${sel ? ' selected' : ''}`}
              onClick={() => onSelect(i)}>
              <div className="marker" />
              <div className="node-text">
                <div className="node-title">{s.title}</div>
                {st === 'done-link'  && <div className="node-meta node-meta-link">результат ↗</div>}
                {st === 'cur'        && <div className="node-meta">наступне · ≈45 хв</div>}
              </div>
              {sel && st === 'cur' && <div className="node-cta">→</div>}
            </div>
          </React.Fragment>
        );
      })}
      <div className="path-end">шлях продовжується</div>
    </div>
  );
}

function MapConstellation({ selectedIdx, onSelect }) {
  const W = 340, H = 420;
  const pts = CONSTELLATION.map(c => [
    (c.x / 100) * W,
    (c.y / 100) * H,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const accPath = pts[CUR_IDX] && pts[CUR_IDX - 1]
    ? `M ${pts[CUR_IDX-1][0]} ${pts[CUR_IDX-1][1]} L ${pts[CUR_IDX][0]} ${pts[CUR_IDX][1]}`
    : '';
  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d={d} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="3 5" />
        {accPath && (
          <path d={accPath} fill="none" stroke="#22d3a6" strokeWidth="1.4"
                strokeDasharray="3 5" opacity="0.55" />
        )}
      </svg>
      {CONSTELLATION.map((c, i) => {
        const s   = STEPS[i];
        const st  = STATUS(i);
        const sel = i === selectedIdx;
        return (
          <div key={s.id} className={`const-node ${st}${sel ? ' selected' : ''}`}
               style={{ left: (c.x / 100 * W) + 'px', top: (c.y / 100 * H) + 'px' }}
               onClick={() => onSelect(i)}>
            <div className="dot" />
            <div className="label">{s.title}</div>
          </div>
        );
      })}
    </div>
  );
}

function MapTypographic({ selectedIdx, onSelect }) {
  return (
    <div>
      <div className="typo-list">
        {STEPS.map((s, i) => {
          const st  = STATUS(i);
          const sel = i === selectedIdx;
          return (
            <React.Fragment key={s.id}>
              {i === CUR_IDX + 1 && (
                <div className="typo-level-hint">
                  <span>складніше</span>
                  <span className="level-hint-dot">·</span>
                  <span>краще після кроку 04</span>
                </div>
              )}
              <div className={`typo-row ${st}${sel ? ' selected' : ''}`}
                   onClick={() => onSelect(i)}>
                <div className="typo-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="typo-title">{s.title}</div>
                <div className="typo-meta">
                  {st === 'done-no-link' ? 'пройдено' : st === 'done-link' ? '↗' : st === 'cur' ? '≈45 хв' : ''}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="typo-end">шлях продовжується</div>
    </div>
  );
}

// ── Prompt modal (the only modal now) ─────────────────────────────────────
function StepModal({ stepIdx, onClose, onDone }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-topbar">
          <div className="modal-handle" />
          <button className="modal-close" onClick={onClose} aria-label="Закрити">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <PromptScreen stepIdx={stepIdx} onDone={onDone} onBack={onClose} />
        </div>
      </div>
    </>
  );
}

// ── Prompt (inside modal) ──────────────────────────────────────────────────
function PromptScreen({ stepIdx, onDone, onBack }) {
  const step    = STEPS[stepIdx];
  const extra   = STEPS_EXTRA[step.id];
  const isCur   = stepIdx === CUR_IDX;
  const text    = extra?.promptText || PROMPT_TEXT;
  const stepNum = String(stepIdx + 1).padStart(2, '0');

  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="prompt-inner anim-in">
      <div className="prompt-head">
        <div>
          <div className="eyebrow">крок {stepNum} · промпт</div>
          <div className="prompt-title">Скопіюй це в Claude.</div>
          <div className="prompt-sub">
            Відкрий claude.ai, встав, дай чату попрацювати.
            {isCur && ' Повернись сюди, коли матимеш Vercel-лінк.'}
          </div>
        </div>
        <button className="btn-ghost" onClick={onBack}>← закрити</button>
      </div>
      <div className="prompt-box">
        <div className="prompt-bar">
          <div className="prompt-bar-left">
            <span className="ic" />
            <span>prompt-{stepNum}-{step.id}.txt</span>
            <span className="sep">·</span>
            <span style={{ color: 'var(--text-faint)' }}>{text.length} символів</span>
          </div>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
            {copied ? 'скопійовано' : 'copy'}
          </button>
        </div>
        <div className="prompt-body">{text}</div>
      </div>
      <div className="prompt-foot">
        {isCur ? (
          <React.Fragment>
            <div className="meta">коли матимеш робочий прототип — повернись сюди.</div>
            <button className="btn btn-primary" onClick={onDone}>я зробила — далі</button>
          </React.Fragment>
        ) : (
          <div className="meta">зроби — і повернись позначити крок виконаним.</div>
        )}
      </div>
    </div>
  );
}

// ── Completion ─────────────────────────────────────────────────────────────
function CompleteScreen({ onReset }) {
  const [url, setUrl] = React.useState('');
  const [committed, setCommitted] = React.useState('');
  const [shared, setShared] = React.useState(false);
  const valid =
    /^https?:\/\/.+/.test(url) ||
    /\.vercel\.app/.test(url) ||
    /\.(com|app|io|dev|me|design)(\/|$)/.test(url);
  const commit = () => {
    if (!valid) return;
    let v = url.trim();
    if (!/^https?:\/\//.test(v)) v = 'https://' + v;
    setCommitted(v);
  };
  const share = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };
  const display = committed
    ? committed.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : '';
  const projectName = display ? display.split('.')[0].replace(/-/g, ' ') : '';

  return (
    <div className="stage anim-in">
      <div className="col-wide complete">
        <div>
          <div className="eyebrow eyebrow-accent anim-in delay-0" style={{ marginBottom: 28 }}>
            <span className="dot" /> shipped
          </div>
          <h1 className="complete-display anim-in delay-1">
            ти зробила свій<br />
            <span className="accent">перший прототип.</span>
          </h1>
          <div className="complete-sub anim-in delay-2">
            ≈45 хвилин тому ти не знала, що це можливо.<br />
            тепер є лінк, який можна показати.
          </div>
        </div>

        <div className="share-form anim-in delay-3">
          <div className="eyebrow">встав посилання</div>
          <div className="share-input-row">
            <input
              autoFocus
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && commit()}
              placeholder="my-prototype.vercel.app"
              spellCheck={false}
            />
            <button disabled={!valid} onClick={commit}>preview ↵</button>
          </div>
        </div>

        {committed && (
          <div className="preview anim-in">
            <div className="og">
              <div className="og-meta">
                <span>{projectName || 'prototype'}</span>
                <span className="live">live</span>
              </div>
              <div className="og-title">Прототип, який клікається.</div>
            </div>
            <div className="preview-meta">
              <span className="url">{display}</span>
              <span className="site">vercel</span>
            </div>
          </div>
        )}

        {committed && (
          <div className="complete-foot anim-in">
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={share}>
                {shared ? 'скопійовано' : 'share →'}
              </button>
              <button className="btn" onClick={onReset}>зробити ще один</button>
            </div>
            <div className="meta">шерить твою роботу, не цей продукт.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Intro screen ──────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (e.key === 'Enter' || e.key === ' ') onStart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  return (
    <div className="intro-stage">
      <div className="intro-bg" />
      <div className="intro-inner">
        <div className="intro-eyebrow anim-in delay-0">
          <span className="dot" />4 кейси · ≈2 хвилини
        </div>
        <h1 className="intro-display anim-in delay-1">
          Подивимось,<br />
          <span className="intro-dim">де ти зараз.</span>
        </h1>
        <p className="intro-body anim-in delay-2">
          Чотири реальні ситуації з практики дизайнерок.<br />
          Реагуй чесно — і отримаєш свою карту.
        </p>
        <div className="intro-foot anim-in delay-3">
          <button className="btn btn-primary intro-cta" onClick={onStart}>
            почати →
          </button>
          <span className="intro-hint">або Enter</span>
        </div>
      </div>
    </div>
  );
}

// ── Analysis / results screen ──────────────────────────────────────────────
function AnalysisScreen({ reactions, onDone }) {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 900);
    const t2 = setTimeout(() => setStep(2), 2200);
    const t3 = setTimeout(onDone,            3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const labels = { wow: 'нова територія', heard: 'на радарі', have: 'у мене є' };
  const statusText = ['збираю відповіді…', 'будую карту…', 'карта готова'];

  return (
    <div className="analysis-stage">
      <div className="analysis-inner">
        <div className="analysis-chips">
          {reactions.map((r, i) => (
            <div key={i} className="analysis-chip anim-in" style={{ animationDelay: `${i * 110}ms` }}>
              <span className="analysis-chip-n">0{i + 1}</span>
              <span className="analysis-chip-v">{labels[r]}</span>
            </div>
          ))}
        </div>

        <div className={`analysis-display anim-in delay-2${step === 2 ? ' analysis-display-done' : ''}`}>
          {step < 2 ? 'аналізую.' : 'готово.'}
        </div>

        <div className="analysis-foot anim-in delay-3">
          <div className="analysis-bar">
            <div className={`analysis-fill step-${step}`} />
          </div>
          <div className="analysis-status eyebrow">{statusText[step]}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  IntroScreen, AnalysisScreen,
  StoryScreen, MapScreen, StepModal, PromptScreen, CompleteScreen,
});
