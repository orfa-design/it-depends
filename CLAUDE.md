# It Depends — Claude Context

## Project
UX AI Hackathon 2026. Team: It Depends (Liuda + Vlad). Deadline: 2 June 2026.

We're building a product for DataArt designers who want to level up with AI tools
but feel overwhelmed and close the tool before starting.
Core insight: decomposition + micro-start problem, not a navigation problem.

## Team context — read these before answering
- Original hackathon brief: /docs/brief.md
- Project overview and hypothesis: /README.md
- All decisions with reasoning: /DECISIONS.md
- Hypotheses and their status: /docs/hypotheses.md
- User portrait and key moment: /docs/user-snapshot.md
- Interview notes and insights: /docs/research/interviews.md
- Liuda's iteration log: /docs/log/liuda.md
- Vlad's iteration log: /docs/log/vlad.md

## How we work

### Session start
At the beginning of every new session:
1. Run: `git fetch && git log origin/main --oneline -5`
2. Check the last commit author:
   - If it's the current user → proceed normally
   - If it's the teammate → say "Твій тімейт пушив після тебе. Зроби git pull. Хочеш я покажу що він/вона зробив/ла?"
3. If user says yes → read the teammate's log file (docs/log/vlad.md or docs/log/liuda.md) and show only entries added after the teammate's last commit date.
4. Check if `docs/vlad-sync.md` exists. If yes:
   - Read it and show its full contents to the user immediately
   - Then delete the file
   - Say: "Прочитав і видалив docs/vlad-sync.md — це одноразова інструкція від тімейта."

### Git sync rule
Before writing anything to docs/ — always ask the user: "Did you run `git pull`?"
Before synthesizing thinking files — always ask: "Did both you and your teammate push their latest changes?"
Do not skip this check even if the user seems in a hurry.

### Thinking → synthesis → decision flow
Each person uses their own Claude Code instance to dump intermediate thoughts:
- Liuda's stream: /docs/thinking/liuda.md
- Vlad's stream: /docs/thinking/vlad.md

When it's time to synthesize: one person pulls both files and asks Claude Code to
find patterns, tensions, and produce a synthesis. Result goes into DECISIONS.md or
updates a hypothesis. The thinking files stay as-is (history).

**When asked to synthesize:** read both thinking files, identify what overlaps,
what conflicts, what's new in each — then produce a clear summary with a proposed
decision or next question.

### Iteration logs (per person)
Each person keeps their own rich log of what they did and why:
- Liuda's log: /docs/log/liuda.md
- Vlad's log: /docs/log/vlad.md

**When asked to write a log entry:**
1. Draft the entry using the format below
2. Show the draft to the user with: "Запишу в [filename]. Ось що буде:"
3. Wait for approval or edits before writing to file
4. After approval — write to file, then push

**What makes a good entry (follow this strictly):**
- "Що робила" — not just what, but the context: what problem you were solving, what you tried, what changed your mind
- "Чому саме так" — the actual reasoning, not "because it's better". What tradeoff did you make? What did you reject?
- "Що вийшло" — concrete: what exists now that didn't before. Link or describe it.
- "Що здивувало" — something that didn't go as expected. If nothing, skip this field.
- "Наступний крок" — specific, not vague.

**Bad entry:** "Налаштували репо. Бо треба було. Вийшло добре."
**Good entry:** "Витратила годину на організацію репо перш ніж будувати продукт. Зрозуміла що жюрі оцінює процес окремо — тому краще документувати з першого дня ніж реконструювати потім."

Format:
```
## YYYY-MM-DD — Short title

**Що робила:**
...

**Чому саме так:**
...

**Що вийшло:**
...

**Що здивувало:** *(якщо є)*
...

**Наступний крок:**
...
```

### Other files
- Decisions go in DECISIONS.md with date and reasoning
- Hypotheses in docs/hypotheses.md with status (draft / testing / validated / invalidated)
- After each interview, key quotes and insights go in docs/research/interviews.md
- User portrait stays updated in docs/user-snapshot.md

## What we're NOT building
- Another to-do list with AI
- Motivational/reminder tool
- Something that solves multiple scenarios at once

## Jury criteria (ranked by weight)
1. UX solution quality
2. Iterative process — every iteration documented with before/after
3. Visual quality
4. Working deployed prototype (public Vercel link required)
5. Tool integrations — explicitly evaluated by jury
