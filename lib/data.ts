export type Story = {
  name: string
  role: string
  pain: string
  move: string
  out: string
  time: string
}

export type Reaction = { v: 'wow' | 'heard' | 'have'; label: string; ic: string }

export type StepCategory = 'research' | 'prototyping' | 'code' | 'planning' | 'workflow'

export type Step = {
  id: string
  title: string
  subtitle: string
  meta: string
  category: StepCategory
  layer: 0 | 1 | 2 | 3 | 4
  results?: { url: string; label: string }[]
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
  { id: 'summary-meeting',        title: 'Саммері зустрічі',              subtitle: 'Як не відкривати нотатки після дзвінку',                      meta: 'foundation', layer: 3, category: 'research',     results: [{ url: 'https://it-depends.vercel.app', label: 'Зустріч з клієнтом' }, { url: 'https://it-depends.vercel.app', label: 'Брейнштормінг' }, { url: 'https://it-depends.vercel.app', label: 'Ретро команди' }] },
  { id: 'brief-analysis',         title: 'Аналіз брифів',                 subtitle: 'Промпт для роботи з неструктурованими документами',            meta: 'foundation', layer: 0, category: 'research',     results: [{ url: 'https://it-depends.vercel.app', label: 'Проект DataArt' }, { url: 'https://it-depends.vercel.app', label: 'Хакатон 2026' }] },
  { id: 'transcript',             title: 'Розбір транскриптів',            subtitle: 'Витягти головне без читання повністю',                         meta: 'foundation', layer: 0, category: 'research' },
  { id: 'research-prep',          title: 'Підготовка до дослідження',      subtitle: 'Як налаштувати Claude перед початком аналізу',                 meta: 'next',       layer: 0, category: 'research',     current: true },
  { id: 'competitive-analysis',   title: 'Конкурентний аналіз',            subtitle: 'Структурувати ринок без ручних таблиць',                       meta: 'soon',       layer: 1, category: 'planning'  },
  { id: 'working-prompt',         title: 'Робочий промпт',                 subtitle: 'Один шаблон який працює щоразу',                               meta: 'soon',       layer: 1, category: 'workflow'  },
  { id: 'interview-analysis',     title: 'Аналіз інтерв\'ю',              subtitle: 'Постійний промпт для якісного дослідження',                    meta: 'soon',       layer: 1, category: 'research'  },
  { id: 'first-code-edit',        title: 'Перша правка в коді',            subtitle: 'Змінити щось в продукті без розробника',                       meta: 'later',      layer: 2, category: 'code'      },
  { id: 'live-link',              title: 'Живе посилання для команди',     subtitle: 'Поділитись роботою не через Figma',                            meta: 'later',      layer: 2, category: 'code'      },
  { id: 'prototype-testing',      title: 'Прототип для тестування',        subtitle: 'Оживити дизайн за допомогою коду',                             meta: 'later',      layer: 2, category: 'prototyping' },
  { id: 'handoff',                title: 'Хендоф розробнику',              subtitle: 'Підготувати передачу яку приймуть без питань',                 meta: 'later',      layer: 2, category: 'workflow'  },
  { id: 'claude-projects',        title: 'Claude Projects',                subtitle: 'Налаштувати простір який пам\'ятає твій проєкт',               meta: 'later',      layer: 1, category: 'workflow'  },
  { id: 'parallel-prototyping',   title: 'Паралельне прототипування',      subtitle: 'Три варіанти з одного промпту',                                meta: 'later',      layer: 2, category: 'prototyping' },
  { id: 'first-live-project',     title: 'Запуск першого живого проєкту',  subtitle: 'Налаштування середовища і деплой онлайн',                      meta: 'later',      layer: 3, category: 'code'      },
  { id: 'feedback-form',          title: 'Форма для фідбеку',              subtitle: 'Зібрати відповіді команди без Google Forms',                   meta: 'later',      layer: 3, category: 'code'      },
  { id: 'interactive-prototype',  title: 'Інтерактивний прототип',         subtitle: 'Оживити дизайни за допомогою коду',                            meta: 'later',      layer: 3, category: 'prototyping' },
  { id: 'feedback-automation',    title: 'Автоматизація фідбеку',          subtitle: 'Таблиця яка заповнюється сама',                                meta: 'later',      layer: 4, category: 'code'      },
  { id: 'workshop-planning',      title: 'Планування воркшопу',            subtitle: 'Розробка структури і кроків разом з Claude',                   meta: 'later',      layer: 3, category: 'planning'  },
  { id: 'team-tool',              title: 'Командний інструмент',           subtitle: 'Побудувати щось що використовують всі',                        meta: 'later',      layer: 4, category: 'workflow'  },
  { id: 'stakeholder-presentation', title: 'Презентація стейкхолдерам',    subtitle: 'Показати живий продукт замість слайдів',                       meta: 'later',      layer: 4, category: 'planning'  },
]

export const CUR_IDX = STEPS.findIndex(s => s.current) // 3

export const getStatus = (i: number): 'cur' | 'future' | 'done-link' | 'done-no-link' => {
  if (i === CUR_IDX) return 'cur'
  if (i > CUR_IDX)   return 'future'
  return STEPS[i].results?.length ? 'done-link' : 'done-no-link'
}

export const isDone = (st: string) => st === 'done-link' || st === 'done-no-link'

export const STEPS_EXTRA: Record<string, StepExtra> = {
  'summary-meeting': {
    doable: 'Структурований підсумок зустрічі за 2 хвилини. Дії, рішення, наступні кроки — без ручного конспекту.',
    technical: 'Промпт-шаблон для транскриптів, структурований вивід у markdown.',
    time: '≈20 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Зроби саммері цього запису зустрічі:\n[вставити транскрипт або нотатки]\n\nФормат:\n— 3-5 речень загального контексту\n— список рішень\n— список дій з відповідальними\n— відкриті питання`,
    promptText: `Ти досвідчений фасилітатор, який робить саммері зустрічей для продуктових команд.\n\n{task}\n\nБудь конкретним: лише те що було сказано, без інтерпретацій. Якщо чогось не вистачає — запитай перед тим як починати.`,
  },
  'brief-analysis': {
    doable: 'Витягти суть з будь-якого брифу — навіть написаного хаотично. Прогалини і запитання — автоматично.',
    technical: 'Промпт для структурування неформатованого тексту, chain-of-thought підхід.',
    time: '≈25 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Проаналізуй цей бриф:\n[вставити текст брифу]\n\nЩо мені потрібно:\n— головна задача одним реченням\n— що відомо, що не відомо\n— 3-5 уточнюючих запитань до клієнта\n— на що звернути увагу в першу чергу`,
    promptText: `Ти стратегічний дизайн-консультант, який аналізує брифи для дизайн-команд.\n\n{task}\n\nСпочатку постав 2 запитання про контекст. Тільки потім аналіз.`,
  },
  'transcript': {
    doable: 'Перетворити годинний запис дзвінку на 10 рядків з головним. Цитати, інсайти, патерни — без читання.',
    technical: 'Промпт для довгих документів, витяг ключових патернів і цитат.',
    time: '≈30 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Розбери цей транскрипт інтерв'ю:\n[вставити транскрипт]\n\nПотрібно:\n— головне що людина хотіла сказати (3-5 речень)\n— дослівні цитати які варто зберегти\n— емоції і болі\n— що здивувало або суперечить очікуванням`,
    promptText: `Ти UX-дослідник з досвідом якісного аналізу.\n\n{task}\n\nНе додавай інтерпретацій яких немає в тексті. Якщо транскрипт довгий — спочатку запитай чи є конкретний фокус дослідження.`,
  },
  'research-prep': {
    doable: 'Налаштований Claude який знає контекст твого дослідження. Не треба щоразу пояснювати з нуля.',
    technical: 'System prompt, контекст дослідження, гайд для аналізу.',
    time: '≈30 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Я готуюся до дослідження. Допоможи мені налаштувати промпт який буде використовуватись для аналізу матеріалів.\n\nКонтекст дослідження: [описати продукт і аудиторію]\nЦілі: [що хочу дізнатись]\nМетоди: [інтерв'ю / тести / опитування]`,
    promptText: `Ти досвідчений UX-дослідник, який допомагає налаштувати дослідницький процес.\n\n{task}\n\nСпочатку постав 2-3 запитання щоб зрозуміти контекст. Потім запропонуй шаблон промпту для аналізу.`,
  },
  'competitive-analysis': {
    doable: 'Структурований огляд конкурентів за своїми критеріями. Таблиця порівняння без ручного заповнення.',
    technical: 'Фреймворк для аналізу, structured output, порівняльні матриці.',
    time: '≈45 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені зробити конкурентний аналіз.\n\nПродукт: [описати]\nКонкуренти: [перелічити або попроси Claude знайти]\nКритерії: [або попроси запропонувати]`,
    promptText: `Ти product strategist з досвідом конкурентного аналізу.\n\n{task}\n\nСпочатку запропонуй фреймворк і критерії — я підтверджу або скоригую. Потім заповни таблицю. Формат: markdown таблиця.`,
  },
  'working-prompt': {
    doable: 'Шаблон промпту який дає стабільний результат щоразу. Налаштований під твій стиль роботи.',
    technical: 'Структура промпту, role / context / task / format, ітерація на прикладах.',
    time: '≈40 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені створити робочий шаблон промпту для задачі яку я роблю регулярно.\n\nЗадача: [описати що роблю і для кого]\nПроблема з поточним підходом: [що йде не так]\nПриклад хорошого результату: [або опиши яким він має бути]`,
    promptText: `Ти промпт-інженер, який допомагає дизайнерам будувати надійні шаблони.\n\n{task}\n\nСпочатку постав 2-3 запитання. Потім запропонуй шаблон і поясни кожну частину. Ми ітеруємо поки не вийде.`,
  },
  'interview-analysis': {
    doable: 'Постійний промпт для аналізу якісних інтерв\'ю. Теми, патерни, цитати — без стікерів.',
    technical: 'Тематичний аналіз, кластеризація цитат, виявлення патернів.',
    time: '≈50 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Проаналізуй ці інтерв'ю і знайди спільні теми.\n\nІнтерв'ю: [вставити 2-5 транскриптів або нотаток]\n\nЩо шукаємо:\n— повторювані болі і потреби\n— несподівані інсайти\n— суперечності між відповідями\n— цитати які варто зберегти`,
    promptText: `Ти UX-дослідник який спеціалізується на якісному аналізі.\n\n{task}\n\nГрупуй за темами, не за учасниками. Для кожної теми — мінімум одна цитата. Що не підходить під теми — в окрему секцію «інше».`,
  },
  'first-code-edit': {
    doable: 'Змінити текст, колір або відступ в живому продукті. Без допомоги розробника.',
    technical: 'Читання HTML/CSS, базові git команди, Claude Code як навігатор у коді.',
    time: '≈30 хв',
    recommendedTool: 'claude-code',
    taskDefault: `Я хочу зробити невелику правку в коді продукту без розробника.\n\nЩо змінити: [описати зміну — текст / колір / відступ / інше]\nДе шукати: [файл або компонент якщо знаєш]\nМій досвід з кодом: [мінімальний / є базові знання HTML/CSS]`,
    promptText: `Ти senior розробник, який ментує дизайнера з мінімальним досвідом в коді.\n\n{task}\n\nПокроково: де знайти потрібний файл, яку строку змінити, як перевірити результат. Пояснюй просто, без жаргону.`,
  },
  'live-link': {
    doable: 'Публічне посилання на роботу. Команда клікає і бачить живий продукт — не Figma, не скрін.',
    technical: 'Git, Vercel deploy, публічний URL за хвилини.',
    time: '≈45 хв',
    recommendedTool: 'claude-code',
    taskDefault: `Допоможи мені опублікувати мою роботу на Vercel і отримати посилання.\n\nЩо публікую: [HTML-файл / Next.js / інше]\nДосвід з git: [немає / мінімальний / є]`,
    promptText: `Ти senior розробник, пояснюєш дизайнеру без досвіду з деплоєм.\n\n{task}\n\nФормат: numbered steps. Після кожного кроку — як зрозуміти що все пройшло правильно. Починай з запитань про поточний стан.`,
  },
  'prototype-testing': {
    doable: 'Інтерактивний прототип для юзер-тестування. Клікається, скролиться, реагує як справжній продукт.',
    technical: 'HTML/CSS/JS, стани і переходи, realistic mock data.',
    time: '≈60 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Зроби HTML-прототип для юзер-тестування.\n\nЩо тестуємо: [описати флоу або екран]\nЦільова аудиторія: [хто буде тестувати]\nКлючові задачі для тестування: [що користувач має зробити]`,
    promptText: `Ти senior frontend дев, який робить прототипи для юзер-тестування.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS. Темна тема. Шрифт — Geist.\n\nПрототип має бути достатньо realistic щоб тестування було валідним. Спочатку 2-3 запитання.`,
  },
  'handoff': {
    doable: 'Специфікація яку розробник прийме без зустрічі. Токени, стани, edge cases — все на місці.',
    technical: 'Structured output, markdown специфікація, перелік станів і edge cases.',
    time: '≈45 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені підготувати хендоф для розробника.\n\nКомпонент або флоу: [описати що передаємо]\nЄ дизайн: [Figma лінк або опис]\nЩо вже є в коді: [або «з нуля»]`,
    promptText: `Ти senior fullstack розробник, який допомагає дизайнеру підготувати передачу.\n\n{task}\n\nСтвори документ: опис компонента, всі стани, edge cases, питання до дизайнера. Формат: markdown. Спочатку запитай що найчастіше забувають у хендофах.`,
  },
  'claude-projects': {
    doable: 'Простір який пам\'ятає твій контекст між сесіями. Не треба щоразу пояснювати хто ти і що робиш.',
    technical: 'Project instructions, knowledge files, persistent system prompt.',
    time: '≈30 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені налаштувати Claude Project для моєї регулярної задачі.\n\nЗадача: [що роблю постійно]\nКонтекст який хочу зберегти: [продукт / аудиторія / стиль роботи]\nЩо Claude має знати з першого повідомлення: [описати]`,
    promptText: `Ти помічник з налаштування AI-воркфлоу для дизайнерів.\n\n{task}\n\nЗапропонуй структуру Project instructions і knowledge files. Поясни що куди класти і чому.`,
  },
  'parallel-prototyping': {
    doable: 'Три різні варіанти дизайну з одного промпту. Показуєш команді — вони обирають прямо в браузері.',
    technical: 'Варіативні промпти, CSS custom properties, перемикач варіантів.',
    time: '≈75 хв',
    recommendedTool: 'figma-make',
    taskDefault: `Зроби HTML-файл з трьома варіантами одного екрану які перемикаються кнопками зверху.\n\nЕкран: [описати що це]\nВаріант A: [підхід або гіпотеза]\nВаріант B: [альтернативний підхід]\nВаріант C: [третій варіант або «несподіваний»]`,
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS. Темна тема. Шрифт — Geist.\n\nПеремикач варіантів — зверху, помітний. Спочатку 2-3 запитання.`,
  },
  'first-live-project': {
    doable: 'Проєкт онлайн з публічним URL. Не «локально» — справжній лінк який можна відправити.',
    technical: 'Git репозиторій, Vercel, environment variables, custom domain (опційно).',
    time: '≈90 хв',
    recommendedTool: 'claude-code',
    taskDefault: `Допоможи мені запустити перший живий проєкт онлайн.\n\nЩо запускаю: [HTML / Next.js / інше]\nДосвід з git: [немає / мінімальний / є]\nВже є GitHub акаунт: [так / ні]`,
    promptText: `Ти senior fullstack розробник, ведеш дизайнера через перший деплой.\n\n{task}\n\nПокроково: git init → GitHub → Vercel → публічний URL. Після кожного кроку — checkpoint як перевірити. Починай з запитань про поточний стан.`,
  },
  'feedback-form': {
    doable: 'Форма яка збирає відповіді команди в структурований вигляд. Без Google Forms і без зайвих кроків.',
    technical: 'HTML form, validation, відправка даних або localStorage.',
    time: '≈60 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Зроби HTML-форму для збору фідбеку від команди.\n\nДля чого: [описати контекст — рев'ю дизайну / тестування / інше]\nПоля: [перелічити або попроси запропонувати]\nЩо відбувається після відправки: [зберегти локально / показати подяку / інше]`,
    promptText: `Ти senior frontend дев, який пише прості інструменти для команд.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS. Темна тема. Спочатку 2-3 запитання про контекст використання.`,
  },
  'interactive-prototype': {
    doable: 'Повноцінний прототип з переходами і станами. Виглядає і поводиться як справжній продукт.',
    technical: 'JavaScript стан-машина, CSS анімації, event handling, multi-screen навігація.',
    time: '≈90 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Зроби інтерактивний HTML-прототип.\n\nПродукт: [описати що це]\nЕкрани: [перелічити]\nКлючові взаємодії: [що має клікатись і що відбуватись]\nСтани: [loading / empty / error — якщо потрібні]`,
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.\n\n{task}\n\nСтек: один .html файл. Tailwind CDN, vanilla JS. Темна тема. Шрифт — Geist.\n\nРобимо покроково — спочатку один екран, потім додаємо. Починай з 2-3 запитань.`,
  },
  'feedback-automation': {
    doable: 'Таблиця яка заповнюється автоматично з форм або нотаток. Не вводиш руками — просто є.',
    technical: 'Airtable або Google Sheets + Apps Script, або простий CSV export з форми.',
    time: '≈60 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені автоматизувати збір фідбеку в таблицю.\n\nЗвідки фідбек: [форма / нотатки / повідомлення в слак]\nКуди зберігати: [Airtable / Google Sheets / інше]\nСтруктура таблиці: [колонки або попроси запропонувати]`,
    promptText: `Ти product ops спеціаліст, допомагаєш дизайнеру автоматизувати рутину.\n\n{task}\n\nЗапропонуй найпростіший спосіб без коду (або з мінімальним). Покроково. Спочатку запитай про поточний процес.`,
  },
  'workshop-planning': {
    doable: 'Структура і план воркшопу за твоїми цілями. Таймлайн, активності, матеріали — готово до проведення.',
    technical: 'Structured prompting, ітеративне уточнення, markdown план.',
    time: '≈45 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені спланувати воркшоп.\n\nМета: [що хочу отримати в результаті]\nАудиторія: [хто буде, скільки людей]\nЧас: [скільки годин]\nФормат: [онлайн / офлайн]`,
    promptText: `Ти досвідчений фасилітатор продуктових воркшопів.\n\n{task}\n\nСпочатку 2-3 уточнюючих запитань. Потім запропонуй структуру з таймлайном і конкретними активностями. Ми ітеруємо.`,
  },
  'team-tool': {
    doable: 'Інструмент який реально використовує вся команда. Не прототип — щось що вирішує реальну задачу.',
    technical: 'Shared state, URL-based routing, multi-user use cases.',
    time: '≈120 хв',
    recommendedTool: 'claude-code',
    taskDefault: `Допоможи мені побудувати командний інструмент.\n\nЗадача яку вирішує: [описати]\nХто буде використовувати: [скільки людей, як часто]\nMust-have функції: [мінімум для запуску]\nСтек: [або попроси запропонувати]`,
    promptText: `Ти senior fullstack розробник, будуєш MVP командного інструменту разом з дизайнером.\n\n{task}\n\nСпочатку визначимо мінімальний scope. Потім — покроково. Кожен крок має бути робочим і deployable.`,
  },
  'stakeholder-presentation': {
    doable: 'Живий продукт замість слайдів. Стейкхолдери клікають самі — не дивляться на статичні скріни.',
    technical: 'Deploy, shareable link, responsive layout, presentation mode.',
    time: '≈60 хв',
    recommendedTool: 'claude-ai',
    taskDefault: `Допоможи мені підготувати живу демо для стейкхолдерів замість презентації.\n\nЩо показуємо: [продукт / фіча / концепт]\nАудиторія: [хто дивитиметься]\nКлючові моменти які мають бути помітні: [що важливо донести]`,
    promptText: `Ти product designer з досвідом презентацій для C-level.\n\n{task}\n\nЗапропонуй структуру демо: які екрани показати, в якому порядку, де зробити паузу для обговорення. Спочатку 2 запитання про аудиторію.`,
  },
}
