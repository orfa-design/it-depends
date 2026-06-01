# Vlad — thinking in progress

Intermediate thoughts, half-baked ideas, observations.
Not decisions — those go in /DECISIONS.md after synthesis.

---

## 2026-06-01 — v2 redesign: OKLCH design system + liquid glass UI

**Що робили:**
Переписали весь фронт It Depends під новий дизайн (Promptpath-референс): OKLCH mint токени, liquid glass, bento-layout, rail+detail флоу.

**Що зробили конкретно:**

1. **Design token system** — `styles/design-tokens.css`: єдиний mint акцент `oklch(0.74 0.15 170)`, surface/ink/border/glow змінні, light theme через `[data-theme="light"]`.

2. **Новий v2-шар роутів** (поверх старого calibrate):
   - `/login` — імʼя юзера → localStorage
   - `/gallery` — 27 кроків, фільтри (зусилля/категорія/тип), «Для тебе» реко-ряд
   - `/map` — Promptpath-стиль: рейка зліва (7 кроків маршруту, спайн із дашів, статуси) + контент справа в bento-склі; фіксована висота viewport, лише внутрішній скрол
   - `/progress` — активні in-progress кроки
   - `/step/[id]` — bento main-card зліва (промпт, інструкції, фази) + sidebar-вікна справа (дії, огляд фаз, related, нотатки)
   - `/step/[id]/done` — completion screen з liquid-glass карткою і мятним глоу

3. **Data layer**:
   - `lib/steps-v2.ts`: v1→v2 адаптер, маппить всі 27 реальних кроків з `STEPS_EXTRA` (stages, prompts, expect→instructions, levelUp→processNotes, relatedSteps, effort)
   - `lib/progress-v2.ts`: localStorage progress з фіксом синхронізації бейджа (рахує тільки валідні v2 id)

4. **Calibrate → Map злиття**: фінал «ГОТОВО → подивитися карту» тепер веде на `/map`, а не на старий внутрішній map-екран. Skip → `/gallery`.

5. **Liquid glass всюди**: `backdrop-filter: blur(24px) saturate(1.5)` + `linear-gradient` + inset-sheen + `var(--shadow-panel)` на всіх картках/вікнах.

6. **Чистка v1**: видалено `active, checklist, done, profile, start, survey, workflow` + `api/checklist, api/survey, api/workflow` — залишились тільки v2-роути.

7. **UX fixes під час обходу**:
   - Бейдж «Активні N» розходився з `/progress` через застарілий localStorage id (`meeting-summary` vs `summary-meeting`) → зробили `countInProgress` стійким
   - Паддінг вузла рейки (лівий відступ не збігався зі спайном)
   - `/map` сторінка скролилась ззовні → зафіксував через `height: 100dvh; overflow: hidden` на `.map2-page`

**Що вийшло:**
IA: `login → calibrate → map ⇄ gallery → step → done + progress`. Єдина мапа, єдиний liquid-glass стиль, 27 реальних кроків з повним контентом.

**Що не зробили (свідомо):**
- CMS / KV-бекенд — зберігаємо в localStorage (PoC)
- Старий `/calibrate` внутрішній map-екран лишився (не видалений, просто недосяжний через навігацію)

**Коміт:** `94fe421` на `orfa-design/it-depends` main.

---

