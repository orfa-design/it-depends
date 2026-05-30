'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  forceSimulation, forceLink, forceManyBody,
  forceX, forceY, forceCollide,
  type Simulation,
} from 'd3-force'
import { STEPS, STEPS_EXTRA, getStatus, isDone } from '../../lib/data'
import type { Step, StepCategory } from '../../lib/data'

// ── layout constants ──────────────────────────────────────────────────────────

const CARD_W = 188
const CARD_H = 82
const CARD_COLLISION = 80  // forceCollide radius
const GRAPH_H = 2000       // fixed tall canvas height

const LAYER_Y: Record<number, number> = {
  0: 0.08,
  1: 0.26,
  2: 0.47,
  3: 0.68,
  4: 0.88,
}

const LAYER_LABELS: Record<number, string> = {
  0: 'простий чат',
  1: 'більше можливостей',
  2: 'промпт-інженерія',
  3: 'код і деплой',
  4: 'повний продукт',
}

const CAT_X: Record<StepCategory, number> = {
  research:    0.18,
  planning:    0.36,
  workflow:    0.54,
  prototyping: 0.72,
  code:        0.88,
}

const CAT_COLORS: Record<StepCategory, string> = {
  research:    '#1D9E75',
  planning:    '#7F77DD',
  prototyping: '#D85A30',
  code:        '#378ADD',
  workflow:    '#BA7517',
}

const CAT_LABELS: Record<StepCategory, string> = {
  research:    'Дослідження',
  planning:    'Планування',
  workflow:    'Воркфлоу',
  prototyping: 'Прототип',
  code:        'Код',
}

// ── types ─────────────────────────────────────────────────────────────────────

interface SimNode {
  id: string
  stepIdx: number
  step: Step
  x: number
  y: number
  vx: number
  vy: number
  fx: number | null
  fy: number | null
}

// ── edge generation ───────────────────────────────────────────────────────────

function generateEdges(nodes: SimNode[]) {
  const edges: { source: string | SimNode; target: string | SimNode }[] = []
  const seen = new Set<string>()
  const byCategory: Record<string, SimNode[]> = {}
  nodes.forEach(n => {
    if (!byCategory[n.step.category]) byCategory[n.step.category] = []
    byCategory[n.step.category].push(n)
  })
  Object.values(byCategory).forEach(group => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const key = `${group[i].id}→${group[j].id}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push({ source: group[i].id, target: group[j].id })
        }
      }
    }
  })
  return edges
}

// ── draw edges on canvas ──────────────────────────────────────────────────────

function drawEdges(
  ctx: CanvasRenderingContext2D,
  nodes: SimNode[],
  edges: { source: SimNode | string; target: SimNode | string }[],
  w: number,
  h: number,
  dpr: number,
  activeId: string | null,
) {
  ctx.clearRect(0, 0, w * dpr, h * dpr)
  ctx.save()
  ctx.scale(dpr, dpr)

  edges.forEach(e => {
    const src = e.source as SimNode
    const tgt = e.target as SimNode
    if (!src?.x || !tgt?.x) return
    const color = CAT_COLORS[src.step.category]
    let opacity = 0.22
    if (activeId) {
      const connected = src.id === activeId || tgt.id === activeId
      opacity = connected ? 0.55 : 0.05
    }
    ctx.beginPath()
    ctx.moveTo(src.x, src.y)
    ctx.lineTo(tgt.x, tgt.y)
    ctx.strokeStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0')
    ctx.lineWidth = 1.2
    ctx.stroke()
  })

  ctx.restore()
}

// ── component ─────────────────────────────────────────────────────────────────

export default function GraphView({
  onOpenPrompt,
  renderDetail,
}: {
  onOpenPrompt: (idx: number) => void
  renderDetail: (stepIdx: number) => React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const simRef       = useRef<Simulation<SimNode, never> | null>(null)
  const nodesRef     = useRef<SimNode[]>([])
  const edgesRef     = useRef<ReturnType<typeof generateEdges>>([])
  const rafRef       = useRef<number>(0)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [activeId, setActiveId]   = useState<string | null>(null)
  const dragRef  = useRef<{ node: SimNode; ox: number; oy: number } | null>(null)

  const initSim = useCallback((w: number, h: number) => {
    simRef.current?.stop()

    const nodes: SimNode[] = STEPS.map((step, i) => ({
      id: step.id, stepIdx: i, step,
      x: CAT_X[step.category] * w + (Math.random() - 0.5) * 80,
      y: (LAYER_Y[step.layer] ?? 0.5) * h + (Math.random() - 0.5) * 60,
      vx: 0, vy: 0, fx: null, fy: null,
    }))
    const edges = generateEdges(nodes)
    nodesRef.current = nodes
    edgesRef.current = edges

    simRef.current = forceSimulation<SimNode>(nodes)
      .force('link', forceLink<SimNode, typeof edges[0]>(edges).id(d => (d as SimNode).id).distance(110).strength(0.08))
      .force('charge', forceManyBody<SimNode>().strength(-280))
      .force('catX', forceX<SimNode>(d => CAT_X[d.step.category] * w).strength(0.07))
      .force('metaY', forceY<SimNode>(d => (LAYER_Y[d.step.layer] ?? 0.5) * h).strength(0.3))
      .force('collide', forceCollide<SimNode>(CARD_COLLISION))
      .alphaDecay(0.016)
      .on('tick', () => {
        const pos: Record<string, { x: number; y: number }> = {}
        nodesRef.current.forEach(n => {
          // clamp within canvas
          n.x = Math.max(CARD_W / 2 + 8, Math.min(w - CARD_W / 2 - 8, n.x))
          n.y = Math.max(CARD_H / 2 + 36, Math.min(h - CARD_H / 2 - 12, n.y))
          pos[n.id] = { x: n.x, y: n.y }
        })
        setPositions({ ...pos })
      })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const dpr = window.devicePixelRatio || 1
    let w = container.clientWidth
    const h = GRAPH_H
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'

    initSim(w, h)

    const ctx = canvas.getContext('2d')!
    const loop = () => {
      drawEdges(ctx, nodesRef.current, edgesRef.current as never[], w, h, dpr, activeId)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => {
      w = container.clientWidth
      canvas.width = w * dpr
      canvas.style.width = w + 'px'
      simRef.current
        ?.force('catX', forceX<SimNode>(d => CAT_X[d.step.category] * w).strength(0.07))
        .alpha(0.3).restart()
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(rafRef.current)
      simRef.current?.stop()
      ro.disconnect()
    }
  }, [initSim, activeId])

  // drag
  const onMouseDown = useCallback((e: React.MouseEvent, node: SimNode) => {
    e.stopPropagation()
    dragRef.current = { node, ox: e.clientX - node.x, oy: e.clientY - node.y }
    node.fx = node.x
    node.fy = node.y
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return
    const { node, ox, oy } = dragRef.current
    const rect = containerRef.current!.getBoundingClientRect()
    node.fx = e.clientX - rect.left
    node.fy = e.clientY - rect.top
    simRef.current?.alpha(0.1).restart()
  }, [])

  const onMouseUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.node.fx = null
      dragRef.current.node.fy = null
      simRef.current?.alpha(0.1).restart()
    }
    dragRef.current = null
  }, [])

  const handleCardClick = useCallback((node: SimNode) => {
    if (dragRef.current) return
    setActiveId(prev => prev === node.id ? null : node.id)
  }, [])

  const activeNode = nodesRef.current.find(n => n.id === activeId) ?? null

  return (
    <div className="graph-layout">
      {/* ── left: graph area ── */}
      <div
        className="graph-view"
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={() => setActiveId(null)}
      >
        {Object.entries(LAYER_LABELS).map(([layer, label]) => (
          <div
            key={layer}
            className="graph-zone-label"
            style={{ top: `calc(${(LAYER_Y[Number(layer)] ?? 0.5) * 100}% - 28px)` }}
          >
            {label}
          </div>
        ))}

        <canvas ref={canvasRef} className="graph-canvas" />

        {nodesRef.current.map(node => {
          const pos = positions[node.id]
          if (!pos) return null
          const st = getStatus(node.stepIdx)
          const done = isDone(st)
          const isCur = st === 'cur'
          const isActive = activeId === node.id
          const isDimmed = activeId !== null && activeId !== node.id && !edgesRef.current.some(e => {
            const s = (e.source as SimNode).id ?? e.source
            const t = (e.target as SimNode).id ?? e.target
            return (s === activeId && t === node.id) || (t === activeId && s === node.id)
          })
          return (
            <div
              key={node.id}
              className={`gnode-card${done ? ' done' : ''}${isCur ? ' cur' : ''}${isActive ? ' active' : ''}${isDimmed ? ' dimmed' : ''}`}
              style={{
                left: pos.x - CARD_W / 2,
                top: pos.y - CARD_H / 2,
                borderColor: isActive ? CAT_COLORS[node.step.category] : undefined,
              }}
              onMouseDown={e => onMouseDown(e, node)}
              onClick={e => { e.stopPropagation(); handleCardClick(node) }}
            >
              <div className="gnode-header">
                <span className="gnode-cat" style={{ color: CAT_COLORS[node.step.category] }}>
                  {CAT_LABELS[node.step.category]}
                </span>
                {done && <span className="gnode-status-dot done-dot" />}
                {isCur && <span className="gnode-status-dot cur-dot" />}
              </div>
              <div className="gnode-title">{node.step.title}</div>
              <div className="gnode-sub">{node.step.subtitle}</div>
              <div className="gnode-layer">
                {[0,1,2,3,4].map(i => (
                  <span key={i} className={`gnode-layer-dot${i <= node.step.layer ? ' filled' : ''}`} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── right: detail panel ── */}
      <div className="graph-sidebar">
        {activeNode
          ? renderDetail(activeNode.stepIdx)
          : (
            <div className="graph-sidebar-empty">
              <p>клікни на картку<br />щоб побачити деталі</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
