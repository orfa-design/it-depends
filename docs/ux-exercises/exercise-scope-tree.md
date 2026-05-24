# Exercise: Scope Tree

**Goal:** Cut scope for v1 / next release. Decide what's IN, what's OUT, and what's OUT BUT NEEDED LATER (parking lot).

**When to use:** MVP scoping, or any release boundary. She has a list of things she could build and needs to decide what makes it.

**Signal it's done:** She has a written list — in/out/parked — and she can defend each choice in one sentence.

---

## Question sequence

### Step 1: Dump everything

*"Назви все що тобі хочеться зробити в цьому продукті — фічі, ідеї, виправлення, експерименти. Не фільтруй. 10-30 пунктів нормально."*

Capture as a flat list. Don't categorize yet.

### Step 2: The core test

For each item, ask one of these:

*"Якби цього не було — продукт все одно вирішував би основну job?"*

If YES → не core
If NO → core
If "ну... ну майже" → не core (sharpen the question if needed)

### Step 3: The hypothesis test (for borderline items)

*"Цей пункт — це гіпотеза що буде потрібно, чи ти знаєш що потрібно? Якщо гіпотеза — як ти її перевіриш ПІСЛЯ запуску? Якщо знаєш — звідки?"*

Hypotheses go to parking lot. Known needs go in. Pure guesses go out.

### Step 4: The cost test

*"Скільки часу це займе чесно? Не оптимістично, а чесно. Якщо більше тижня — точно в цій ітерації?"*

### Step 5: Categorize

Three buckets:
- **IN v1** — core + known critical
- **PARKED** — important later, with a trigger ("включаємо коли X")
- **OUT** — explicitly out (and why)

---

## Challenging questions — insert when she drifts

- *"Ти кажеш 'це важливо' — для кого і для якого моменту?"*
- *"Це 'must have' чи 'must have бо я не люблю різати'?"*
- *"Звідки ти знаєш що це треба? Якщо не знаєш — це гіпотеза, не need."*
- *"Цей пункт є в кожному 'мінімальному' релізі. Він мінімальний чи в тебе scope creep?"*
- *"Якщо вибиратимеш між цим і [інший пункт] — що в'їжджаєш в реліз без?"*

---

## The "kill it loud" technique

For items in the OUT category, ask: *"Як ти поясниш юзеру/собі через місяць чому цього немає?"*

If she can articulate it cleanly → good, scope is intentional.
If she fumbles → either it should be IN, or she's not fully accepting the cut.

---

## Parking lot format

Parked items should have a **trigger** — what brings them back to consideration:

```
- [Feature X] — trigger: "коли побачимо що юзери просять >3 разів"
- [Feature Y] — trigger: "після першого MVP feedback round"
- [Feature Z] — trigger: "коли база юзерів > 50"
```

Without a trigger, parked items become forgotten items.

---

## How to know it's done

- Every dumped item has a category
- IN bucket is defensible item-by-item
- OUT bucket has a "why not" for each (even one-liner)
- PARKED bucket has triggers

---

## Summary format (for Recorder bridge)

This produces multiple decisions, not one. Bridge:

*"Вийшов scope cut з 3 ключовими рішеннями: [IN-list summary], [OUT highlights], [parked]. Зафіксувати як одне scope decision чи розбити на окремі?"*

Format option A (one entry):
```
SCOPE for v1
- IN: [list]
- OUT: [list with reasons]
- PARKED: [list with triggers]
```

Format option B (separate entries per major decision) — better for items where she has strong "чому не":

```
DECISION: [feature X] not in v1
Why: [reason]
Parked or out: [parking lot with trigger / out forever]
```

---

## What NOT to do

- Don't help her keep things in scope by rationalizing — push toward cuts
- Don't accept "це швидко" without a time estimate
- Don't let her park more than 1/3 of the dumped items — that's a sign of avoidance, not prioritization
- Don't be MoSCoW-bureaucratic about it — three buckets is enough
