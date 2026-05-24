import { kv } from '@vercel/kv'
import { ChecklistClient } from './ChecklistClient'

const sections = [
  {
    title: '🗓 Наш план — дослідження',
    items: [
      { id: 'jtbd-statement', label: 'JTBD формулювання — "Коли X, хочу Y, щоб Z"', defaultAssignee: 'liuda' as const },
      { id: 'interview-questions-updated', label: 'Оновити питання для інтерв\'ю (старі — під старий момент)', defaultAssignee: 'liuda' as const },
      { id: 'interview-1', label: 'Інтерв\'ю #1 з колегою-дизайнером (15-20 хв)' },
      { id: 'interview-2', label: 'Інтерв\'ю #2 з колегою-дизайнером (15-20 хв)' },
      { id: 'interview-3', label: 'Інтерв\'ю #3 з колегою-дизайнером (15-20 хв)' },
      { id: 'competitor-map', label: 'Competitor map — що роблять зараз замість нас', defaultAssignee: 'vlad' as const },
      { id: 'synthesis', label: 'Synthesis — оновити гіпотези після інтерв\'ю' },
      { id: 'scope-tree', label: 'Scope tree — що в MVP, що ні' },
    ],
  },
  {
    title: 'Process',
    items: [
      { id: 'interviews-done', label: 'Провести інтерв\'ю (мінімум 2-3 людини)', quote: 'Teams may conduct informal corridor testing at any point during the hackathon.' },
      { id: 'interviews-documented', label: 'Задокументувати findings в docs/research/interviews.md', quote: 'Feedback, usability findings, and observations can be documented and incorporated into future iterations.' },
      { id: 'user-snapshot-updated', label: 'Оновити user-snapshot.md після інтерв\'ю', quote: 'Include insights from corridor testing, if conducted.' },
      { id: 'hypotheses-validated', label: 'Валідувати або відхилити гіпотези', quote: 'Highlight confirmed or rejected hypotheses.' },
      { id: 'decisions-documented', label: 'Зафіксувати кожне рішення в DECISIONS.md', quote: 'Explain major changes and decisions.' },
    ],
  },
  {
    title: 'Кожна ітерація',
    items: [
      { id: 'screenshot-before', label: 'Скріншот до', quote: 'Before/after comparisons are encouraged.' },
      { id: 'screenshot-after', label: 'Скріншот після', quote: 'Each iteration should include screenshots of the updated product.' },
      { id: 'changelog-entry', label: 'Запис в changelog: що змінилось + чому', quote: 'A short change log with the reasoning behind the changes.' },
    ],
  },
  {
    title: 'Продукт',
    items: [
      { id: 'one-action-focus', label: 'Фокус на ONE першій дії (не на кількох сценаріях)', quote: 'Not just reminding. Not just motivating. But actually helping the user start and continue.' },
      { id: 'material-ui', label: 'Використовує Material UI', quote: 'All participants are required to use a shared component library (Material UI, or of your choice).' },
      { id: 'dataart-icons', label: 'Використовує DataArt Figma icon set', quote: 'A shared icon library (DataArt Figma icon set). Icon colors may be adjusted to fit the visual style.' },
      { id: 'deployed', label: 'Задеплоєно на Vercel — публічне посилання працює', quote: 'The prototype must be deployed and accessible via a public link.' },
    ],
  },
  {
    title: 'Презентація (2 червня)',
    items: [
      { id: 'problem-statement', label: 'Problem Statement', quote: 'Presentation section 1: Problem Statement.' },
      { id: 'ux-hypothesis', label: 'UX Hypothesis', quote: 'Presentation section 2: UX Hypothesis.' },
      { id: 'user-flow', label: 'User Flow', quote: 'Presentation section 3: User Flow.' },
      { id: 'prototype-demo', label: 'Live prototype demo (публічне посилання)', quote: 'Any format is acceptable. The prototype must be deployed and accessible via a public link.' },
      { id: 'tech-tools', label: 'Technologies & Tools — як використовували AI', quote: 'Highlight how AI tools were used across ideation, prototyping, testing, or iteration.' },
      { id: 'iteration-journey', label: 'Iteration Journey — скріншоти, рішення, гіпотези, тести', quote: 'Show how the product evolved throughout the week. Include screenshots of key iterations.' },
    ],
  },
  {
    title: 'Sanity check',
    items: [
      { id: 'not-todo-list', label: 'Це НЕ черговий to-do list з AI', quote: 'What to avoid: generic "to-do list with AI" solutions.' },
      { id: 'friction-moment', label: 'Фокус на моменті тертя, не на мотивації', quote: 'Solutions that don\'t focus on the first action.' },
      { id: 'simple-interface', label: 'Інтерфейс простий — не вирішує кілька сценаріїв', quote: 'Overly complex interfaces. Trying to solve too many scenarios.' },
      { id: 'can-answer-why', label: 'Можемо відповісти: "Чому юзер досі не діяв — і як наше рішення це змінює?"', quote: 'Guiding question: Why hasn\'t the user acted yet — and how does your solution change that?' },
    ],
  },
]

export default async function ChecklistPage() {
  let state: Record<string, boolean> = {}
  let assignees: Record<string, 'liuda' | 'vlad' | 'none'> = {}

  try {
    state = (await kv.get<Record<string, boolean>>('checklist')) ?? {}
    assignees = (await kv.get<Record<string, 'liuda' | 'vlad' | 'none'>>('checklist-assignees')) ?? {}
  } catch {
    state = {}
    assignees = {}
  }

  return (
    <ChecklistClient
      sections={sections}
      initialState={state}
      initialAssignees={assignees}
    />
  )
}
