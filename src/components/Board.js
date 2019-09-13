import React, { useState, useReducer, useEffect } from 'react'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import BoardContext from '../context/board-context'
import database from '../firebase/firebase'

const Board = ({ match }) => {
  const gameId = match.params.id
  const [frameworks, dispatch] = useReducer(frameworkReducer, [])
  const [openCard, setOpenCard] = useState(null)
  const [wait, setWait] = useState(false)
  const [name, setName] = useState("")
  const [against, setAgainst] = useState("")

  useEffect(() => {
    const name = localStorage.getItem("name")
    if(name) setName(name)
    if(gameId){

      database.ref(`games/${gameId}`).once("value", (snapshot) => {
        const game = snapshot.val()
        setAgainst(game.player1)
      })

      database.ref(`games/${gameId}/turn`).on("value", (snapshot) => {
        const turn = snapshot.val()
        if(turn === name) setWait(false)
        else setWait(true)
        console.log("name:",name, "turn:",turn, "wait:",wait);
      })

      database.ref(`games/${gameId}/board`).on("value", (snapshot) => {
        const board = snapshot.val()
        console.log(board);
        if(board)
          dispatch({ type: "POPULATE", board })
      })

    }
    // eslint-disable-next-line 
  },[])

  useEffect(() => {
    if(frameworks.length > 0)
      database.ref(`games/${gameId}`).update({ board: frameworks })
  }, [frameworks])

  const handleCheckPairs = (index) => {
    setWait(true)
    
    setTimeout(() => {
      dispatch({ type:"CHECK", index, open: openCard })
      setOpenCard(null)
      setWait(false)
      database.ref(`games/${gameId}`).update({turn: name})
    }, 600)
  }

  return (
    <BoardContext.Provider value={{ dispatch, openCard, setOpenCard, wait, gameId }}>
      <div className="board">
        {frameworks.length && frameworks.map((framework) => {
          return (
            <Card key={framework.index} {...framework} check={handleCheckPairs}/>
          )
        })}
      </div>
    </BoardContext.Provider>
  )
}

export { Board as default }
