// V2 data model — see documents/v2-spec.md
// Real content is adapted from the v1 data (lib/data.ts) so every step
// (parametric design, etc.) shows up with its full instructions and phases.

import {
  STEPS as V1_STEPS,
  STEPS_EXTRA,
  type Step as V1Step,
  type Stage as V1Stage,
  type Tool,
} from './data'

export type StepCategory =
  | 'research'
  | 'prototyping'
  | 'code'
  | 'planning'
  | 'workflow'

export type StepKind = 'simple' | 'build'
export type StepEffort = 'quick' | 'iterative' | 'project'

export interface AuthorExample {
  type: 'image' | 'link'
  url: string
  label?: string
}

export interface BuildStage {
  title: string
  tool: string
  action: string
  prompt: string
  checkpoint?: string
}

export interface Step {
  id: string
  title: string
  subtitle: string
  category: StepCategory
  kind: StepKind
  effort: StepEffort
  time: string

  // pitch
  promise: string
  usedWhen: string
  tool?: string
  authorExample?: AuthorExample

  // guide
  taskDefault: string
  promptText?: string
  instructions?: string[] // simple: «як це піде» — what to expect, step by step
  checkpoint?: string
  stages?: BuildStage[]

  // sidebar
  relatedSteps: string[]
  processNotes?: string[]
}

export const CATEGORY_LABEL: Record<StepCategory, string> = {
  research: 'дослідження',
  prototyping: 'прототипування',
  code: 'код',
  planning: 'планування',
  workflow: 'процес',
}

export const EFFORT_LABEL: Record<StepEffort, string> = {
  quick: 'Швидко',
  iterative: 'Кілька ітерацій',
  project: 'Проєкт',
}

export const EFFORT_NOTE: Record<StepEffort, string> = {
  quick: 'Можна зробити з AI за один підхід',
  iterative: 'Може знадобитися кілька ітерацій і підходів',
  project:
    'Складний продукт — за 2-3 підходи не закінчити, але результат того вартує',
}

export const EFFORT_ORDER: Record<StepEffort, number> = {
  quick: 0,
  iterative: 1,
  project: 2,
}

const TOOL_NAME: Record<Tool, string> = {
  'claude-ai': 'Claude',
  'claude-code': 'Claude Code',
  'figma-make': 'Figma Make',
  'google-ai-studio': 'Google AI Studio',
}

function effortFromTime(time: string, kind: StepKind): StepEffort {
  if (/вечор|веч|дн|тижд/i.test(time)) return 'project'
  const nums = (time.match(/\d+/g) ?? []).map(Number)
  const max = nums.length ? Math.max(...nums) : 0
  if (kind === 'build') return max === 0 || max >= 50 ? 'project' : 'iterative'
  if (max >= 45) return 'project'
  if (max >= 20) return 'iterative'
  return 'quick'
}

function mapStage(s: V1Stage): BuildStage {
  return {
    title: s.title,
    tool: s.tool ? TOOL_NAME[s.tool] : '',
    action: s.action,
    prompt: s.prompt ?? '',
    checkpoint: s.checkpoint,
  }
}

// ── Build the v2 step list from v1 content ──────────────────────────────────

const CORE = new Map<string, V1Step>(V1_STEPS.map((s) => [s.id, s]))

export const STEPS: Step[] = Object.entries(STEPS_EXTRA)
  .map(([id, extra]): Step | null => {
    const core = CORE.get(id)
    if (!core) return null

    const related = V1_STEPS.filter(
      (s) => s.id !== id && s.category === core.category
    )
      .slice(0, 3)
      .map((s) => s.id)

    return {
      id,
      title: core.title,
      subtitle: core.subtitle,
      category: core.category,
      kind: extra.kind,
      effort: effortFromTime(extra.time, extra.kind),
      time: extra.time,
      promise: extra.doable,
      usedWhen: extra.technical,
      tool: extra.kind === 'simple' ? TOOL_NAME[extra.recommendedTool] : undefined,
      authorExample: core.results?.[0]
        ? { type: 'link', url: core.results[0].url, label: core.results[0].label }
        : undefined,
      taskDefault: extra.taskDefault,
      promptText: extra.kind === 'simple' ? extra.promptText : undefined,
      instructions: extra.expect,
      stages: extra.stages?.map(mapStage),
      relatedSteps: related,
      processNotes: extra.levelUp,
    }
  })
  .filter((s): s is Step => s !== null)
  // quick steps first, projects last
  .sort((a, b) => EFFORT_ORDER[a.effort] - EFFORT_ORDER[b.effort])

// Personal map sequence (default path).
export const MAP_PATH: string[] = [
  'summary-meeting',
  'transcript',
  'design-critique',
  'accessibility-review',
  'realistic-content',
  'parametric-design',
  'design-system-catalog',
]

// "Для тебе" recommendations.
export const RECOMMENDED: string[] = [
  'design-critique',
  'parametric-design',
  'summary-meeting',
]

export function getStep(id: string): Step | undefined {
  return STEPS.find((s) => s.id === id)
}

export function getSteps(ids: string[]): Step[] {
  return ids
    .map((id) => STEPS.find((s) => s.id === id))
    .filter((s): s is Step => Boolean(s))
}
