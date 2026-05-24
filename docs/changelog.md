# Changelog

Auto-maintained by Claude. Do not edit manually.

---

## 2026-05-23 — Project structure set up
**What:** Created repo structure with CLAUDE.md, DECISIONS.md, docs/, thinking files, brief.
**Why:** Need shared context for two-person team and AI instances working in parallel.

## 2026-05-23 — Hackathon brief added
**What:** Added original brief to docs/brief.md.
**Why:** Primary source of constraints and evaluation criteria — needs to be readable by both Claude instances.

## 2026-05-23 — Git sync check added
**What:** Added rule to CLAUDE.md to always ask about git pull before writing to docs.
**Why:** Prevent working on stale files when two people push independently.

## 2026-05-23 — Iteration logging automated
**What:** Claude now auto-appends to docs/changelog.md after every meaningful action.
**Why:** Jury evaluates iterative process — log must exist without adding overhead to the team.

## 2026-05-24 — UX decision partner exercise references added
**What:** 5 facilitation guides added to docs/ux-exercises/ (user snapshot, JTBD, competitor map, hypotheses, scope tree).
**Why:** anthropic-skills:ux-decision-partner skill вже встановлений, але без reference файлів. Поклали в проект щоб були доступні без автотригера.

## 2026-05-24 — Shared Claude Code hooks configured
**What:** .claude/settings.json з двома хуками: UserPromptSubmit (git fetch — попереджає якщо тімейт пушив) + PostToolUse (нагадування після git push оновити changelog).
**Why:** Поведінкові інструкції в CLAUDE.md ненадійні — Claude забуває. Хуки гарантують виконання. settings.json в git → Влад отримає після git pull.
