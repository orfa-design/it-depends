'use client'

import { useState } from 'react'
import {
  Box, Button, Checkbox, FormControl, FormControlLabel,
  FormGroup, FormLabel, Radio, RadioGroup, TextField,
  Typography, Paper, Divider, Alert,
} from '@mui/material'

const AI_LEVELS = [
  { value: 'not-started', label: 'Ще не починав/ла — не знаю з чого' },
  { value: 'tried-stopped', label: 'Спробував/ла, але не продовжую' },
  { value: 'occasional', label: 'Використовую зрідка, коли є нагода' },
  { value: 'regular', label: 'Використовую регулярно — вже частина процесу' },
]

const TRIGGERS = [
  { value: 'colleague', label: 'Бачив/ла як колега зробив щось класне з AI' },
  { value: 'media', label: 'Читав/ла статтю або дивився/ла відео' },
  { value: 'task', label: 'Конкретна задача на роботі де AI міг би допомогти' },
  { value: 'team', label: 'Команда або менеджер почали використовувати' },
  { value: 'curiosity', label: 'Просто цікавість, без конкретного тригера' },
  { value: 'no-desire', label: 'Ще не маю конкретного бажання починати' },
  { value: 'already-using', label: 'Вже активно використовую' },
]

const PARALYSIS_OPTIONS = [
  { value: 'which-tool', label: 'Не знаю який інструмент взяти — їх дуже багато' },
  { value: 'which-task', label: 'Не знаю з якої задачі починати — що взагалі можна робити з AI?' },
  { value: 'how-to-use', label: 'Відкривав/ла щось конкретне, але не розумів/ла як в ньому працювати' },
  { value: 'disappointing', label: 'Спробував/ла — але результат розчарував' },
  { value: 'no-problem', label: 'Для мене це вже не проблема' },
]

const ONE_STEP_OPTIONS = [
  { value: 'yes', label: 'Так, одразу — саме цього і не вистачає' },
  { value: 'maybe', label: 'Мабуть, але залежить від того що саме' },
  { value: 'no', label: 'Ні — мені потрібно спочатку більше розуміти як це влаштовано' },
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
        Досліджуємо як дизайнери DataArt підходять до старту з AI.
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
            Що підштовхнуло тебе до думки "треба нарешті з AI щось робити"?
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

      {/* Q2 — Paralysis */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControl component="fieldset" fullWidth required>
          <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Коли думаєш про те щоб почати з AI — що здається найскладнішим?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Вибери одне що найближче *
          </Typography>
          <RadioGroup value={paralysis} onChange={e => setParalysis(e.target.value)}>
            {PARALYSIS_OPTIONS.map(o => (
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
            Є в твоїй роботі дизайнера щось що ти регулярно робиш руками і думаєш
            "це мало б бути простіше або автоматичніше"?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Коротко, будь-що — наприклад: "кожного разу руками пишу однотипний бриф",
            "збираю фідбек від клієнта в чаті"
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

      {/* Q4 — One step */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <FormControl component="fieldset" fullWidth required>
          <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Якби хтось сказав тобі конкретно "ось що зроби першим кроком з AI" —
            ти б спробував/ла?
          </FormLabel>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Вибери одне *
          </Typography>
          <RadioGroup value={oneStep} onChange={e => setOneStep(e.target.value)}>
            {ONE_STEP_OPTIONS.map(o => (
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
