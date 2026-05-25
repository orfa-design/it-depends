'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type Suggestion = {
  title: string
  artifact: string      // what they get
  prompt: string
  cta: 'claude' | 'claude-code'
}

const PROMPTS: Record<string, Suggestion> = {

  // ── chat ────────────────────────────────────────────────────────────
  'chat/template': {
    title: 'Шаблон для підсумків зустрічей',
    artifact: 'Markdown-файл для Notion',
    cta: 'claude',
    prompt: `Я UX дизайнер. Зроби мені Markdown-шаблон для підсумків зустрічей який я реюзатиму у Notion.

Структура:
- Ціль зустрічі
- Учасники
- Ключові рішення (з коротким обґрунтуванням)
- Дії: хто / що / до коли
- Відкриті питання
- Наступна зустріч

Зроби його зручним для заповнення прямо під час дзвінку. В кожній секції — коротка підказка що туди писати. Формат: чистий Markdown, готовий скопіювати в Notion.`,
  },

  'chat/prompt-library': {
    title: 'Набір промптів для UX-ресерчу',
    artifact: '5 готових промптів',
    cta: 'claude',
    prompt: `Я UX дизайнер. Зроби мені набір з 5 готових промптів для UX-ресерчу які я зможу реюзати.

Промпти для:
1. Синтез інсайтів з транскрипту інтервʼю
2. Генерація гіпотез на основі спостережень
3. Формулювання питань для наступного раунду інтервʼю
4. Аналіз конкурентного рішення
5. Оцінка дизайн-ідеї через JTBD-лінзу

Кожен промпт: назва, коли використовувати, сам текст промпту — готовий до вставки. Без плейсхолдерів.`,
  },

  'chat/checklist': {
    title: 'Чеклист для дизайн-ревʼю',
    artifact: 'Чеклист для Notion з checkbox\'ами',
    cta: 'claude',
    prompt: `Я UX дизайнер. Зроби мені практичний чеклист для дизайн-ревʼю який використовуватиму регулярно.

Секції:
- UX: навігація, ієрархія, flow, edge cases
- UI: консистентність з дизайн-системою, типографіка, відступи
- Accessibility: контраст, розміри тач-таргетів, скрінрідер
- Edge cases: порожні стани, помилки, завантаження, довгий контент

Формат: Markdown з checkbox\'ами [ ] готовий вставити в Notion. Кожен пункт — конкретна перевірка, не абстракція.`,
  },

  // ── analyze ──────────────────────────────────────────────────────────
  'analyze/assistant': {
    title: 'AI-асистент для аналізу брифів',
    artifact: 'System prompt для Claude Project',
    cta: 'claude',
    prompt: `Я UX дизайнер. Зроби мені system prompt для персонального AI-асистента якого я налаштую в Claude Projects.

Асистент спеціалізується на аналізі брифів клієнтів. Він має:
- Задавати уточнюючі питання про бриф якщо щось нечітко
- Знаходити ризики і суперечності у вимогах
- Пропонувати конкретні питання для кік-офу
- Форматувати аналіз структуровано: ризики / питання / перші кроки

Зроби system prompt повним і готовим до використання — я вставлю його в "Project instructions" в Claude без правок.`,
  },

  'analyze/transcript': {
    title: 'Промпт для аналізу транскриптів',
    artifact: 'Reusable промпт для UX-інтервʼю',
    cta: 'claude',
    prompt: `Я UX дизайнер. Зроби мені reusable промпт для аналізу транскриптів UX-інтервʼю.

Промпт має витягати з тексту:
1. Ключові потреби користувача (з цитатами)
2. Болі і фрустрації
3. Jobs-to-be-done (що намагається досягти)
4. Несподівані інсайти — речі яких не очікували
5. Питання для наступного раунду дослідження

Оформи як промпт який я копіюю один раз, зберігаю, і вставляю перед кожним новим транскриптом.`,
  },

  'analyze/framework': {
    title: 'Фреймворк для порівняння дизайн-рішень',
    artifact: 'Notion-таблиця для рішень',
    cta: 'claude',
    prompt: `Я UX дизайнер. Зроби мені reusable фреймворк для порівняння дизайн-рішень який зберігатиму в Notion.

Фреймворк має оцінювати варіанти за критеріями:
- Юзерські потреби (чи закриває JTBD)
- Технічна складність реалізації
- Консистентність з дизайн-системою
- Вплив на бізнес-метрики
- Reversibility (чи легко відкотити)

Формат: Markdown-таблиця і/або scoring template — готовий вставити в Notion і заповнити для конкретного рішення.`,
  },

  // ── build ─────────────────────────────────────────────────────────────
  'build/plugin': {
    title: 'Figma плагін для перевірки стилів',
    artifact: 'Повний код плагіну: manifest + JS + UI',
    cta: 'claude-code',
    prompt: `Я UX дизайнер і хочу написати Figma плагін.

Плагін перевіряє що всі текстові шари у виділеному фреймі використовують стилі з бібліотеки (не локальні і не хардкод). Якщо знаходить порушення — показує список з назвами шарів і їх поточними значеннями.

Дай повний готовий код:
- manifest.json
- code.js (логіка плагіну)
- ui.html (простий UI зі списком порушень)

Код має запускатись без змін. Поясни як додати плагін локально в Figma Desktop (меню Plugins → Development).`,
  },

  'build/script': {
    title: 'Скрипт для документації компонентів',
    artifact: 'JS скрипт + приклад output',
    cta: 'claude-code',
    prompt: `Я UX дизайнер і хочу автоматизувати генерацію документації для компонентів дизайн-системи.

Напиши Figma плагін (або console скрипт) який для виділеного компонента генерує Markdown-документацію:
- Назва компонента
- Опис (з description якщо є)
- Варіанти (variants і їх значення)
- Стани (normal, hover, disabled, etc.)
- Приклад використання

Дай: повний код (manifest.json + code.js + ui.html) і приклад Markdown-output для простого компонента Button.`,
  },

  'build/automation': {
    title: 'Аудит дизайн-токенів по всьому файлу',
    artifact: 'Плагін з JSON-звітом по відхиленнях',
    cta: 'claude-code',
    prompt: `Я UX дизайнер і хочу зробити автоматизований аудит дизайн-токенів.

Напиши Figma плагін який:
1. Сканує всі фрейми в поточній сторінці
2. Знаходить кольори і відступи які не відповідають змінним з бібліотеки (hardcoded values)
3. Показує звіт: скільки порушень, список шарів з проблемами і їх значення
4. Дозволяє скопіювати звіт як JSON

Дай повний код: manifest.json, code.js, ui.html. Плагін має запускатись без додаткових залежностей.`,
  },
}

const LEVEL_CONTEXT: Record<string, string> = {
  chat: 'Чат з AI',
  analyze: 'Аналіз документів',
  build: 'Будую за межами чату',
}

const PAIN_CONTEXT: Record<string, string> = {
  automate: 'автоматизувати рутину',
  'build-tool': 'побудувати свій інструмент',
  inspired: 'спробувати натхненне',
  examples: 'побачити варіанти',
}

const FALLBACK: Suggestion = {
  title: 'Перший крок з AI',
  artifact: 'Готовий промпт',
  cta: 'claude',
  prompt: `Я UX дизайнер і хочу спробувати AI для своєї роботи.

Задай мені кілька запитань про мій проект і поточну задачу. Після відповідей запропонуй конкретний артефакт який ми можемо зробити разом прямо зараз — шаблон, чеклист, промпт або скрипт.`,
}

function SuggestContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const level = searchParams.get('level') ?? ''
  const task  = searchParams.get('task')  ?? ''
  const pain  = searchParams.get('pain')  ?? ''
  const key   = `${level}/${task}`

  const s = PROMPTS[key] ?? FALLBACK
  const isCode = s.cta === 'claude-code'

  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(s.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCodeCopy() {
    navigator.clipboard.writeText(s.prompt)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 3000)
  }

  function handleTry() {
    const encoded = encodeURIComponent(s.prompt)
    window.open(`https://claude.ai/new?q=${encoded}`, '_blank')
  }

  function handleDone() {
    try {
      const builds = JSON.parse(localStorage.getItem('itdepends_builds') ?? '[]')
      builds.push({ card: task, title: s.title, tool: s.cta, level, pain, date: new Date().toISOString() })
      localStorage.setItem('itdepends_builds', JSON.stringify(builds))
    } catch {}
    router.push(`/done?card=${encodeURIComponent(task)}&tool=${s.cta}&level=${level}&title=${encodeURIComponent(s.title)}`)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: '#fafafa',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button
            onClick={() => router.back()}
            style={{ fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Назад
          </button>
          <p style={{ fontSize: 13, color: '#aaa', letterSpacing: 0.3, textTransform: 'uppercase', margin: 0 }}>
            It Depends
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i <= 3 ? '#111' : '#ddd',
                opacity: i < 3 ? 0.3 : 1,
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* Artifact badge */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: isCode ? '#fff' : '#111',
            background: isCode ? '#111' : '#f0f0f0',
            borderRadius: 6,
            padding: '4px 10px',
            letterSpacing: 0.2,
          }}>
            {isCode ? 'Claude Code' : 'Claude'}
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#666',
            background: '#f7f7f7',
            border: '1px solid #e8e8e8',
            borderRadius: 6,
            padding: '4px 10px',
          }}>
            {s.artifact}
          </span>
        </div>

        {LEVEL_CONTEXT[level] && PAIN_CONTEXT[pain] && (
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>
            {LEVEL_CONTEXT[level]} · {PAIN_CONTEXT[pain]}
          </p>
        )}

        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#111',
          marginBottom: 24,
          lineHeight: 1.3,
        }}>
          {s.title}
        </h1>

        {/* Prompt block */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e5e5e5',
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 12,
        }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#bbb',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 10,
          }}>
            Промпт
          </p>
          <pre style={{
            fontSize: 13.5,
            color: '#222',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            margin: 0,
          }}>
            {s.prompt}
          </pre>
        </div>

        {isCode ? (
          <>
            {/* Claude Code flow: copy + terminal instructions */}
            <button
              onClick={handleCodeCopy}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                background: codeCopied ? '#22a55b' : '#18181b',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: 12,
                outline: 'none',
                letterSpacing: 0.2,
              }}
            >
              {codeCopied ? '✓ Промпт скопійовано' : 'Скопіювати промпт'}
            </button>

            {codeCopied && (
              <div style={{
                background: '#f8f8f8',
                border: '1.5px solid #e5e5e5',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 10,
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>
                  Далі в терміналі:
                </p>
                {['1. Відкрий термінал', '2. Перейди в папку проекту', '3. Запусти:'].map((step, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#555', marginBottom: i === 2 ? 6 : 4 }}>{step}</p>
                ))}
                <code style={{
                  display: 'block',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  background: '#111',
                  color: '#7ee787',
                  padding: '10px 14px',
                  borderRadius: 8,
                  marginBottom: 10,
                }}>
                  claude
                </code>
                <p style={{ fontSize: 12, color: '#aaa' }}>
                  Вставте промпт — Claude Code прочитає контекст проекту і почне писати код.
                </p>
              </div>
            )}

            {!codeCopied && (
              <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center' }}>
                Claude Code — CLI інструмент, відкривається через термінал
              </p>
            )}
          </>
        ) : (
          <>
            {/* Claude.ai flow */}
            <button
              onClick={handleCopy}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 12,
                border: '1.5px solid #e5e5e5',
                background: '#fff',
                color: copied ? '#22a55b' : '#555',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginBottom: 10,
                outline: 'none',
              }}
            >
              {copied ? '✓ Скопійовано' : 'Скопіювати промпт'}
            </button>

            <button
              onClick={handleTry}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                background: '#111',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
                letterSpacing: 0.2,
              }}
            >
              Відкрити в Claude →
            </button>
          </>
        )}

        {/* "Я спробувала" separator + button */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
            <span style={{ fontSize: 12, color: '#bbb', whiteSpace: 'nowrap' }}>
              вже спробувала?
            </span>
            <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
          </div>
          <button
            onClick={handleDone}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 12,
              border: '1.5px solid #e5e5e5',
              background: '#fff',
              color: '#111',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Я спробувала ✓
          </button>
        </div>

      </div>
    </div>
  )
}

export default function SuggestPage() {
  return (
    <Suspense>
      <SuggestContent />
    </Suspense>
  )
}
