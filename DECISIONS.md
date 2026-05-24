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
