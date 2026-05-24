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
  version: 4
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
    version: 4,
    lastSaved: tsNow(),
    owners: [
      { id: 'vlad', name: 'Vlad', color: '#3b82f6' },
      { id: 'liuda', name: 'Liuda', color: '#10b981' },
    ],
    pinned: {
      next48h: [
        { id: uid(), text: 'Провести перше інтерв\'ю' },
      ],
      blocked: [],
      questions: [
        { id: uid(), text: 'Чи соціальний тригер (бачу колегу → розумію що відстав) резонує з реальними дизайнерами?' },
        { id: uid(), text: 'Що є «першою дією» в нашому рішенні — і чому саме вона знімає paralysis?' },
        { id: uid(), text: 'Як виміряти що рішення спрацювало? Яка мінімальна метрика для журі?' },
      ],
    },
    constraints: [
      { id: uid(), title: 'Material UI + DataArt іконки — перевіряє журі' },
      { id: uid(), title: 'Прототип на Vercel — публічне посилання (hard requirement)' },
      { id: uid(), title: 'Кожна ітерація: скріншот до/після + changelog з reasoning' },
      { id: uid(), title: 'Одна перша дія — без розпилення на кілька сценаріїв' },
      { id: uid(), title: 'Не to-do список і не мотивашка — допомагає почати і продовжити' },
    ],
    phases: [
      {
        id: 'foundation',
        title: 'Проблема і гіпотеза',
        collapsed: false,
        items: [
          mkItem('Момент тертя зафіксовано — коли і чому юзер зупиняється (не "не хоче", а "не знає звідки")'),
          mkItem('Problem Statement: «Ми допомагаємо [хто] коли [момент] перейти від [наміру] до [першої дії]»'),
          mkItem('UX Hypothesis: «Вважаємо що [рішення] допоможе [юзеру] [досягти], тому що [причина], виміряємо через [метрику]»'),
          mkItem('User Flow — перший драфт: де починається взаємодія, де перша дія, де кінець'),
        ],
      },
      {
        id: 'research',
        title: 'Дослідження',
        collapsed: false,
        items: [
          mkItem('Провести 2–3 коридорних інтерв\'ю (обов\'язково задокументувати)'),
          mkItem('Занести findings в docs/research/interviews.md — цитати + інсайти'),
          mkItem('Оновити user-snapshot.md після інтерв\'ю'),
          mkItem('Гіпотезу підтверджено або відхилено — оновити docs/hypotheses.md'),
        ],
      },
      {
        id: 'prototype',
        title: 'Прототип і ітерації',
        collapsed: false,
        items: [
          mkItem('Перший прототип: Material UI + DataArt іконки — обов\'язково'),
          mkItem('Задеплоєно на Vercel — публічне посилання є і працює, додати в README'),
          mkItem('Тест з 1–2 дизайнерами — точки тертя записані в docs/changelog.md'),
          mkItem('Кожна ітерація: скріншот до → зміна → скріншот після → запис з reasoning'),
        ],
      },
      {
        id: 'presentation',
        title: 'Презентація (2 червня)',
        collapsed: false,
        items: [
          mkItem('Слайд: Problem Statement'),
          mkItem('Слайд: UX Hypothesis'),
          mkItem('Слайд: User Flow'),
          mkItem('Слайд: Live prototype demo — публічне посилання'),
          mkItem('Слайд: Technologies & Tools — як і де використовували AI'),
          mkItem('Слайд: Iteration Journey — скріншоти, рішення, гіпотези, тести'),
          mkItem('Репетиція від початку до кінця + фінальна відшліфовка'),
        ],
      },
    ],
  }
}
