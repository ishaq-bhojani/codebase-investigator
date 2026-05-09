const stateMap = new Map()

export function getState(conversationId) {
  return (
    stateMap.get(conversationId) || {
      establishedFacts: [],
      openQuestions: [],
      contradictions: [],
      importantFiles: []
    }
  )
}

export function updateState(conversationId, state) {
  stateMap.set(conversationId, state)
}
