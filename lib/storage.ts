// Data access layer — swap localStorage calls for Supabase here when ready

export type Profile = {
  stage: string
  blocker: string
  trajectory: string
}

export type Build = {
  card: string
  title: string
  artifact: string
  tool: string
  stage: string
  blocker: string
  date: string
  shareText?: string
}

export type CalibrationResult = {
  reactions: string[]
  date: string
}

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem('itdepends_profile')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveProfile(data: Profile): void {
  try { localStorage.setItem('itdepends_profile', JSON.stringify(data)) } catch {}
}

export function getBuilds(): Build[] {
  try {
    return JSON.parse(localStorage.getItem('itdepends_builds') ?? '[]')
  } catch { return [] }
}

export function saveBuild(build: Build): void {
  try {
    const builds = getBuilds()
    builds.push(build)
    localStorage.setItem('itdepends_builds', JSON.stringify(builds))
  } catch {}
}

export function getCalibration(): CalibrationResult | null {
  try {
    const raw = localStorage.getItem('itdepends_calibration')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveCalibration(reactions: string[]): void {
  try {
    localStorage.setItem('itdepends_calibration', JSON.stringify({
      reactions,
      date: new Date().toISOString(),
    }))
  } catch {}
}

export type InProgressItem = {
  stepIdx: number
  id: string
  title: string
  subtitle: string
  task: string
  date: string
}

export function getInProgress(): InProgressItem[] {
  try {
    return JSON.parse(localStorage.getItem('itdepends_in_progress') ?? '[]')
  } catch { return [] }
}

export function addInProgress(item: InProgressItem): void {
  try {
    const list = getInProgress().filter(i => i.id !== item.id)
    list.push(item)
    localStorage.setItem('itdepends_in_progress', JSON.stringify(list))
  } catch {}
}

export function removeInProgress(id: string): void {
  try {
    const list = getInProgress().filter(i => i.id !== id)
    localStorage.setItem('itdepends_in_progress', JSON.stringify(list))
  } catch {}
}

export function getDraft(stepId: string): string | null {
  try { return localStorage.getItem(`itdepends_draft_${stepId}`) } catch { return null }
}

export function saveDraft(stepId: string, text: string): void {
  try { localStorage.setItem(`itdepends_draft_${stepId}`, text) } catch {}
}

export function clearDraft(stepId: string): void {
  try { localStorage.removeItem(`itdepends_draft_${stepId}`) } catch {}
}

export type CompletedStep = {
  id: string
  url?: string
  shareText?: string
  date: string
}

export function getCompletedSteps(): CompletedStep[] {
  try {
    return JSON.parse(localStorage.getItem('itdepends_calibrate_completed') ?? '[]')
  } catch { return [] }
}

export function markStepDone(data: Omit<CompletedStep, 'date'>): void {
  try {
    const list = getCompletedSteps()
    list.push({ ...data, date: new Date().toISOString() })
    localStorage.setItem('itdepends_calibrate_completed', JSON.stringify(list))
  } catch {}
}
