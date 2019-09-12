const frameworkReducer = (state, action) => {
  switch (action.type) {
    case "POPULATE":
      break;
    case "OPEN":
      state[action.index].isOpen = true 
      return [...state]
    case "CHECK":
      const { index, open } = action
      if(state[index].name === state[open].name) {
        state[index].isMatch = true
        state[open].isMatch = true
      } else {
        state[index].isOpen = false
        state[open].isOpen = false
      }
      return [...state]
    default:
      return state
  }
}

export default frameworkReducer
