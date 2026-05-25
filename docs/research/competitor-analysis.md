# Аналіз конкурентів — It Depends
*UX AI Hackathon 2026 · Оновлено: 2026-05-25*
*Джерело: аналіз Влада + маппінг на product flow Люди*

---

## TL;DR для журі

Ми знайшли структурний gap, якого немає в жодного конкурента:
**перший AI output + персоналізований промпт + habit loop + нерозробницький контекст** — в одному продукті.

Bolt/Lovable дає швидкий output, але не вирішує blank slate (Оксана не знає що будувати).
Codecademy дає habit loop, але не AI-native і не для дизайнерів.
ChatGPT дає все — але порожнє поле. Ми генеруємо промпт за Оксану.

---

## Категорії конкурентів

### Навчання / skill-building

**Duolingo**
- Streak + identity: "Я вивчаю мову" → кожен урок підтверджує нову ідентичність
- DAUs виросли в 10 разів завдяки стрікам; Self-Determination Theory — юзер сам ставить ціль → ownership
- Що не перекладається: їх дія атомарна (1 урок = 5 хв, щодня). "Робити AI" поки не атомарне для Оксани
- **Що беремо:** структуру identity loop. Ціль — щоб кожен AI build відчувався як "Я — людина, що будує з AI"

**Codecademy / Mimo**
- Перший working output за < 5 хвилин → ownership до complexity
- Дає контекст ("зроби contact form"), дає рейки, output є в кінці сесії 1 — звичка приходить ПІСЛЯ першого wow
- Що не перекладається: юзер все одно обирає "Хочу навчитись кодингу" — Оксана ще не обрала "хочу AI"
- **Що беремо:** найближча структурна паралель. "Перший AI проєкт дизайнера" = "перша програма запустилась"

**Brilliant.org**
- Щоденний 5-хвилинний challenge будує звичку через повторення
- **Що беремо:** формат "щотижневий AI виклик" — малий commitment, повторюваний, дає причину повернутись

**Headspace**
- Return-after-break UX: вітає після перерви, дає бонус, не лає за лапс
- **Що беремо:** UX повернення після паузи. Оксана зникне на тиждень — як ми її вітаємо коли вона повертається?

---

### Fitness / identity-building

**Nike Run Club**
- Щотижневий (не щоденний!) streak: пропущений день через відпочинок ≠ провал
- Накопичувальні milestones (100 км / 500 км lifetime) — identity через cumulative proof
- **Що беремо:** тижневий каденс, не щоденний. Зайнята mid-level дизайнерка. Daily pressure → churn. Weekly → звичка
- **Що беремо:** lifetime counter "Ти зробила X AI проєктів" — слабкий але cheap identity signal

**Strava**
- Social proof loop: колеги бачать твої пробіжки → obligation + pride
- "Колега бачить твій run" = "колега бачить твій AI build в Slack"
- **Що беремо:** Slack-sharing момент — це наш Strava. Проектуємо його явно, не випадково

---

### AI / creation tools

**Bolt / Lovable**
- Prompt → working app за ~60 секунд, zero setup
- Слабкість: presupposes юзер знає що будувати. Немає guidance на "що", немає habit loop
- **Що НЕ беремо:** конкурувати по швидкості output — програємо. Наша перевага в "ДО"

**Figma / FigJam community**
- Галерея чужих робіт як inspiration + "duplicate and start"
- **Що беремо:** галерея "що DataArt дизайнери вже побудували з AI" — прямо вирішує H4 (Оксана не може назвати свою ідею). Browse examples → знижує activation energy

---

## Доведені механіки утримання

| Механіка | Як працює | Кращий приклад | Для нас |
|---|---|---|---|
| **Streak (тижневий)** | Loss aversion — не рвати ланцюжок | NRC (тижневий), Duolingo (щоденний) | Тижневий каденс — busy дизайнерка, daily зробить churn |
| **Момент ownership** | Перший working output фіксує ідентичність | Codecademy перший run, NRC перший забіг | Має статися в сесії 1, в хвилину ~5 |
| **Видима прогресія** | Незавершений бар тригерить Zeigarnik | Codecademy skill path, Headspace map | Важливо для multi-step AI build flow |
| **Соціальний свідок** | Публічний output → accountability | Strava kudos, Slack sharing | Проектуємо Slack share явно |
| **Warm re-engage** | Привітання після перерви → конвертує lapsed юзерів | Duolingo return flow | Критично — Оксана зникне, плануємо з дня 1 |
| **Template як стартер** | Smart defaults вбивають analysis paralysis | Figma community, Asana templates | Напряму вирішує H4 |
| **Reinforcement ідентичності** | Кожна дія = малий доказ нової identity | NRC "Я — runner", Duolingo "Я — learner" | Target: "Я — людина що будує з AI" |
| **Генерований промпт** | Blank slate → вже є перший крок | **Немає прямого аналога** | Наш головний диференціатор від Bolt і ChatGPT |

---

## Структурний gap — де ми

```
Bolt / Lovable        Codecademy             It Depends (target)
──────────────        ──────────────         ────────────────────────
Швидкий output        Guided path            Перший AI output
Не знає що будувати   Habit mechanics        + персоналізований промпт
Немає habit loop      Generic coding         + контекст дизайнера
                      Не AI-native           + habit formation
                      Не для нерозробників   + blank slate solved
```

**Gap одним реченням:** немає продукту який поєднує "перший момент AI ownership" + "повертає юзера знову" + "для нерозробників які ще не знають що будувати."

---

## Маппінг на наш product flow

*(flow з брейншторму: онбординг → свайп → промпт → будує → "Зробила" → URL → Slack → нова петля)*

| Крок нашого flow | Конкурент-референс | Що конкретно переносимо |
|---|---|---|
| **3 онбординг-питання** (рівень / біль / доступ) | Duolingo: user sets own goal | Питання мають відчуватись як "він мене розуміє", не "анкета". Max 3 click-through. |
| **Свайп між пропозиціями** | Figma community: browse → "Хочу таке" | Пропозиції = конкретні work-adjacent ідеї, не абстрактні теми. Показуємо result ("ти отримаєш X"), не назву проєкту |
| **Генерований промпт** | *Немає аналога* | Це наш головний диференціатор. Bolt дає порожній input. Ми даємо готовий prompt. Оксана копіює → вставляє → перший крок зроблено |
| **Оксана іде будувати** (off-app) | Codecademy: sandbox в браузері | В v1 ми не контролюємо цей крок. Але повинні показати куди йти (v0 link, Claude Code link) |
| **Кнопка "Зробила"** | NRC: "Log run" | Мікродія яка фіксує ownership. Має бути видимою і значимою, не дрібним checkbox |
| **Живий артефакт з URL** | Codecademy: working output | Це момент H3 (wow). URL = доказ. Дизайн сторінки артефакту важливий — вона буде в Slack |
| **Share в Slack** | Strava: public activity | Проектуємо явно: pre-filled text + один клік. Колега бачить → social trigger для нової Оксани |
| **Повернення** | Headspace return flow, NRC weekly | "Наступна ідея чекає" — не "ти пропустила 3 дні". Warm re-engage без вини |

---

## Що НЕ копіюємо — і чому

| Механіка | Чому не беремо |
|---|---|
| **Daily streak** | Busy дизайнер → пропущений день → churn. NRC довів що weekly надійніше для sporadic learners |
| **XP / бейджі / leaderboard** | Нам потрібен 1 wow-момент, не gamification шар. Додаємо після прототипу, якщо взагалі |
| **Конкурувати по швидкості output** | Bolt/Lovable завжди будуть швидше. Наша перевага — не швидкість, а "знати що будувати" |
| **In-app build environment** | Out of scope v1. Ми генеруємо промпт → юзер іде в v0/Claude Code → повертається |
| **Складний onboarding** | Кожна хвилина до першого output = attrition. Онбординг = 3 питання, не tutorial |

---

## Дизайн-рішення які випливають з аналізу

1. **Тижневий каденс** — не щоденний. Weekly return reason (NRC модель)
2. **Templates — це продукт, не милиці** — >50% юзерів не можуть назвати ідею (H4). Figma community довела що це масштабується
3. **Slack share — явна фіча, не afterthought** — Strava mechanic. Момент "колега бачить твій build" = new loop trigger
4. **Return-after-lapse UX — з дня 1** — Headspace модель. Оксана зникне на два тижні. Що вона бачить коли повертається?
5. **Ownership moment в хвилину 5** — Codecademy модель. Кожна хвилина setup до першого output = ризик втрати юзера
6. **Промпт-генератор — головний диференціатор** — немає прямого аналога. ChatGPT дає порожнє поле → Оксана не знає що писати. Ми знаємо — бо зібрали рівень, біль, контекст. Генеруємо за неї

---

## Відкриті питання після аналізу

- Чи є у нас "повторна ідея" після першого build? Або одного wow достатньо? (H3 kill criteria)
- Як виглядає return flow якщо Оксана прийшла без конкретної нової ідеї?
- Галерея DataArt builds — scope v1 чи v2? (вирішує H4 cheaply)
- Тижневий challenge — готовий prompt щотижня? Хто його готує?

---

## Джерела

Оригінальний competitor research: Влад (Claude chat, 2026-05-25)
Product flow reference: Люда (docs/log/liuda.md, 2026-05-25)
- Nike Run Club gamification analysis — trophy.so, April 2026
- Duolingo engagement and retention — iDevie, October 2024
- Duolingo gamification case study — StriveCloud, May 2026
- Habit-building gamification deep dive — Naavik, March 2024
- App engagement strategies 2026 — StriveCloud
- Gamification trends 2025 — StudioKrew
- Codecademy AI features — Skillsoft, February 2024
