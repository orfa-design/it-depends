// v3 seed for Vlad's workflow checklist — mirrors .local/checklist-spec.md §3 & §7

export type Status = 'not_started' | 'in_progress' | 'done'
export type Owner = 'vlad' | 'liuda' | 'both' | null

export interface WorkflowItem {
  id: string
  title: string
  status: Status
  owner: Owner
  notes: string
  updatedAt: string
}

export interface WorkflowPhase {
  id: string
  title: string
  collapsed: boolean
  items: WorkflowItem[]
}

export interface PinnedItem {
  id: string
  text: string
}

export interface WorkflowState {
  version: 3
  lastSaved: string
  owners: Array<{ id: string; name: string; color: string }>
  pinned: {
    next48h: PinnedItem[]
    blocked: PinnedItem[]
    questions: PinnedItem[]
  }
  constraints: Array<{ id: string; title: string }>
  phases: WorkflowPhase[]
}

const uid = () => crypto.randomUUID()
const tsNow = () => new Date().toISOString()

function mkItem(title: string, owner: Owner = null): WorkflowItem {
  return { id: uid(), title, status: 'not_started', owner, notes: '', updatedAt: tsNow() }
}

export function getSeed(): WorkflowState {
  return {
    version: 3,
    lastSaved: tsNow(),
    owners: [
      { id: 'vlad', name: 'Vlad', color: '#3b82f6' },
      { id: 'liuda', name: 'Liuda', color: '#10b981' },
    ],
    pinned: {
      next48h: [{ id: uid(), text: 'Pin the specific friction moment with Liuda' }],
      blocked: [],
      questions: [
        { id: uid(), text: 'Which AI tool category do we anchor on first — image gen, chat, IDE, or visual?' },
        { id: uid(), text: "What's the smallest \"micro-start\" that proves decomposition works?" },
        { id: uid(), text: 'Does the user pick their own micro-step, or does AI propose it?' },
      ],
    },
    constraints: [
      { id: uid(), title: 'Material UI + DataArt icons used' },
      { id: uid(), title: 'Prototype deployed to Vercel — public link' },
      { id: uid(), title: 'Stay focused on the FIRST action — avoid feature soup' },
      { id: uid(), title: 'Not a to-do list, reminder, or motivation tool — must help start & continue' },
    ],
    phases: [
      {
        id: 'problem',
        title: 'Define the problem',
        collapsed: false,
        items: [
          mkItem('Pin the specific friction moment (when exactly does the designer close the tool?)'),
          mkItem('Identify the underlying intent (what were they trying to do before they quit?)'),
          mkItem('Draft problem statement: "We help [user] when [moment] go from [intent] to [first action]"'),
        ],
      },
      {
        id: 'research',
        title: 'Research',
        collapsed: false,
        items: [
          mkItem('Generate questionnaire with Claude (5–7 questions, focused on the friction moment)'),
          mkItem('Run with 2–3 DataArt designers (corridor or async)'),
          mkItem('Synthesize answers — log 2–3 validated insights in docs/research/interviews.md'),
        ],
      },
      {
        id: 'prototype',
        title: 'Prototype & iterate',
        collapsed: false,
        items: [
          mkItem('Sketch core flow (paper or quick wireframe — the "micro-start" mechanic)'),
          mkItem('Build clickable prototype (Material UI + chosen tool: Figma Make / Next.js / etc.)'),
          mkItem('Test with 1–2 designers, capture friction points'),
          mkItem('Iterate based on test — document before/after in docs/changelog.md'),
        ],
      },
      {
        id: 'ship',
        title: 'Ship & present',
        collapsed: false,
        items: [
          mkItem('Final prototype locked & deployed to Vercel'),
          mkItem('Generate HTML presentation with Claude (slides as styled HTML, cool UI skill)'),
          mkItem('Rehearse end-to-end + final polish'),
        ],
      },
    ],
  }
}
