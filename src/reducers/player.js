const playerReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.players
    case "ADD":
      return [ action.player ,...state]
    case "REMOVE":
      return state.filter(x => x.id !== action.id)
    default:
      return state
  }
}

export default playerReducer
