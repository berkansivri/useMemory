import React, {  useReducer, useEffect, useContext } from 'react'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'

const Board = () => {
  const [frameworks, dispatch] = useReducer(frameworkReducer, [])
  const { setWait, nextTurn, gameId } = useContext(GameContext)

  useEffect(() => {

    if(gameId) {
      database.ref(`games/${gameId}/board`).on("value", (snapshot) => {
        const board = snapshot.val()
        console.log(board);
        if(board) dispatch({ type: "POPULATE", board })
      })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(frameworks.length > 0)
      database.ref(`games/${gameId}`).update({ board: frameworks })
  }, [frameworks, gameId])

  const handleCardClick = (index) => {
    const openCard = frameworks.findIndex(x=> x.isOpen === true && x.isMatch === false)
    dispatch({ type:"OPEN", index })
    if(openCard > -1) {
      setWait(true)

      setTimeout(() => {
        dispatch({ type:"CHECK", index, open: openCard })
        setWait(false)
        nextTurn();
      }, 600)
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
