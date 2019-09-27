import { useEffect, useReducer } from 'react'
import playerReducer from '../reducers/player'

const usePlayers = (dbRef) => {
  const [players, dispatch] = useReducer(playerReducer)
  
  useEffect(() => {
    const playersConnections = async () => {

      await dbRef.child("players").on("value", (snapshot) => {
        console.log(Object.entries(snapshot.val()).map((p) => ({ id:p[0], ...p[1] }) ));
        dispatch({ type:"SET", players: Object.entries(snapshot.val()).map((p) => ({ id:p[0], ...p[1] }) ) })
      })
  
      dbRef.child("players").on("child_removed", (snapshot) => {
        const turn = dbRef.child("turn").once("value")
        if(turn && turn === snapshot.key) {
          let turnIndex = (players.indexOf(turn) + 1) % players.length
          dbRef.update({ turn: players[turnIndex].id })
        }
      })
    }
    playersConnections()
    // eslint-disable-next-line
  },[])

  return { players }
}

export { usePlayers as default }
