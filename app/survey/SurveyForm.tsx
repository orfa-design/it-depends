'use client'

import { useState } from 'react'
import {
  Box, Button, Checkbox, FormControl, FormControlLabel,
  FormGroup, FormLabel, Radio, RadioGroup, TextField,
  Typography, Paper, Divider, Alert,
} from '@mui/material'

const AI_LEVELS = [
  { value: 'not-tried', label: 'Ще не пробував/ла' },
  { value: 'tried-few', label: 'Пробував/ла кілька разів' },
  { value: 'occasional', label: 'Використовую епізодично' },
  { value: 'regular', label: 'Використовую регулярно' },
  { value: 'core', label: 'AI — важлива частина мого процесу' },
]

const TRIGGERS = [
  { value: 'colleague', label: 'Побачив/ла приклад від колеги' },
  { value: 'task', label: 'Конкретна задача на роботі' },
  { value: 'media', label: 'Контент: стаття або відео' },
  { value: 'team', label: 'Вимоги або ініціативи команди' },
  { value: 'curiosity', label: 'Власна цікавість' },
  { value: 'nothing-yet', label: 'Поки не було нічого такого' },
]

const BARRIER_OPTIONS = [
  { value: 'where-to-start', label: 'Не знаю з чого почати' },
  { value: 'no-clear-use-case', label: 'Не розумію де AI реально корисний саме для мене' },
  { value: 'weak-results', label: 'Результати виглядали слабкими' },
  { value: 'no-time', label: 'Не вистачає часу розібратись' },
  { value: 'too-many-tools', label: 'Занадто багато інструментів — важко вибрати' },
  { value: 'no-trust', label: 'Не довіряю якості результатів' },
  { value: 'no-need', label: 'Не бачу потреби' },
  { value: 'not-a-problem', label: 'Це вже не проблема' },
]

const EXAMPLE_OPTIONS = [
  { value: 'example-trigger', label: 'Саме те чого не вистачає — одразу б спробував/ла щось схоже' },
  { value: 'useful-partial', label: 'Скоріше корисний, але проблема не тільки в браку прикладів' },
  { value: 'need-basics', label: 'Навряд чи допоміг би — мені потрібно спочатку більше розібратись в основах' },
  { value: 'already-using', label: 'Не потрібен — я вже активно використовую AI в роботі' },
]

export function SurveyForm() {
  const [name, setName] = useState('')
  const [wasAtWorkshop, setWasAtWorkshop] = useState(false)
  const [aiLevel, setAiLevel] = useState('')
  const [triggers, setTriggers] = useState<string[]>([])
  const [triggersOther, setTriggersOther] = useState('')
  const [paralysis, setParalysis] = useState('')
  const [paralysisOther, setParalysisOther] = useState('')
  const [workIdea, setWorkIdea] = useState('')
  const [oneStep, setOneStep] = useState('')
  const [oneStepOther, setOneStepOther] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  function toggleTrigger(value: string) {
    setTriggers(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!aiLevel || !paralysis || !oneStep) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, wasAtWorkshop, aiLevel, triggers, triggersOther, paralysis, paralysisOther, workIdea, oneStep, oneStepOther }),
      })
      if (!res.ok) throw new Error('API error')
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', px: 3, py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Дякую!</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Твоя відповідь допоможе нам зробити кращий продукт для дизайнерів DataArt.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', px: 3, py: 6 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        2 хвилини про AI
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4, fontSize: 14 }}>
        Досліджуємо як дизайнери DataArt взаємодіють з AI у своїй роботі.
        Анонімно, 4 питання.
      </Typography>

      {/* Name */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl fullWidth>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Як тебе звати? <Typography component="span" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: 13 }}>(необов'язково)</Typography>
          </FormLabel>
          <TextField
            size="small"
            placeholder="Ім'я або нік..."
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
        </FormControl>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={wasAtWorkshop}
              onChange={e => setWasAtWorkshop(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography sx={{ fontSize: 14 }}>
              Я був/ла на AI-воркшопі в офісі DataArt
            </Typography>
          }
        />
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Q0 — AI level */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl component="fieldset" fullWidth required>
          <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Де ти зараз з AI у своїй роботі?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Вибери одне *
          </Typography>
          <RadioGroup value={aiLevel} onChange={e => setAiLevel(e.target.value)}>
            {AI_LEVELS.map(o => (
              <FormControlLabel
                key={o.value}
                value={o.value}
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: 14 }}>{o.label}</Typography>}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Q1 — Тригер */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Що найбільше вплинуло на твій інтерес до AI?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Вибери все що підходить
          </Typography>
          <FormGroup>
            {TRIGGERS.map(t => (
              <FormControlLabel
                key={t.value}
                control={
                  <Checkbox
                    checked={triggers.includes(t.value)}
                    onChange={() => toggleTrigger(t.value)}
                    size="small"
                  />
                }
                label={<Typography sx={{ fontSize: 14 }}>{t.label}</Typography>}
              />
            ))}
            <FormControlLabel
              control={
                <Checkbox
                  checked={triggers.includes('other')}
                  onChange={() => toggleTrigger('other')}
                  size="small"
                />
              }
              label={<Typography sx={{ fontSize: 14 }}>Інше</Typography>}
            />
            {triggers.includes('other') && (
              <TextField
                size="small"
                placeholder="Напиши що саме..."
                value={triggersOther}
                onChange={e => setTriggersOther(e.target.value)}
                sx={{ mt: 0.5, ml: 4 }}
              />
            )}
          </FormGroup>
        </FormControl>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Q2 — Barrier */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl component="fieldset" fullWidth required>
          <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Що зараз найбільше заважає тобі використовувати AI частіше?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Вибери одне що найближче *
          </Typography>
          <RadioGroup value={paralysis} onChange={e => setParalysis(e.target.value)}>
            {BARRIER_OPTIONS.map(o => (
              <FormControlLabel
                key={o.value}
                value={o.value}
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: 14 }}>{o.label}</Typography>}
              />
            ))}
            <FormControlLabel
              value="other"
              control={<Radio size="small" />}
              label={<Typography sx={{ fontSize: 14 }}>Інше</Typography>}
            />
            {paralysis === 'other' && (
              <TextField
                size="small"
                placeholder="Напиши що саме..."
                value={paralysisOther}
                onChange={e => setParalysisOther(e.target.value)}
                sx={{ mt: 0.5, ml: 4 }}
              />
            )}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Q3 — Work idea */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl fullWidth>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Які повторювані або рутинні задачі в роботі дизайнера тобі хотілося б спростити або автоматизувати?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Наприклад: тексти, ресерч, документація, фідбек, UI cleanup, handoff…
          </Typography>
          <TextField
            multiline
            rows={2}
            placeholder="Напиши що спадає на думку..."
            value={workIdea}
            onChange={e => setWorkIdea(e.target.value)}
            size="small"
            fullWidth
          />
        </FormControl>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Q4 — Example reaction */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <FormControl component="fieldset" fullWidth required>
          <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Конкретний приклад "як дизайнер використовує AI в реальних задачах" для мене:
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Вибери одне *
          </Typography>
          <RadioGroup value={oneStep} onChange={e => setOneStep(e.target.value)}>
            {EXAMPLE_OPTIONS.map(o => (
              <FormControlLabel
                key={o.value}
                value={o.value}
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: 14 }}>{o.label}</Typography>}
              />
            ))}
            <FormControlLabel
              value="other"
              control={<Radio size="small" />}
              label={<Typography sx={{ fontSize: 14 }}>Інше</Typography>}
            />
            {oneStep === 'other' && (
              <TextField
                size="small"
                placeholder="Напиши що саме..."
                value={oneStepOther}
                onChange={e => setOneStepOther(e.target.value)}
                sx={{ mt: 0.5, ml: 4 }}
              />
            )}
          </RadioGroup>
        </FormControl>
      </Paper>

      {(!aiLevel || !paralysis || !oneStep) && (
        <Alert severity="info" sx={{ mb: 2, fontSize: 13 }}>
          Заповни обов'язкові питання (Q0, Q2 і Q4) щоб відправити
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
          Щось пішло не так. Спробуй ще раз або напиши Liuda / Vlad.
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={!aiLevel || !paralysis || !oneStep || loading}
        fullWidth
        size="large"
        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        {loading ? 'Відправляємо...' : 'Відправити відповідь'}
      </Button>
    </Box>
  )
}
