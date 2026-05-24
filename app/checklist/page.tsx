import { kv } from '@vercel/kv'
import { ChecklistClient } from './ChecklistClient'

const sections = [
  {
    title: 'Process',
    items: [
      { id: 'interviews-done', label: 'Провести інтерв\'ю (мінімум 2-3 людини)' },
      { id: 'interviews-documented', label: 'Задокументувати findings в docs/research/interviews.md' },
      { id: 'user-snapshot-updated', label: 'Оновити user-snapshot.md після інтерв\'ю' },
      { id: 'hypotheses-validated', label: 'Валідувати або відхилити гіпотези' },
      { id: 'decisions-documented', label: 'Зафіксувати кожне рішення в DECISIONS.md' },
    ],
  },
  {
    title: 'Кожна ітерація',
    items: [
      { id: 'screenshot-before', label: 'Скріншот до' },
      { id: 'screenshot-after', label: 'Скріншот після' },
      { id: 'changelog-entry', label: 'Запис в changelog: що змінилось + чому' },
    ],
  },
  {
    title: 'Продукт',
    items: [
      { id: 'one-action-focus', label: 'Фокус на ONE першій дії (не на кількох сценаріях)' },
      { id: 'material-ui', label: 'Використовує Material UI' },
      { id: 'dataart-icons', label: 'Використовує DataArt Figma icon set' },
      { id: 'deployed', label: 'Задеплоєно на Vercel — публічне посилання працює' },
    ],
  },
  {
    title: 'Презентація (2 червня)',
    items: [
      { id: 'problem-statement', label: 'Problem Statement' },
      { id: 'ux-hypothesis', label: 'UX Hypothesis' },
      { id: 'user-flow', label: 'User Flow' },
      { id: 'prototype-demo', label: 'Live prototype demo (публічне посилання)' },
      { id: 'tech-tools', label: 'Technologies & Tools — як використовували AI' },
      { id: 'iteration-journey', label: 'Iteration Journey — скріншоти, рішення, гіпотези, тести' },
    ],
  },
  {
    title: 'Sanity check',
    items: [
      { id: 'not-todo-list', label: 'Це НЕ черговий to-do list з AI' },
      { id: 'friction-moment', label: 'Фокус на моменті тертя, не на мотивації' },
      { id: 'simple-interface', label: 'Інтерфейс простий — не вирішує кілька сценаріїв' },
      { id: 'can-answer-why', label: 'Можемо відповісти: "Чому юзер досі не діяв — і як наше рішення це змінює?"' },
    ],
  },
]

export default async function ChecklistPage() {
  let state: Record<string, boolean> = {}
  try {
    state = (await kv.get<Record<string, boolean>>('checklist')) ?? {}
  } catch {
    state = {}
  }

  return <ChecklistClient sections={sections} initialState={state} />
}
