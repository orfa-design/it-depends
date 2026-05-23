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
