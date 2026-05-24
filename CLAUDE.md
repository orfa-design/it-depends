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

Format for each entry:
```
## YYYY-MM-DD — Short title
**Що робив/ла:** what was done and the context around it
**Чому саме так:** reasoning, what drove the decision
**Що вийшло:** outcome, what exists now that didn't before
**Що здивувало:** surprises, obstacles, unexpected learnings (if any)
**Наступний крок:** what comes next
```

**After every `git push`:** ask the user "Зафіксувати цей пуш в лозі?" —
if yes, write a new entry to their log file, then push the log update too.

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
