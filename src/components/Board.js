import React, {  useReducer, useEffect, useContext } from 'react'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'
import getFrameworks from '../selectors/framework'

const Board = () => {
  const [frameworks, dispatch] = useReducer(frameworkReducer, [])
  const { setWait, nextTurn, gameId, players, localPlayer, setLocalPlayer } = useContext(GameContext)

  useEffect(() => {

    if(gameId) {
      database.ref(`games/${gameId}/board`).on("value", (snapshot) => {
        const board = snapshot.val()
        if(board) dispatch({ type: "POPULATE", board })
      })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(frameworks.length > 0) {
      database.ref(`games/${gameId}`).update({ board: frameworks })
      handleCheckWinner()
    }
    // eslint-disable-next-line
  }, [frameworks, gameId])

  const handleCardClick = (index) => {
    const open = frameworks.findIndex(x=> x.isOpen === true && x.isMatch === false)
    dispatch({ type:"OPEN", index })
    
    if(open > -1) {
      setWait(true)
      setTimeout(() => {
        if(frameworks[index].name === frameworks[open].name) {
          dispatch({ type:"MATCH", index, open })
          database.ref(`games/${gameId}/players/${localPlayer.id}`).update({ point: ++localPlayer.point })
          setLocalPlayer({ ...localPlayer })
        } else {
          dispatch({ type:"CLOSE", index, open })
        }
        setWait(false)
        nextTurn();
      }, 600)
    }
  }

  const handleCheckWinner = () => {
    if(frameworks.every(x => x.isMatch === true)) {
      const winner = players.reduce((prev,curr) => (prev.point > curr.point) ? prev : curr)
      const startNew = window.confirm(`Winner: ${winner.username}! Would you like to start new game?`)
      if(startNew) {
        const board = getFrameworks(frameworks.length/2)
        dispatch({ type:"POPULATE", board })
      }
    }
  }

  return (
    <div className="board">
      {frameworks.length && frameworks.map((framework, index) => {
        return (
          <Card key={index} index={index} {...framework} cardClick={() => handleCardClick(index)} />
        )
      })}
    </div>
  )
}

export { Board as default }
