// V2 progress — localStorage for the design build.
// (KV-backed user:{name} progress arrives in the CMS phase.)

export type StepStatus = 'available' | 'in_progress' | 'done'

export interface StepProgress {
  status: StepStatus
  task?: string
  resultUrl?: string
  notInterested?: boolean
}

type ProgressMap = Record<string, StepProgress>

import { STEPS } from './steps-v2'

const KEY = 'itdepends_v2_progress'
const VALID_IDS = new Set(STEPS.map((s) => s.id))

function readAll(): ProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ProgressMap
  } catch {
    return {}
  }
}

function writeAll(map: ProgressMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch {}
}

export function getProgress(id: string): StepProgress {
  return readAll()[id] ?? { status: 'available' }
}

export function setProgress(id: string, patch: Partial<StepProgress>) {
  const all = readAll()
  const next: StepProgress = { ...(all[id] ?? { status: 'available' }), ...patch }
  all[id] = next
  writeAll(all)
  return next
}

export function countInProgress(): number {
  // Only count steps that still exist in the v2 catalog, so the chrome badge
  // stays in sync with the /progress list (ignores stale/legacy ids).
  const all = readAll()
  let n = 0
  for (const id of VALID_IDS) {
    if (all[id]?.status === 'in_progress') n++
  }
  return n
}
