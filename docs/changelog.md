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

## 2026-05-24 — Checklist: секція "Наш план" + assignee фіча
**What:** Нова секція в чеклісті з 8 кроками фази дослідження. Assignee badge на кожен item — клік циклить L → V → нікому, зберігається в KV. Новий API endpoint /api/checklist/assign.
**Why:** Потрібне спільне місце де обидва бачать план і хто що робить. Чекліст вже є спільним інструментом — додали до нього замість нового файлу.

## 2026-05-24 — Гіпотези переписані під новий user moment
**What:** Старі H1/H2 замінені на H2 (meta-level paralysis), H4 (work-adjacent idea), H3 (wow moment). Архів старих гіпотез збережено в hypotheses.md з поясненням чому переглянули.
**Why:** Старі гіпотези описували paralysis всередині інструменту — суперечили pivot'у user moment від 2026-05-24. "Звідки знаю" тест показав що всі вони були assumptions без доказів на неправильному рівні.

## 2026-05-24 — User moment і product concept переосмислені
**What:** Повністю переписано user-snapshot.md. Новий запис в DECISIONS.md.
**Why:** Sounding session виявила що старий момент ("відкрив інструмент → злякався → закрив") — неправильний. Реальний тригер — соціальний (бачить колегу що вайткодить) → paralysis перед цілим AI-всесвітом ще до відкриття будь-якого інструменту. Product concept: ми entry point, відповідь на "з чого починати з AI взагалі." Wow момент = жива власна ідея в браузері.
