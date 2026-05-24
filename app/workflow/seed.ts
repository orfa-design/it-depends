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
      next48h: [{ id: uid(), text: 'Зафіксувати момент тертя разом з Liuda' }],
      blocked: [],
      questions: [
        { id: uid(), text: 'На якій категорії AI інструментів фокусуємось першою — генерація зображень, чат, IDE чи візуальні?' },
        { id: uid(), text: 'Який найменший «мікро-старт» доводить що декомпозиція працює?' },
        { id: uid(), text: 'Користувач сам обирає мікро-крок, чи AI пропонує?' },
      ],
    },
    constraints: [
      { id: uid(), title: 'Використовуємо Material UI + DataArt іконки' },
      { id: uid(), title: 'Прототип задеплоєно на Vercel — публічне посилання' },
      { id: uid(), title: 'Фокус на ПЕРШІЙ дії — не розпилятись' },
      { id: uid(), title: 'Не to-do список і не мотивашка — допомагає почати і продовжити' },
    ],
    phases: [
      {
        id: 'problem',
        title: 'Визначити проблему',
        collapsed: false,
        items: [
          mkItem('Зафіксувати момент тертя (коли саме дизайнер закриває інструмент?)'),
          mkItem('Визначити справжній намір (що вони хотіли зробити до того як кинути?)'),
          mkItem('Сформулювати problem statement: «Ми допомагаємо [хто] коли [момент] перейти від [наміру] до [першої дії]»'),
        ],
      },
      {
        id: 'research',
        title: 'Дослідження',
        collapsed: false,
        items: [
          mkItem('Згенерувати анкету з Claude (5–7 питань, фокус на момент тертя)'),
          mkItem('Провести з 2–3 дизайнерами DataArt (коридорне або асинхронне)'),
          mkItem('Синтезувати відповіді — записати 2–3 підтверджені інсайти в docs/research/interviews.md'),
        ],
      },
      {
        id: 'prototype',
        title: 'Прототип і ітерації',
        collapsed: false,
        items: [
          mkItem('Накидати основний флоу (папір або швидкий вайрфрейм — механіка «мікро-старту»)'),
          mkItem('Зібрати клікабельний прототип (Material UI + обраний інструмент: Figma Make / Next.js / тощо)'),
          mkItem('Протестувати з 1–2 дизайнерами, зафіксувати точки тертя'),
          mkItem('Ітерувати за результатами — задокументувати до/після в docs/changelog.md'),
        ],
      },
      {
        id: 'ship',
        title: 'Запустити і презентувати',
        collapsed: false,
        items: [
          mkItem('Фінальний прототип зафіксовано і задеплоєно на Vercel'),
          mkItem('Згенерувати HTML презентацію з Claude (слайди як стилізований HTML)'),
          mkItem('Репетиція від початку до кінця + фінальна відшліфовка'),
        ],
      },
    ],
  }
}
