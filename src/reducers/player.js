const playerReducer = (state, action) => {
  switch (action.type) {
    case "POPULATE":
      return action.players
    default:
      return state
  }
}

export default playerReducer
