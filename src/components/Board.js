import React, { useState, useReducer, useEffect } from 'react'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import BoardContext from '../context/board-context'
import database from '../firebase/firebase'

const Board = ({ match }) => {
  const gameId = match.params.id
  const [frameworks, dispatch] = useReducer(frameworkReducer, [])
  const [wait, setWait] = useState(false)
  const [players, setPlayers] = useState([])
  const [turn, setTurn] = useState(0)
  const [player, setPlayer] = useState({})

  useEffect(() => {
    const localPlayer = JSON.parse(localStorage.getItem("player"))
    setPlayer(localPlayer)
    if(gameId) {
      
      const turnRef = database.ref(`games/${gameId}/turn`)
      turnRef.on("value", (snapshot) => {
        const turnId = snapshot.val()
        setTurn(turnId)
        if(turnId === localPlayer.id) setWait(false)
        else setWait(true)
      })
      
      database.ref(`games/${gameId}/players`).on("value", (snapshot) => {
        const users = snapshot.val()
        console.log(users);
        setPlayers([users])
      })
      database.ref(`games/${gameId}/players/${localPlayer.id}`).onDisconnect({ isOnline: false })
      
      database.ref(`games/${gameId}/board`).on("value", (snapshot) => {
        const board = snapshot.val()
        if(board) dispatch({ type: "POPULATE", board })
      })
    }
    // eslint-disable-next-line
  }, [])
  
  const updateTurn = () => {
    const nextTurnIndex = (players.findIndex((user) => user.id === player.id) + 1) % players.length
    database.ref(`games/${gameId}`).update({ turn: players[nextTurnIndex].id })
  }

  useEffect(() => {
    if(frameworks.length > 0)
      database.ref(`games/${gameId}`).update({ board: frameworks })
  }, [frameworks, gameId])

  return (
    <BoardContext.Provider value={{ frameworks, dispatch, wait, setWait, updateTurn }}>
      <div className="board">
        {frameworks.length && frameworks.map((framework, index) => {
          return (
            <Card key={index} index={index} {...framework} />
          )
        })}
      </div>
      <div>
        {players.map((user) => user.name)} online.
        {turn && `Turn: ${turn.name}`} <br />
      </div>
    </BoardContext.Provider>
  )
}

export { Board as default }
