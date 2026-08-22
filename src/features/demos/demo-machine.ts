export type DemoStatus = 'idle' | 'running' | 'failed' | 'completed'

export interface DemoDefinition {
  stages: string[]
  failureStage?: string
}

export interface DemoState {
  status: DemoStatus
  activeStage: string | null
  completedStages: string[]
  simulateFailure: boolean
  failedOnce: boolean
}

export type DemoAction =
  | { type: 'start'; simulateFailure?: boolean }
  | { type: 'advance' }
  | { type: 'retry' }
  | { type: 'reset' }

export function initialDemoState(definition: DemoDefinition): DemoState {
  void definition
  return { status: 'idle', activeStage: null, completedStages: [], simulateFailure: false, failedOnce: false }
}

export function reduceDemo(state: DemoState, action: DemoAction, definition: DemoDefinition): DemoState {
  if (action.type === 'reset') return initialDemoState(definition)
  if (action.type === 'start') {
    return {
      status: 'running', activeStage: definition.stages[0] ?? null, completedStages: [],
      simulateFailure: Boolean(action.simulateFailure), failedOnce: false,
    }
  }
  if (action.type === 'retry' && state.status === 'failed') return { ...state, status: 'running', failedOnce: true }
  if (action.type !== 'advance' || state.status !== 'running' || !state.activeStage) return state

  if (state.simulateFailure && !state.failedOnce && state.activeStage === definition.failureStage) {
    return { ...state, status: 'failed', failedOnce: true }
  }

  const completedStages = [...state.completedStages, state.activeStage]
  const nextStage = definition.stages[completedStages.length] ?? null
  return nextStage
    ? { ...state, activeStage: nextStage, completedStages }
    : { ...state, status: 'completed', activeStage: null, completedStages }
}
