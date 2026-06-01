'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './presentation.css';

// Scroll order mirrors the live running order:
// Problem → Hypothesis → Research → Team → Tools → Flow → Prototype(→demo) → Closing
const RAIL = [
  { id: 'problem', label: '01 · Проблема' },
  { id: 'hypothesis', label: '02 · Гіпотеза' },
  { id: 'journey', label: '03 · Дослідження' },
  { id: 'team', label: '04 · Команда' },
  { id: 'tools', label: '05 · Інструменти' },
  { id: 'flow', label: '06 · Як працює' },
  { id: 'prototype', label: '07 · Прототип' },
];

export default function PresentationPage() {
  const scrollerRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1); // -1 = hero, RAIL idx, RAIL.length = closing
  const [railShow, setRailShow] = useState(false);

  // Progressive enhancement: enable reveal animations only after mount
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    root.classList.add('anim-ready');

    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-snap]'));
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObs.unobserve(e.target);
          }
        });
      },
      { root, threshold: 0.15 }
    );
    reveals.forEach((el) => revealObs.observe(el));

    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActiveIdx(idx);
            setRailShow(idx >= 0 && idx < RAIL.length);
          }
        });
      },
      { root, threshold: 0.55 }
    );
    sections.forEach((el) => secObs.observe(el));

    return () => {
      revealObs.disconnect();
      secObs.disconnect();
    };
  }, []);

  // Keyboard navigation: arrows / space / page keys move between snap sections
  const goTo = useCallback((targetIdx: number) => {
    const root = scrollerRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-snap]'));
    const clamped = Math.max(0, Math.min(sections.length - 1, targetIdx + 1)); // +1: hero is index 0
    sections[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const tag = (ev.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (['ArrowDown', 'PageDown', ' '].includes(ev.key)) {
        ev.preventDefault();
        goTo(activeIdx + 1);
      } else if (['ArrowUp', 'PageUp'].includes(ev.key)) {
        ev.preventDefault();
        goTo(activeIdx - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, goTo]);

  const jumpToRail = (railIdx: number) => goTo(railIdx);

  return (
    <main className="presentation" ref={scrollerRef} tabIndex={-1}>
      {/* Map-rail (desktop) */}
      <nav className={`rail ${railShow ? 'show' : ''}`} aria-label="Розділи презентації">
        {RAIL.map((n, i) => (
          <button
            key={n.id}
            className={`rail-node ${i === activeIdx ? 'active' : ''} ${i < activeIdx ? 'done' : ''}`}
            onClick={() => jumpToRail(i)}
            aria-current={i === activeIdx ? 'true' : undefined}
          >
            <span className="marker" aria-hidden />
            <span className="rl">{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Progress dots (mobile) */}
      <div className="dots" aria-hidden>
        {RAIL.map((n, i) => (
          <span key={n.id} className={`d ${i === activeIdx ? 'active' : ''}`} />
        ))}
      </div>

      {/* ---------- Hero ---------- */}
      <section className="sec hero" data-snap data-idx={-1}>
        <div className="hero-inner">
          <div className="wordmark reveal">
            <span className="glow" aria-hidden />
            <span>·</span> <b>It Depends</b> <span>— UX AI Hackathon 2026</span>
          </div>
          <h1 className="hero-title reveal d1">
            Your <span className="accent">Move</span>
          </h1>
          <p className="hero-tag reveal d2">
            Допомагаємо зробити перший крок від наміру до дії з&nbsp;AI.
          </p>
          <div className="hero-meta reveal d3">
            <span>Liuda&nbsp;+&nbsp;Vlad</span>
            <span>·</span>
            <span>decomposition&nbsp;+&nbsp;micro-start</span>
            <span>·</span>
            <span>2&nbsp;червня&nbsp;2026</span>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden>
          <span className="bar" />
          <span>скрол / стрілки</span>
        </div>
      </section>

      {/* ---------- 01 Problem ---------- */}
      <section className="sec" id="problem" data-snap data-idx={0}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">01</span> Проблема</span>
          <h2 className="h-display reveal d1">Чому намір не&nbsp;стає&nbsp;дією?</h2>
          <p className="lead reveal d2">Дизайнер уже користується AI щодня. Не&nbsp;новачок.</p>
          <p className="lead dim reveal d2">
            Бачить, як колега за вечір зібрав щось живе з&nbsp;AI&nbsp;— і завмирає.
            Страшно стає ще <span className="hi">до</span> того, як відкрив інструмент.
            Не «я спробував і не вийшло», а «це явно не для мене».
          </p>
          <div className="pull reveal d3">Це не лінь. Це&nbsp;UX-проблема першого&nbsp;кроку.</div>
        </div>
      </section>

      {/* ---------- 02 Hypothesis ---------- */}
      <section className="sec" id="hypothesis" data-snap data-idx={1}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">02</span> Гіпотеза</span>
          <h2 className="h-display reveal d1">Знизити вартість&nbsp;входу.</h2>
          <p className="lead reveal d2">
            Проблема не в браку інформації. <span className="hi">Завеликим здається перший крок.</span>
          </p>
          <p className="lead dim reveal d2">
            Тож знижуємо activation energy&nbsp;— поки мозок не встиг передумати.
            Не мотивувати і не нагадувати, а прибрати висоту порога.
          </p>
          <blockquote className="jtbd reveal d3">
            «Коли я бачу, що колеги роблять з AI щось реальне → хочу зробити перший крок
            від слів до <span className="hi">живого результату</span> → щоб перестати відчувати,
            що це не для&nbsp;мене.»
          </blockquote>
          <p className="kicker-note reveal d4">Не «вивчити AI». Перестати почуватись виключеним.</p>
          <p className="kicker-note reveal d4" style={{ marginTop: '0.6em', color: 'var(--faint)' }}>
            Чому працює: петлю замкнено трьома моделями&nbsp;— BJ&nbsp;Fogg Tiny&nbsp;Habits · Hook&nbsp;Model · Fogg&nbsp;B=MAP.
          </p>
        </div>
      </section>

      {/* ---------- 03 Research / iteration journey ---------- */}
      <section className="sec" id="journey" data-snap data-idx={2}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">03</span> Дослідження</span>
          <h2 className="h-display reveal d1">Рішення вистраждане, не&nbsp;вгадане.</h2>
          <p className="lead dim reveal d2">
            1 глибинне інтервʼю · опитування 10 · конкурентний аналіз. Що це змінило:
          </p>
          <div className="iters">
            <div className="iter reveal d1">
              <div className="ba before"><span className="tag">БУЛО</span><span className="v">Страх настає, коли відкрив інструмент.</span></div>
              <span className="sep">→</span>
              <div className="ba after"><span className="tag">СТАЛО</span><span className="v">Набагато раніше&nbsp;— і тригер соціальний.</span></div>
            </div>
            <div className="iter reveal d2">
              <div className="ba before"><span className="tag">БУЛО</span><span className="v">Продукт для новачка в&nbsp;AI.</span></div>
              <span className="sep">→</span>
              <div className="ba after"><span className="tag">СТАЛО</span><span className="v">Не новачок. І часто не бачить, що AI взагалі вміє&nbsp;— показуємо можливе.</span></div>
            </div>
            <div className="iter reveal d3">
              <div className="ba before"><span className="tag">БУЛО</span><span className="v">«Немає ідей.»</span></div>
              <span className="sep">→</span>
              <div className="ba after"><span className="tag">СТАЛО</span><span className="v">Тут же називає 3 конкретні автоматизації. Не питаємо «що хочеш»&nbsp;— показуємо можливе.</span></div>
            </div>
          </div>
          <p className="iter-foot reveal d4">
            Чотири гіпотези: щось <span className="hi">підтвердили</span> опитуванням, щось&nbsp;—
            <span className="hi"> вбили</span>. Гіпотези в нас не прикраса.
          </p>
        </div>
      </section>

      {/* ---------- 04 Team / collaboration ---------- */}
      <section className="sec" id="team" data-snap data-idx={3}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">04</span> Команда</span>
          <h2 className="h-display reveal d1">Процес теж <span className="accent">інженерія</span>.</h2>
          <p className="lead dim reveal d2">
            Двоє людей, дві окремі сесії Claude, один репозиторій як спільний мозок.
          </p>
          <div className="tool-cols">
            <div className="tool-card reveal d1">
              <h3><span className="i">①</span>Спільний мозок</h3>
              <p>Гілки, мерджі, авто-деплій на Vercel при кожному пуші. Живий лінк&nbsp;— завжди.</p>
            </div>
            <div className="tool-card reveal d2">
              <h3><span className="i">②</span>Робот-тімейт</h3>
              <p>Не дає правити спільне на застарілій версії, переказує, що напарник зробив, нагадує оновити журнал.</p>
            </div>
            <div className="tool-card reveal d3">
              <h3><span className="i">③</span>Думання ≠ рішення</h3>
              <p>Сирі ідеї&nbsp;— окремо. Синтез&nbsp;— разом. Узгоджене&nbsp;— стає рішенням у документації.</p>
            </div>
          </div>
          <p className="kicker-note reveal d4">
            Правила&nbsp;— це наміри. <span className="hi" style={{ color: 'var(--primary)' }}>Автоматика&nbsp;— це гарантії.</span>
          </p>
        </div>
      </section>

      {/* ---------- 05 Tools ---------- */}
      <section className="sec" id="tools" data-snap data-idx={4}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">05</span> Інструменти</span>
          <h2 className="h-display reveal d1">AI на двох&nbsp;рівнях.</h2>
          <div className="tool-cols">
            <div className="tool-card reveal d1">
              <h3><span className="i">①</span>Будує продукт</h3>
              <div className="chips">
                <span className="chip mint">Claude Code</span>
                <span className="chip">ux-decision-partner</span>
                <span className="chip">design-critique</span>
                <span className="chip">impeccable</span>
                <span className="chip">Mobbin MCP</span>
              </div>
            </div>
            <div className="tool-card reveal d2">
              <h3><span className="i">②</span>Живе в продукті</h3>
              <div className="chips">
                <span className="chip mint">генерація задачі під рівень</span>
                <span className="chip">Claude.ai</span>
                <span className="chip">Claude Code</span>
                <span className="chip">Figma Make</span>
                <span className="chip">AI Studio</span>
              </div>
            </div>
          </div>
          <div className="stack-row reveal d3">
            <span className="chip">Next.js 15</span>
            <span className="chip">Vercel + KV</span>
            <span className="chip">d3-force</span>
            <span className="chip">Material UI</span>
            <span className="chip">DataArt icons</span>
          </div>
        </div>
      </section>

      {/* ---------- 06 User Flow ---------- */}
      <section className="sec" id="flow" data-snap data-idx={5}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">06</span> Як це працює</span>
          <h2 className="h-display reveal d1">Від тертя до дії&nbsp;— за один&nbsp;крок.</h2>
          <div className="flow">
            <div className="flow-step reveal d1">
              <span className="n">1</span>
              <span className="t">Реагуєш на картки колег: <b>«о, круто» / «це я знаю» / «не моє»</b>.</span>
            </div>
            <div className="flow-step reveal d2">
              <span className="n">2</span>
              <span className="t">Збирається персональний маршрут&nbsp;— <b>активний крок завжди один</b>.</span>
            </div>
            <div className="flow-step reveal d3">
              <span className="n">3</span>
              <span className="t">Готовий промпт, який інструмент відкрити, і як зрозуміти, що вийшло.</span>
            </div>
            <div className="flow-step reveal d4">
              <span className="n">4</span>
              <span className="t">Зробив → результат-посилання → кидаєш колезі → <b>петля замикається</b>.</span>
            </div>
          </div>
          <p className="kicker-note reveal d4">
            Не питаємо «що хочеш зробити». Показуємо, що&nbsp;можливо.
          </p>
        </div>
      </section>

      {/* ---------- 07 Prototype (демо-лаунчпад) ---------- */}
      <section className="sec" id="prototype" data-snap data-idx={6}>
        <div className="sec-inner">
          <span className="eyebrow reveal"><span className="dot" /><span className="num">07</span> Прототип</span>
          <h2 className="h-display reveal d1">Це не макет. Воно&nbsp;<span className="accent">живе</span>.</h2>
          <p className="lead dim reveal d2">
            Проблема не в навігації, а в першому кроці. Наша відповідь&nbsp;— рівно один крок.
            Ось як&nbsp;→
          </p>
          <a className="proto-cta reveal d2" href="/v2">
            Відкрити прототип <span className="arrow">→</span>
          </a>
          <div className="shots">
            <div className="shot reveal d2"><span className="label">screenshot: /v2 калібрування</span><span className="sub">картки колег · wow / heard / skip</span></div>
            <div className="shot reveal d3"><span className="label">screenshot: /v2 мапа</span><span className="sub">маршрут · активний вузол</span></div>
            <div className="shot reveal d4"><span className="label">screenshot: /v2 крок → done</span><span className="sub">результат + share</span></div>
          </div>
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      <section className="sec closing" data-snap data-idx={7}>
        <div className="sec-inner">
          <h2 className="h-display reveal">Ми даємо <span className="accent">один крок</span>.</h2>
          <p className="sub reveal d1">
            Після якого людина перестає думати, що AI&nbsp;— це не для&nbsp;неї.
          </p>
          <div className="meta reveal d2">
            <span>It Depends</span>
            <span>·</span>
            <span>Дякуємо.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
