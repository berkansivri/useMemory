const frameworkReducer = (state, action) => {
  switch (action.type) {
    case "POPULATE":
      return action.board
    case "OPEN":
      state[action.index].isOpen = true 
      return [...state]
    case "CLOSE":
      if(!action.index && !action.open) return state
      if(action.index !== undefined) state[action.index].isOpen = false
      if(action.open !== undefined)  state[action.open].isOpen = false
      return [...state]
    case "MATCH":
      state[action.index].isMatch = true
      state[action.open].isMatch = true
      return [...state]
    default:
      return state
  }
}

export default frameworkReducer
