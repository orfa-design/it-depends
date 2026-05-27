// Data access layer — swap localStorage calls for Supabase here when ready

export type Profile = {
  stage: string
  blocker: string
  trajectory: string
}

export type Build = {
  card: string
  title: string
  tool: string
  stage: string
  blocker: string
  date: string
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
