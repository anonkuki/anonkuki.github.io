import { describe, expect, it } from 'vitest'
import {
  initialDemoState,
  reduceDemo,
  type DemoDefinition,
} from '../src/features/demos/demo-machine'

const definition: DemoDefinition = {
  stages: ['parse', 'review', 'deliver'],
  failureStage: 'review',
}

describe('deterministic case demo state machine', () => {
  it('advances from idle to completed through every stage', () => {
    let state = reduceDemo(initialDemoState(definition), { type: 'start' }, definition)
    state = reduceDemo(state, { type: 'advance' }, definition)
    state = reduceDemo(state, { type: 'advance' }, definition)
    state = reduceDemo(state, { type: 'advance' }, definition)
    expect(state.status).toBe('completed')
    expect(state.completedStages).toEqual(definition.stages)
  })

  it('fails once at the configured stage and resumes after retry', () => {
    let state = reduceDemo(initialDemoState(definition), { type: 'start', simulateFailure: true }, definition)
    state = reduceDemo(state, { type: 'advance' }, definition)
    state = reduceDemo(state, { type: 'advance' }, definition)
    expect(state.status).toBe('failed')
    state = reduceDemo(state, { type: 'retry' }, definition)
    expect(state.status).toBe('running')
    expect(state.activeStage).toBe('review')
  })

  it('resets to a clean idle state', () => {
    const running = reduceDemo(initialDemoState(definition), { type: 'start' }, definition)
    expect(reduceDemo(running, { type: 'reset' }, definition)).toEqual(initialDemoState(definition))
  })
})
