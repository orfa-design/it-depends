# Exercise: Hypotheses + Verification

**Goal:** Surface what's a hypothesis vs what's known, and define how each hypothesis will be verified after launch (or via cheap test before).

**When to use:** Iteration stage (she's about to build something based on a guess), MVP scoping (separating facts from guesses), or after Sounding Board / Compass when a decision rests on unverified assumptions.

**Signal it's done:** Each hypothesis has a verification plan with a concrete signal that would confirm/refute it.

---

## Question sequence

### Step 1: Surface the hypothesis

*"Опиши що ти збираєшся зробити і ЧОМУ. У 'чому' завжди є гіпотеза — давай її витягнемо."*

Listen for:
- "Юзери захочуть X"
- "Це зекономить час"
- "Це збільшить engagement"
- "Це більш інтуїтивно"
- "Це консистентно зі стандартом" (often disguised hypothesis)

All of these are hypotheses unless backed by data, interview quotes, or strong analogous case.

### Step 2: The "звідки знаю" test

For each statement that sounds factual:

*"'[Statement]' — звідки ти це знаєш? Інтерв'ю, спостереження, аналітика, чи інтуїція? Всі варіанти ок, але категорія важлива."*

Categorize each:
- **Known** — from data, interview, observation
- **Inferred** — logical from known, but not directly observed
- **Hypothesis** — believed but not verified
- **Wish** — wanted to be true

### Step 3: The verification plan

For each hypothesis (not for knowns):

*"Як ти зрозумієш чи спрацювало? Конкретний сигнал. Не 'юзери будуть задоволені' — а 'X% юзерів використає це в перший тиждень' або 'не буде >2 скарг про A в feedback за місяць'."*

This is the **verification signal**. Without it, hypothesis testing is theatre.

### Step 4: The pre-launch cheap test (optional)

*"Чи є спосіб перевірити цю гіпотезу ДЕШЕВО до того як вкласти час в розробку? Прототип, опитування 3 юзерів, паперовий тест, аналог на існуючому продукті?"*

Not every hypothesis needs a pre-test. But ask — sometimes there's a 30-minute test that prevents 3 weeks of wrong work.

### Step 5: The kill criteria

*"Що б тебе переконало що ти помилилась? Конкретно. Не 'якщо не вийде' — а 'якщо метрика X нижче Y протягом Z часу, відкочуємо'."*

Without kill criteria, failing hypotheses live forever as "needs more time."

---

## Challenging questions — insert when she drifts

- *"Ти кажеш 'буде краще'. Краще за що? Як виміриш?"*
- *"Ти говориш про це як про факт, але це гіпотеза. Згодна?"*
- *"Якщо ти ВЖЕ знаєш що це спрацює — навіщо тоді робити? Це означає ти не знаєш."*
- *"Що тебе переконає що це не спрацювало? Якщо нічого — це віра, не гіпотеза."*
- *"Цей сигнал якій ти назвала — він буде помітний з даних які в тебе є? Чи треба будувати tracking?"*

---

## The "we always know this" trap

Some hypotheses get mistaken for knowns because everyone in the industry repeats them:

- "Юзери не люблять довгі форми" — partly true, but depends on context
- "Mobile-first" — depends on actual usage
- "Простіше = краще" — often, but not always
- "Більше step = drop-off" — depends on motivation

When she invokes an industry truism, push: *"Це true для твого юзера в цьому контексті? Або це загальне правило яке ти переносиш не перевіривши?"*

---

## How to know it's done

- Each major assumption labeled (known / inferred / hypothesis / wish)
- Each hypothesis has a verification signal
- Each hypothesis has kill criteria
- Hypotheses ranked by risk — which one, if wrong, ламає весь задум

---

## Summary format (for Recorder bridge)

```
HYPOTHESIS LOG
- H1: [statement]
  - Verification: [signal]
  - Kill criteria: [when to give up]
  - Pre-launch test (if any): [what + when]
- H2: ...
- Knowns it depends on: [list]
```

These often become "decision notes" attached to the main feature decision — context that explains why a particular bet was made and how it will be evaluated.

---

## What NOT to do

- Don't let her dress up hypotheses as facts to feel more confident
- Don't accept "we'll see" as verification plan — push for specific signal
- Don't require quantitative metrics if qualitative makes sense ("3 з 5 юзерів in interviews не плутаються" is valid)
- Don't generate hypotheses she didn't state — surface hers, don't invent
