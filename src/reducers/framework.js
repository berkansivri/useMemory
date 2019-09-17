const frameworkReducer = (state, action) => {
  switch (action.type) {
    case "POPULATE":
      return action.board;
    case "OPEN":
      state[action.index].isOpen = true 
      return [...state]
    case "CLOSE":
      state[action.index].isOpen = false
      state[action.open].isOpen = false
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
