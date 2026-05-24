import { kv } from '@vercel/kv'
import type { Metadata } from 'next'
import { WorkflowClient } from './WorkflowClient'
import { getSeed } from './seed'
import type { WorkflowState } from './seed'

export const metadata: Metadata = { title: 'It Depends — Workflow' }

export default async function WorkflowPage() {
  let state: WorkflowState
  try {
    const stored = await kv.get<WorkflowState>('workflow:vlad')
    if (stored && stored.version === 3) {
      state = stored
    } else {
      state = getSeed()
      await kv.set('workflow:vlad', state)
    }
  } catch {
    // KV unavailable (local dev without env) — fall back to seed
    state = getSeed()
  }

  // TODO: add polling
  return <WorkflowClient initialState={state} />
}
