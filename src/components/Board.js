import React, { useState, useReducer, useEffect } from 'react'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import BoardContext from '../context/board-context'
import database from '../firebase/firebase'

const Board = ({ match }) => {
  const gameId = match.params.id
  const [frameworks, dispatch] = useReducer(frameworkReducer, [])
  const [wait, setWait] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const username = localStorage.getItem("username")
    if(username) setUsername(username)

    if(gameId) {
      const turnWatcher = database.ref(`games/${gameId}/turn`)
      turnWatcher.on("value", (snapshot) => {
        const turn = snapshot.val()
        if(turn === username) setWait(false)
        else setWait(true)
      })

      database.ref(`games/${gameId}`).on("value", (snapshot) => {
        const { board } = snapshot.val()
        if(board) dispatch({ type: "POPULATE", board })
      })
    }
    // eslint-disable-next-line 
  },[])

  useEffect(() => {
    if(frameworks.length > 0)
      database.ref(`games/${gameId}`).update({ board: frameworks, turn: username })
  }, [frameworks, gameId, username])

  return (
    <BoardContext.Provider value={{ frameworks, dispatch, wait, setWait }}>
      <div className="board">
        {frameworks.length && frameworks.map((framework, index) => {
          return (
            <Card key={index} index={index} {...framework} />
          )
        })}
      </div>
    </BoardContext.Provider>
  )
}

export { Board as default }
