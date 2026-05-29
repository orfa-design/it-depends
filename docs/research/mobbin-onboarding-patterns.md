# Mobbin Research — Onboarding UI Patterns

**Date:** 2026-05-29
**Author:** Vlad
**Tool:** Mobbin MCP (web platform, deep search)
**Purpose:** Visual reference for It Depends onboarding — step map design, micro-start UX, overwhelm reduction patterns

---

## Context

Searched Mobbin for onboarding screens relevant to our core problem:
> Designers who feel overwhelmed opening AI tools and close before starting.
> Our solution: decomposition + micro-start via a step-node journey map.

Three search queries ran in parallel:
- "step by step onboarding journey path with progress map"
- "learning skill progression roadmap beginner onboarding"
- "guided first-time user experience reduce overwhelm start small"

---

## Category 1 — Journey Map / Path Metaphor

Directly mirrors our step-node map concept.

### Duolingo — Path Map (web)
[View on Mobbin](https://mobbin.com/screens/0cb260f2-d3ee-4afe-a3ab-b1f2baac61e0)

Winding vertical path with locked/completed/active node states:
- Completed = green circle with checkmark
- Active = highlighted node with tooltip popup
- Locked = grey circle, visually de-emphasised

**Why relevant:** Validates our visual direction. Shows that a map with 20+ nodes doesn't feel overwhelming if locked states are clearly greyed out — users focus only on the active step.

**What to take:** The visual hierarchy between active/completed/locked states. Don't make locked steps prominent.

---

### Duolingo — Active Node Tooltip (web)
[View on Mobbin](https://mobbin.com/screens/bf1baa63-a593-4155-aeb9-f027ec53355f)

Popover on active node shows: step title, lesson counter ("Lesson 1 of 6"), and a single CTA ("START +10 XP").

**Why relevant:** Shows how to surface just enough info to start without opening a new page. The gamification element (XP) creates low-stakes commitment.

**What to take:** Single-action CTA on the active node. No wall of text.

---

## Category 2 — AI Tool Onboarding

Closest product domain to ours — tools that are powerful but intimidating.

### Adaline — Quest-Based Get Started (web)
[View on Mobbin](https://mobbin.com/screens/8ad4a415-bff7-4350-91af-75519784b729)

AI platform onboarding. Layout: "You're on your way, Alex. 0 of 2 completed" header, then quest groups (Iterate / Evaluate), each with sub-steps showing locked / in-progress / completed states.

**Why relevant:** This is essentially our product category. An AI tool that breaks the journey into named phases with locked gating. Shows it's possible to have 10+ steps without overwhelm if grouped and gated correctly.

**What to take:**
- Named phases ("Iterate", "Evaluate") give meaning to steps, not just a numbered list
- Progress shown as "0 of 2" (phases) not "0 of 17" (steps) — reduces perceived scope
- Sidebar "Get started" with progress bar is persistent, not modal

---

### Apollo — Onboarding Hub (web)
[View on Mobbin](https://mobbin.com/screens/09da790a-fc80-4bd0-b0cf-0bc5fcedc394)

"Welcome, Sam 👋. Next steps for you." Categorised steps (Setup / Recommendations tabs), each item with Finish / Start / Completed button. Sidebar shows "Onboarding hub 37% Completed" with a persistent progress bar.

**Why relevant:** Handles partial completion gracefully. Users can skip and come back. The % in sidebar keeps them oriented without blocking progress.

**What to take:** Non-blocking progress. Users shouldn't feel they failed a step — they should feel they're at 37%, not stuck at step 4.

---

## Category 3 — Micro-Start / Learning by Doing

For the "just try the smallest thing first" philosophy.

### Coda — Interactive Doc Onboarding (web)
[View on Mobbin](https://mobbin.com/screens/530590cb-d1b7-4c36-9b04-aea981d9589c)

Users perform actual micro-tasks inline: "Switch the toggle to Done", "Drag the blue dot until value = 100", "Click one reaction". Playful copy defuses anxiety ("well done (pun intended—sorry, we just couldn't resist)").

**Why relevant:** The most direct execution of our micro-start concept. First action happens *inside the screen*, not as a link to a tutorial. The task is small enough that failure is impossible — you just drag a dot.

**What to take:**
- Make the first action impossible to fail
- Playful, human tone reduces the pressure of "learning"
- Inline interaction > "watch a video" > "read docs" — in that order of friction

---

### Hims — Numbered Substeps with Visual (web)
[View on Mobbin](https://mobbin.com/screens/d8f101bc-1c46-48ef-9786-6568da07aa39)

Each step broken into numbered substeps (Step 1.1, Step 1.2) with a video and a checkbox list. Not one big step — granular decomposition with visual confirmation.

**Why relevant:** Shows how to break one step into even smaller micro-steps without it feeling heavy. The 1.1/1.2 notation signals "this is manageable, we're inside a step."

**What to take:** Step decomposition as a design primitive. Even a "simple" step can be 1.1 / 1.2 / 1.3 to prevent the blank-page feeling.

---

## Bonus — Clean "Get Started" Alternatives

For if we ever reconsider the map format.

### Cloaked — 4-Step Visual Card Grid (web)
[View on Mobbin](https://mobbin.com/screens/808f03f2-6fb7-4525-b918-4cece3449015)

"Get started 1/4" with illustrated tiles per step, each with a CTA. Feels like a launchpad, not a checklist. Less sequential, more like a menu of starting points.

### Navan — Accordion Checklist (web)
[View on Mobbin](https://mobbin.com/screens/caa963d6-9822-4a3b-b142-bbf0c385fa13)

"1/4 tasks completed" progress bar above an accordion — only the active step expands. Good pattern for hiding future steps until the current one is done, so users aren't paralysed by seeing all 20.

---

## Key Takeaways for It Depends

| Pattern | Source | Apply to |
|---|---|---|
| Active/locked visual hierarchy | Duolingo | Step map node states |
| Named phases, not numbered steps | Adaline | Map section labels |
| Non-blocking % progress | Apollo | Calibration progress indicator |
| Inline micro-action on first step | Coda | First node on the map |
| Substep decomposition (1.1/1.2) | Hims | Expanding step detail view |
| Accordion hides future steps | Navan | Step list alternative layout |
