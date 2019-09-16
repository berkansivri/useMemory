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
  const [against, setAgainst] = useState("")
  const [turn, setTurn] = useState("")

  useEffect(() => {
    console.log(gameId);
    const localUsername = localStorage.getItem("username")
    console.log(localUsername);
    if(localUsername) setUsername(localUsername)
    if(gameId) {
      const turnWatcher = database.ref(`games/${gameId}/turn`)
      turnWatcher.on("value", (snapshot) => {
        const turnVal = snapshot.val()
        console.log("turn:",turn);
        console.log("username:",localUsername);
        console.log(turn === localUsername);
        setTurn(turnVal)
        if(turnVal === localUsername) setWait(false)
        else setWait(true)
      })

      database.ref(`games/${gameId}/player2`).on("value", (snapshot) => {
        const player2 = snapshot.val()
        if(player2 !== localUsername) {
          setAgainst(player2)
        } else {
          database.ref(`games/${gameId}/player1`).once("value", (snapshot) => {
            const player1 =snapshot.val()
            setAgainst(player1)
          })
        }
      })

      database.ref(`games/${gameId}/board`).on("value", (snapshot) => {
        const board = snapshot.val()
        if(board) dispatch({ type: "POPULATE", board })
      })
    }
    // eslint-disable-next-line 
  },[])
  
  const updateTurn = () => database.ref(`games/${gameId}`).update({ turn: against })

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
        {against && `${against} connected`}<br />
        {turn && `Turn: ${turn}`}
      </div>
    </BoardContext.Provider>
  )
}

export { Board as default }
