export type Story = {
  name: string
  role: string
  pain: string
  move: string
  out: string
  time: string
}

export type Reaction = { v: 'wow' | 'heard' | 'have'; label: string; ic: string }

export type Step = {
  id: string
  title: string
  subtitle: string
  meta: string
  result?: string | null
  resultLabel?: string
  current?: boolean
}

export type Tool = 'claude-ai' | 'claude-code' | 'figma-make' | 'google-ai-studio'

export type StepExtra = {
  doable: string
  technical: string
  time: string
  promptText: string
  taskDefault: string
  recommendedTool: Tool
}

export const STORIES: Story[] = [
  {
    name: 'Аня',
    role: 'Product designer · fintech · 4 роки',
    pain: 'Дизайнила dashboard з чотирма станами завантаження. У Figma це години variants і auto layout, які потім ніхто не відкриє.',
    move: 'Кинула Claude скріншот і написала: «зроби HTML, де всі чотири стани реально перемикаються, з затримками».',
    out: 'Передала фронту як референс замість 12 коментарів у Linear.',
    time: '12 хв',
  },
  {
    name: 'Маша',
    role: 'UI/UX · b2b SaaS · 6 років',
    pain: 'PM просив онбординг до п’ятниці. Не хотіла малювати три кроки, які можуть бути зайвими.',
    move: 'Описала Claude три екрани й попросила робочий HTML. Пройшла з трьома людьми перед тим, як відкривати Figma.',
    out: 'Викинула перший крок ще до дизайну. Зекономила собі день.',
    time: '40 хв',
  },
  {
    name: 'Дарина',
    role: 'Senior designer · e-com · 3 роки',
    pain: 'Лендінг на стартап у нішевій категорії. Без копірайтера, без знання індустрії, з дедлайном на завтра.',
    move: 'Сказала Claude бути головою маркетингу цього стартапу. Три ітерації, поки тон не став схожим на мій.',
    out: 'Hero і чотири секції з нормальним голосом. Дизайн зайняв вечір.',
    time: 'вечір',
  },
  {
    name: 'Олена',
    role: 'Design lead · seed-стартап · 7 років',
    pain: 'У п’ятницю ввечері знайшли баг у спейсінгу на проді. Розробники недоступні до понеділка.',
    move: 'Відкрила Claude Code, локально знайшла два tailwind класи. PR замержила сама.',
    out: 'Команда дізналась у понеділку на стендапі.',
    time: '25 хв',
  },
]

export const REACTIONS: Reaction[] = [
  { v: 'wow',   label: 'Фантастика, я так не вміла', ic: 'нова територія' },
  { v: 'heard', label: 'Чула, але не пробувала',     ic: 'на радарі' },
  { v: 'have',  label: 'Я вже щось схоже роблю',     ic: 'у мене є' },
]

export const STEPS: Step[] = [
  { id: 'summary-meeting',        title: 'Саммері зустрічі',              subtitle: 'Як не відкривати нотатки після дзвінку',                      meta: 'foundation', result: null },
  { id: 'brief-analysis',         title: 'Аналіз брифів',                 subtitle: 'Промпт для роботи з неструктурованими документами',            meta: 'foundation', result: null },
  { id: 'transcript',             title: 'Розбір транскриптів',            subtitle: 'Витягти головне без читання повністю',                         meta: 'foundation', result: null },
  { id: 'research-prep',          title: 'Підготовка до дослідження',      subtitle: 'Як налаштувати Claude перед початком аналізу',                 meta: 'next', current: true },
  { id: 'competitive-analysis',   title: 'Конкурентний аналіз',            subtitle: 'Структурувати ринок без ручних таблиць',                       meta: 'soon' },
  { id: 'working-prompt',         title: 'Робочий промпт',                 subtitle: 'Один шаблон який працює щоразу',                               meta: 'soon' },
  { id: 'interview-analysis',     title: 'Аналіз інтерв\'ю',              subtitle: 'Постійний промпт для якісного дослідження',                    meta: 'soon' },
  { id: 'first-code-edit',        title: 'Перша правка в коді',            subtitle: 'Змінити щось в продукті без розробника',                       meta: 'later' },
  { id: 'live-link',              title: 'Живе посилання для команди',     subtitle: 'Поділитись роботою не через Figma',                            meta: 'later' },
  { id: 'prototype-testing',      title: 'Прототип для тестування',        subtitle: 'Оживити дизайн за допомогою коду',                             meta: 'later' },
  { id: 'handoff',                title: 'Хендоф розробнику',              subtitle: 'Підготувати передачу яку приймуть без питань',                 meta: 'later' },
  { id: 'claude-projects',        title: 'Claude Projects',                subtitle: 'Налаштувати простір який пам\'ятає твій проєкт',               meta: 'later' },
  { id: 'parallel-prototyping',   title: 'Паралельне прототипування',      subtitle: 'Три варіанти з одного промпту',                                meta: 'later' },
  { id: 'first-live-project',     title: 'Запуск першого живого проєкту',  subtitle: 'Налаштування середовища і деплой онлайн',                      meta: 'later' },
  { id: 'feedback-form',          title: 'Форма для фідбеку',              subtitle: 'Зібрати відповіді команди без Google Forms',                   meta: 'later' },
  { id: 'interactive-prototype',  title: 'Інтерактивний прототип',         subtitle: 'Оживити дизайни за допомогою коду',                            meta: 'later' },
  { id: 'feedback-automation',    title: 'Автоматизація фідбеку',          subtitle: 'Таблиця яка заповнюється сама',                                meta: 'later' },
  { id: 'workshop-planning',      title: 'Планування воркшопу',            subtitle: 'Розробка структури і кроків разом з Claude',                   meta: 'later' },
  { id: 'team-tool',              title: 'Командний інструмент',           subtitle: 'Побудувати щось що використовують всі',                        meta: 'later' },
  { id: 'stakeholder-presentation', title: 'Презентація стейкхолдерам',    subtitle: 'Показати живий продукт замість слайдів',                       meta: 'later' },
]

export const CUR_IDX = STEPS.findIndex(s => s.current) // 3

export const getStatus = (i: number): 'cur' | 'future' | 'done-link' | 'done-no-link' => {
  if (i === CUR_IDX) return 'cur'
  if (i > CUR_IDX)   return 'future'
  return STEPS[i].result ? 'done-link' : 'done-no-link'
}

export const isDone = (st: string) => st === 'done-link' || st === 'done-no-link'

export const STEPS_EXTRA: Record<string, StepExtra> = {
  state: {
    doable: 'Форма з валідацією, яка поводиться правильно. Переходи між станами без перезавантаження.',
    technical: 'Controlled inputs, error/loading/success стани, conditional rendering.',
    time: '≈60 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Зроби HTML-прототип форми логіну з кількома станами:\n— default: поля email + password, кнопка «увійти»\n— validation error: підсвічування поля, inline текст помилки\n— loading: кнопка заблокована зі spinner\n— success: success state з переходом на dashboard (статичний екран)`,
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS.\nТемна тема. Шрифт — Geist.\n\nСпочатку постав мені 2-3 запитання. Тільки потім код.`,
  },
  'real-data': {
    doable: 'Запит до справжнього API прямо з прототипу. Скелетони, retry, обробка помилок.',
    technical: 'fetch() + async/await, loading states, error handling у UI.',
    time: '≈90 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Зроби HTML-прототип, який тягне дані з публічного API (jsonplaceholder або HackerNews) і показує їх у картках:\n— skeleton loading поки дані завантажуються\n— список карток після відповіді\n— empty state якщо даних немає\n— error state якщо запит впав + кнопка retry`,
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS + fetch.\nТемна тема. Шрифт — Geist.\n\nСпочатку постав мені 2-3 запитання. Тільки потім код.`,
  },
  deploy: {
    doable: 'Прототип на справжньому URL. Відправиш лінк у Slack — команда клікне й побачить живий продукт.',
    technical: 'Git basics, Vercel deploy, environment змінні.',
    time: '≈45 хв',
    recommendedTool: 'claude-code',
    taskDefault: `Допоможи мені задеплоїти HTML-прототип на Vercel покроково:\n— створити репозиторій на GitHub з одним html файлом\n— підключити до Vercel і отримати публічний URL\n— що робити якщо щось пішло не так`,
    promptText: `Ти senior fullstack розробник, пояснюєш дизайнеру без досвіду з git.\n\n{task}\n\nФормат: numbered steps, без зайвих деталей. Починай з запитань — що тобі треба знати про мій стек і досвід.`,
  },
  a11y: {
    doable: 'Прототип, яким можна пройти тільки з клавіатури. Скрінридери не зламаються.',
    technical: 'focus management, aria-* атрибути, keyboard events.',
    time: '≈60 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `У мене є HTML-прототип — [вставити код].\n\nЗнайди топ-3 проблеми з доступністю і виправ їх:\n— keyboard navigation (Tab, Enter, Escape)\n— aria-label для іконок і кнопок без тексту\n— focus visible стани`,
    promptText: `Ти accessibility інженер, пояснюєш дизайнерам.\n\n{task}\n\nПоясни кожне виправлення одним реченням — навіщо це важливо для реального юзера.`,
  },
  sketch: {
    doable: 'Три варіанти одного флоу в одному файлі. Команда обирає прямо в браузері.',
    technical: 'Tweak controls, CSS custom properties, conditional rendering.',
    time: '≈75 хв',
    recommendedTool: 'figma-make',
    taskDefault: `Зроби HTML-файл де три варіанти одного екрану переключаються кнопками зверху. Варіанти:\n— Варіант A: [описати]\n— Варіант B: [описати]\n— Варіант C: [описати]`,
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS.\nТемна тема. Шрифт — Geist.\n\nСпочатку постав мені 2-3 запитання. Тільки потім код.`,
  },
  ship: {
    doable: "Дрібна реальна зміна на проді. Без PR-рев'ю, без ticket, без очікування.",
    technical: 'Git branches, diff reading, merge basics.',
    time: '≈30 хв',
    recommendedTool: 'claude-code',
    taskDefault: `Я хочу зашипити дрібну зміну: [описати зміну].`,
    promptText: `Ти senior розробник, який ментує дизайнера.\n\n{task}\n\nПокроково: як створити гілку, зробити зміну, відкрити PR, замержити. Я знаю HTML/CSS, але з git мало досвіду.\n\nФормат: numbered steps. Починай з запитань про мій досвід.`,
  },
}
