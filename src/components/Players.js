import React, { useEffect, useContext } from 'react'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'

const Players = () => {
  const { localPlayer, turn, gameId, setWait, setPlayers, players, setTurn } = useContext(GameContext)


  useEffect(() => {
    database.ref(`games/${gameId}/players`).on("value", (snapshot) => {
      const users = snapshot.val()
      setPlayers(Object.entries(users).map(x=> ({ id: x[0], ...x[1] })))
    })

    database.ref(`games/${gameId}/turn`).on("value", (snapshot) => {
      const turnId = snapshot.val()
      setTurn(turnId)
      if(turnId === localPlayer.id) setWait(false)
      else setWait(true)
    })

    database.ref(`games/${gameId}/players/${localPlayer.id}`).onDisconnect().update({ isOnline: false })
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <p>Players</p>
      <ul className="list-group">
        {players.length > 0 && players.filter(x=> x.isOnline).map(p => 
          <li className={"list-group-item" + (p.id === turn ? " active" : "")} key={p.id}>{p.username}</li>)
        }
      </ul>
    </div>
  )
}

export { Players as default }