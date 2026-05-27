// screens.jsx — story, map, detail, prompt, completion

// ── Story (+ opening line on idx 0) ────────────────────────────────────────
function StoryScreen({ idx, onPick }) {
  const story = STORIES[idx];
  const showIntro = idx === 0;
  return (
    <div className="stage">
      <div className="col">
        {showIntro && (
          <div className="intro-line anim-in">
            Подивимось <span className="dim">що ти вже вмієш —</span><br />
            і що відкривається далі.
          </div>
        )}
        {/* key={idx} forces re-mount on advance so the animation replays */}
        <div className="story anim-in" key={idx}>
          <div className="story-head">
            <div>
              <div className="story-name">{story.name}</div>
              <div className="story-role">{story.role}</div>
            </div>
            <div className="story-time">{story.time}</div>
          </div>
          <div className="story-body">
            <div className="story-block muted">
              <div className="label">що було складно</div>
              <div className="value">{story.pain}</div>
            </div>
            <div className="story-block">
              <div className="label">що вона зробила</div>
              <div className="value">{story.move}</div>
            </div>
            <div className="story-block muted">
              <div className="label">що вийшло</div>
              <div className="value">{story.out}</div>
            </div>
          </div>
          <div className="reactions">
            <div className="label-row">як це для тебе?</div>
            {REACTIONS.map(r => (
              <button key={r.v} className="react" onClick={() => onPick(r.v)}>
                <span>{r.label}</span>
                <span className="ic">{r.ic}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Map (3 styles) ─────────────────────────────────────────────────────────
function MapScreen({ style, onPick }) {
  return (
    <div className="map-stage anim-in">
      <div className="map-eyebrow">
        <div>
          <div className="eyebrow">your map</div>
          <div className="map-title">Ось де ти зараз.</div>
        </div>
        <div className="map-sub">10 кроків. Карта росте, поки ти йдеш.</div>
      </div>
      {style === 'vertical'      && <MapVertical onPick={onPick} />}
      {style === 'constellation' && <MapConstellation onPick={onPick} />}
      {style === 'typographic'   && <MapTypographic onPick={onPick} />}
    </div>
  );
}

function MapVertical({ onPick }) {
  return (
    <div className="path">
      {STEPS.map((s, i) => {
        const st = STATUS(i);
        return (
          <div key={s.id} className={`node ${st}`}
               onClick={() => st === 'cur' && onPick()}>
            <div className="marker" />
            <div className="node-text">
              <div className="node-title">{s.title}</div>
              {st === 'cur' && <div className="node-meta">наступне · ≈45 хв</div>}
              {st === 'future' && <div className="node-meta">пізніше</div>}
            </div>
            {st === 'cur' && <div className="node-cta">розкрити →</div>}
          </div>
        );
      })}
      <div className="path-end">шлях продовжується</div>
    </div>
  );
}

function MapConstellation({ onPick }) {
  const W = 800, H = 500;
  // map % positions to viewBox coordinates
  const pts = CONSTELLATION.map(c => [(c.x / 100) * W, (c.y / 100) * H]);
  // build dashed path between consecutive points
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  // accent the next segment (from current to next)
  const curIdx = STEPS.findIndex(s => s.current);
  const acc = pts[curIdx] && pts[curIdx - 1]
    ? `M ${pts[curIdx - 1][0]} ${pts[curIdx - 1][1]} L ${pts[curIdx][0]} ${pts[curIdx][1]}`
    : '';
  return (
    <div className="constellation">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d={d} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        {acc && (
          <path d={acc} fill="none" stroke="#22d3a6" strokeWidth="1.4"
                strokeDasharray="4 6" opacity="0.55" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {CONSTELLATION.map((c, i) => {
        const s = STEPS[i];
        const st = STATUS(i);
        return (
          <div key={s.id} className={`const-node ${st}`}
               style={{ left: c.x + '%', top: c.y + '%' }}
               onClick={() => st === 'cur' && onPick()}>
            <div className="dot" />
            <div className="label">{s.title}</div>
          </div>
        );
      })}
    </div>
  );
}

function MapTypographic({ onPick }) {
  return (
    <div>
      <div className="typo-list">
        {STEPS.map((s, i) => {
          const st = STATUS(i);
          return (
            <div key={s.id} className={`typo-row ${st}`}
                 onClick={() => st === 'cur' && onPick()}>
              <div className="typo-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="typo-title">{s.title}</div>
              <div className="typo-meta">
                {st === 'done' ? 'пройдено' : st === 'cur' ? 'наступне · ≈45 хв · розкрити →' : 'пізніше'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="typo-end">шлях продовжується</div>
    </div>
  );
}

// ── Step Detail ────────────────────────────────────────────────────────────
function DetailScreen({ onStart, onAnother }) {
  const d = STEP_DETAIL;
  return (
    <div className="stage anim-in">
      <div className="col-wide">
        <div className="detail">
          <div className="detail-head">
            <div className="eyebrow eyebrow-accent"><span className="dot" /> наступний крок · твій рівень</div>
            <h1 className="detail-title">{d.title}</h1>
          </div>
          <div className="detail-grid">
            <div className="detail-block">
              <div className="label">що ти зможеш</div>
              <div className="value">{d.doable}</div>
            </div>
            <div className="detail-block">
              <div className="label">що дізнаєшся технічно</div>
              <div className="value">{d.technical}</div>
            </div>
          </div>
          <div className="detail-foot">
            <div className="detail-time">{d.time} · {d.prereqs}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn-ghost" onClick={onAnother}>show me another →</button>
              <button className="btn btn-primary" onClick={onStart}>почати<span className="kbd">↵</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Prompt ─────────────────────────────────────────────────────────────────
function PromptScreen({ onDone, onBack }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROMPT_TEXT); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="prompt-stage anim-in">
      <div className="prompt-head">
        <div>
          <div className="eyebrow">step 04 · prompt</div>
          <div className="prompt-title">Скопіюй це в Claude.</div>
          <div className="prompt-sub">Відкрий claude.ai, встав, дай чату попрацювати. Повернись сюди, коли матимеш Vercel-лінк.</div>
        </div>
        <button className="btn-ghost" onClick={onBack}>← карта</button>
      </div>
      <div className="prompt-box">
        <div className="prompt-bar">
          <div className="prompt-bar-left">
            <span className="ic" />
            <span>prompt-04-prototype.txt</span>
            <span className="sep">·</span>
            <span style={{ color: 'var(--text-faint)' }}>{PROMPT_TEXT.length} символів</span>
          </div>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
            {copied ? 'скопійовано' : 'copy'}
          </button>
        </div>
        <div className="prompt-body">{PROMPT_TEXT}</div>
      </div>
      <div className="prompt-foot">
        <div className="meta">коли матимеш робочий прототип — повернись сюди.</div>
        <button className="btn btn-primary" onClick={onDone}>я зробила — далі</button>
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
  const projectName = display
    ? display.split('.')[0].replace(/-/g, ' ')
    : '';
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
            ≈45 хвилин тому ти не знала, що це можливо. <br />
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
              <div className="og-title">
                Прототип, який клікається.
              </div>
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

Object.assign(window, {
  StoryScreen, MapScreen, DetailScreen, PromptScreen, CompleteScreen,
});
