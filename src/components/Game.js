import React, { useState, useEffect } from 'react'
import Board from './Board'
import GameContext from '../context/game-context'
import Players from './Players'
import database from '../firebase/firebase'

const Game = ({ match }) => {
  const gameId = match.params.id
  const [turn, setTurn] = useState("")
  const [wait, setWait] = useState(false)
  const [players, setPlayers] = useState([]) 
  const [localPlayer, setLocalPlayer] = useState(JSON.parse(localStorage.getItem("player")))

  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(localPlayer))
  }, [localPlayer])

  const nextTurn = () => {
    const nextTurnIndex = (players.findIndex((user) => user.id === localPlayer.id) + 1) % players.length
    database.ref(`games/${gameId}`).update({ turn: players[nextTurnIndex].id })
  }

  return (
    <GameContext.Provider value={{gameId, turn, setTurn, localPlayer, wait, setWait, setPlayers, nextTurn, players, setLocalPlayer}}>
      <div className="container">
        <div className="row">
          <div className="col-3 align-self-start">
            <Players />
          </div>
          <div className="col-9">
            <Board />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  )
}

export { Game as default }
