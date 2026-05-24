# Decisions

Format: `## YYYY-MM-DD — Title`
Each decision includes: context, options considered, what we chose, why.

---

## 2026-05-23 — Repo structure

**Context:** Need one repo for both product (Vercel deploy) and team docs.

**Decision:** Flat docs at root + `docs/` folder for deeper content. Product code will go in `src/` when we know the stack.

**Why:** Docs at root are immediately visible on GitHub. `docs/` keeps research organized. CLAUDE.md ties it together as AI context.

---

## 2026-05-23 — Interview approach

**Context:** Hypothesis is draft. Need real user data before deciding on format.

**Decision:** Corridor interviews with 2-3 DataArt designer colleagues before building anything.

**Why:** The moment of friction ("open tool → feel gap → close it") needs to be confirmed and detailed. We don't want to build for an assumed pain point.

**Interview questions (draft):**
1. How do you currently use AI in your work?
2. Was there a moment when you tried a new AI tool and closed it? What happened?
3. What did you feel in that moment — what exactly stopped you?
4. What would have made you stay?
5. What would "one concrete next step" look like for you?

---

## 2026-05-24 — Переосмислення user moment і product concept

- **Стадія:** discovery
- **Тип:** product
- **Впевненість:** гіпотеза

**Що вирішили:** Старий user moment (відкрив інструмент → злякався → закрив) — неправильний. Реальний момент є раніший і соціально-тригерований. Product concept змінився: ми не "допоміжний інструмент до AI tools" — ми entry point, відповідь на питання "з чого починати з AI взагалі."

**Чому:** User snapshot був pre-interview assumption. Реальний тригер — бачить колегу що зробив щось з AI (vibe coding) → розуміє що AI це цілий новий всесвіт (агенти, GitHub, бази даних) → paralysis ще до відкриття будь-якого інструменту. Wow момент для дизайнера ≠ "розібратись з інструментом" — це "реалізувати свою маленьку ідею і побачити що вона живе."

**Альтернативи:** Залишити старий момент, будувати tool-specific onboarding → відхилено, бо проблема виникає до відкриття будь-якого конкретного інструменту.

**Відкриті питання:**
- Як Оксана дізнається що наш продукт існує?
- Що конкретно є її "маленькою ідеєю" — звідки вона береться?
- Чи вистачає одного wow моменту щоб вона продовжила, чи потрібна підтримка далі?

---

## 2026-05-24 — Переписати гіпотези під новий user moment

- **Стадія:** discovery
- **Тип:** product
- **Впевненість:** гіпотеза

**Що вирішили:** Старі H1/H2 описували paralysis всередині інструменту — не відповідають новому user moment. Нові гіпотези: H2 (meta-level paralysis до відкриття будь-якого тулу), H4 (work-adjacent idea), H3 (wow moment, тест через прототип). Фокус дослідження — H2 і H4 як найкритичніші.

**Чому:** "Звідки знаю" тест показав що старі гіпотези — assumptions рівня інструменту, а наш pivot визначив проблему на meta-рівні. Гіпотеза має відповідати рівню проблеми яку вирішуємо — інакше тестуємо не те.

**Альтернативи:** Залишити старі + додати нові → відхилено, бо вони суперечать одне одному і розмивають фокус дослідження.

**Відкриті питання:**
- H2: paralysis справді meta-level чи все ж tool-level? → перевірити в інтерв'ю
- H4: дизайнер має work-adjacent ідею чи треба давати шаблони? → перевірити в інтерв'ю

## 2026-05-24 — Survey v2: переписати питання за результатами UX-review

- **Стадія:** discovery
- **Тип:** product
- **Впевненість:** робоче

**Що вирішили:** Повністю переписали питання опитувальника на основі UX-review. Q2 розширено до психологічних блокерів (час, довіра, ROI, контекст використання). Q1 отримав нейтральний framing. Q4 переформатовано як statement completion.

**Чому:** V1 мала три проблеми: (1) leading framing в Q1 ("треба нарешті") підштовхував до socially desirable відповідей; (2) Q2 був tool-oriented і не давав можливості обрати психологічні блокери — страх, недовіру, відсутність часу; (3) Q4 описувала prescription ("хтось скаже що робити") замість реакції на demonstration. Дані з v1 дали б спотворену картину.

**Альтернативи:** Залишити v1 і зібрати дані → відхилено, бо missing categories в Q2 означали б що навіть при 20+ відповідях ми б не побачили найпоширеніші реальні блокери.

**Відкриті питання:**
- Чи стане Q2 з 8 варіантів надто довгим для мобільного?
- Після збору даних: чи підтвердяться психологічні блокери як більш масові за технічні?

---
