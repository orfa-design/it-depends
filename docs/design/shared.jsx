// shared.jsx — data + chrome

// ── stories ────────────────────────────────────────────────────────────────
const STORIES = [
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
    pain: 'PM просив онбординг до п\u2019ятниці. Не хотіла малювати три кроки, які можуть бути зайвими.',
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
    pain: 'У п\u2019ятницю ввечері знайшли баг у спейсінгу на проді. Розробники недоступні до понеділка.',
    move: 'Відкрила Claude Code, локально знайшла два tailwind класи. PR замержила сама.',
    out: 'Команда дізналась у понеділок на стендапі.',
    time: '25 хв',
  },
];

const REACTIONS = [
  { v: 'wow',   label: 'Фантастика, я так не вміла', ic: 'нова територія' },
  { v: 'heard', label: 'Чула, але не пробувала',     ic: 'на радарі' },
  { v: 'have',  label: 'Я вже щось схоже роблю',     ic: 'у мене є' },
];

// ── map data ───────────────────────────────────────────────────────────────
// Ten total steps. 0..2 done, 3 current, 4..9 future.
const STEPS = [
  { id: 'css',        title: 'Розібратися як CSS реально працює',           meta: 'foundation', result: null },
  { id: 'tailwind',   title: 'Tailwind — як думати, а не вгадувати',         meta: 'foundation', result: 'https://notion.so', resultLabel: 'Tailwind cheatsheet' },
  { id: 'prompts',    title: 'Писати промпти, щоб Claude не вигадував',     meta: 'foundation', result: 'https://notion.so', resultLabel: 'Prompt library' },
  { id: 'prototype',  title: 'Інтерактивний прототип за один вечір',         meta: 'next', current: true },
  { id: 'state',      title: 'Стани, переходи й форми, які працюють',        meta: 'soon' },
  { id: 'real-data',  title: 'Підключити справжні дані з API',                meta: 'soon' },
  { id: 'deploy',     title: 'Запушити на Vercel, дати лінку команді',       meta: 'later' },
  { id: 'a11y',       title: 'Прототипи, які не ламають клавіатуру',          meta: 'later' },
  { id: 'sketch',     title: 'Три гіпотези поряд в одному HTML',              meta: 'later' },
  { id: 'ship',       title: 'Зашипити дрібну фічу без розробника',           meta: 'later' },
];

const STATUS = (i) => {
  if (i === 3) return 'cur';
  if (i > 3)  return 'future';
  return STEPS[i].result ? 'done-link' : 'done-no-link';
};
const isDone = (st) => st === 'done-link' || st === 'done-no-link';

// constellation node positions (% of viewport)
const CONSTELLATION = [
  { id: 'css',       x:  6, y: 76 },
  { id: 'tailwind',  x: 18, y: 50 },
  { id: 'prompts',   x: 32, y: 70 },
  { id: 'prototype', x: 46, y: 36 },
  { id: 'state',     x: 56, y: 64 },
  { id: 'real-data', x: 67, y: 38 },
  { id: 'deploy',    x: 76, y: 68 },
  { id: 'a11y',      x: 84, y: 32 },
  { id: 'sketch',    x: 92, y: 60 },
  { id: 'ship',      x: 98, y: 30 },
];

// ── per-step detail for future steps ──────────────────────────────────────
const STEPS_EXTRA = {
  state: {
    doable: 'Форма з валідацією, яка поводиться правильно. Переходи між станами без перезавантаження.',
    technical: 'Controlled inputs, error/loading/success стани, conditional rendering.',
    time: '≈60 хв',
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.

Зроби HTML-прототип форми логіну з кількома станами:
— default: поля email + password, кнопка «увійти»
— validation error: підсвічування поля, inline текст помилки
— loading: кнопка заблокована зі spinner
— success: success state з переходом на dashboard (статичний екран)

Стек: один .html файл. Tailwind CDN, vanilla JS.
Темна тема. Шрифт — Geist.

Спочатку постав мені 2-3 запитання. Тільки потім код.`,
  },
  'real-data': {
    doable: 'Запит до справжнього API прямо з прототипу. Скелетони, retry, обробка помилок.',
    technical: 'fetch() + async/await, loading states, error handling у UI.',
    time: '≈90 хв',
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.

Зроби HTML-прототип, який тягне дані з публічного API (jsonplaceholder або HackerNews) і показує їх у картках:
— skeleton loading поки дані завантажуються
— список карток після відповіді
— empty state якщо даних немає
— error state якщо запит впав + кнопка retry

Стек: один .html файл. Tailwind CDN, vanilla JS + fetch.
Темна тема. Шрифт — Geist.

Спочатку постав мені 2-3 запитання. Тільки потім код.`,
  },
  deploy: {
    doable: 'Прототип на справжньому URL. Відправиш лінк у Slack — команда клікне й побачить живий продукт.',
    technical: 'Git basics, Vercel deploy, environment змінні.',
    time: '≈45 хв',
    promptText: `Ти senior fullstack розробник, пояснюєш дизайнеру без досвіду з git.

Допоможи мені задеплоїти HTML-прототип на Vercel покроково:
— створити репозиторій на GitHub з одним html файлом
— підключити до Vercel і отримати публічний URL
— що робити якщо щось пішло не так

Формат: numbered steps, без зайвих деталей. Починай з запитань — що тобі треба знати про мій стек і досвід.`,
  },
  a11y: {
    doable: 'Прототип, яким можна пройти тільки з клавіатури. Скрінридери не зламаються.',
    technical: 'focus management, aria-* атрибути, keyboard events.',
    time: '≈60 хв',
    promptText: `Ти accessibility інженер, пояснюєш дизайнерам.

У мене є HTML-прототип — [вставити код].

Знайди топ-3 проблеми з доступністю і виправ їх:
— keyboard navigation (Tab, Enter, Escape)
— aria-label для іконок і кнопок без тексту
— focus visible стани

Поясни кожне виправлення одним реченням — навіщо це важливо для реального юзера.`,
  },
  sketch: {
    doable: 'Три варіанти одного флоу в одному файлі. Команда обирає прямо в браузері.',
    technical: 'Tweak controls, CSS custom properties, conditional rendering.',
    time: '≈75 хв',
    promptText: `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.

Зроби HTML-файл з трьома варіантами одного компонента — [опиши компонент]:
— варіант A: [опис]
— варіант B: [опис]
— варіант C: [опис]

Додай переключалку у верхньому куті, яка показує один варіант за раз.
Стек: Tailwind CDN, vanilla JS. Темна тема. Шрифт — Geist.

Спочатку постав мені 2-3 запитання. Тільки потім код.`,
  },
  ship: {
    doable: 'Реальна фіча в продакшні без допомоги розробника. Від ідеї до merge-у.',
    technical: 'PR workflow, code review basics, feature flags.',
    time: '≈2–4 год',
    promptText: `Ти senior frontend розробник.

Мені треба зашипити маленьку фічу самостійно. Допоможи мені:
1. Зрозуміти, який файл треба змінити
2. Зробити зміну мінімальним PR
3. Написати опис до PR, щоб його схвалили

Фіча: [опиши що хочеш зробити]
Кодова база: [стек — React / Next / Vue / etc]

Починай з запитань — що тобі треба знати, щоб допомогти точно.`,
  },
};

// ── step detail ────────────────────────────────────────────────────────────
const STEP_DETAIL = {
  title: 'Інтерактивний прототип, який можна показати.',
  doable: 'Через приблизно 45 хвилин у тебе буде клікабельний HTML флоу. Його можна кинути в Slack або відкрити на ноуті команді. Без фронтенда, без Figma prototype connections.',
  technical: 'Як описати компонент Claude так, щоб він не вигадував стилі. Як ітерувати один екран без переписування всього файлу. Що казати, коли результат на 80% правильний.',
  time: '\u224845 хв',
  prereqs: 'claude.ai · браузер · все',
};

// ── prompt ─────────────────────────────────────────────────────────────────
const PROMPT_TEXT = `Ти senior frontend дев, який пише прототипи для дизайн-рев'ю.

Зроби клікабельний HTML-прототип флоу логіну з кодом з пошти:
— екран 1: email (з валідацією)
— екран 2: 6-значний код (auto-focus між полями)
— екран 3: success state

Стек: один .html файл. Tailwind через CDN, vanilla JS. Без React, без бібліотек.

Темна тема. Шрифт — Geist (з Google Fonts).
Покажи hover і focus стани. Між екранами плавна анімація.

Спочатку постав мені 2-3 запитання, які тобі треба, щоб не вгадувати. Тільки потім код.`;

// ── chrome ─────────────────────────────────────────────────────────────────
function Chrome({ phase, storyIdx, modal, total = STORIES.length }) {
  let right = null;
  if (phase === 'intro') {
    right = null;
  } else if (phase === 'story') {
    right = (
      <div className="counter">
        <span>{String(storyIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <span className="bar">
          {Array.from({ length: total }).map((_, i) => (
            <i key={i} className={i < storyIdx ? 'on' : i === storyIdx ? 'cur' : ''} />
          ))}
        </span>
      </div>
    );
  } else if (phase === 'analysis') {
    right = <div className="counter"><span>аналізую</span></div>;
  } else if (phase === 'map' && !modal) {
    right = <div className="counter"><span>your map</span></div>;
  } else if (phase === 'map' && modal === 'detail') {
    right = <div className="counter"><span>step 04 · of 10</span></div>;
  } else if (phase === 'map' && modal === 'prompt') {
    right = <div className="counter"><span>your prompt</span></div>;
  } else if (phase === 'complete') {
    right = <div className="counter"><span>shipped</span></div>;
  }
  return (
    <div className="chrome">
      <div className="wordmark"><span className="dot" /> <b>it depends</b></div>
      {right}
    </div>
  );
}

Object.assign(window, {
  STORIES, REACTIONS, STEPS, STATUS, isDone, CONSTELLATION,
  STEP_DETAIL, STEPS_EXTRA, PROMPT_TEXT, Chrome,
});
