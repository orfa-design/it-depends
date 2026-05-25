// Playwright not installed — manual QA per plan phases.
// This file documents expected behavior for each phase.
// Run manually per QA steps in plans/2026-05-25-expressive-plotting-lampson.md

// Phase 1 — Pain screen
// EXPECT: h1 = "Що хочеш зробити з AI?"
// EXPECT: 4 options: automate / build-tool / inspired / examples
// EXPECT: each option navigates to /start/access with correct pain= param

// Phase 2 — Access screen
// EXPECT: 6 tool options (multi-select)
// EXPECT: "Далі →" appears after first selection
// EXPECT: localStorage.itdepends_profile saved on confirm

// Phase 3 — Steps screen
// EXPECT: main card + 2 compact cards + ghost "Показати більше"
// EXPECT: "★ Підібрано для тебе" label above main card
// EXPECT: navigation includes pain= in URL

// Phase 4 — Suggest screen
// EXPECT: "Я спробувала" saves to localStorage.itdepends_builds
// EXPECT: redirects to /done with correct params

// Phase 5 — Done page
// EXPECT: dark background #111
// EXPECT: card title and tool visible
// EXPECT: share button works

// Phase 6 — Return flow + /profile
// EXPECT: /start shows return UI when itdepends_builds exists
// EXPECT: /profile shows level + access + builds list
// EXPECT: "Почати знову" clears localStorage and redirects

export {}
