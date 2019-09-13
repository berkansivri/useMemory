import React, { useState, useReducer, useEffect } from 'react'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import BoardContext from '../context/board-context'
import firebase from '../firebase/firebase'

const Board = ({ match }) => {

  const [frameworks, dispatch] = useReducer(frameworkReducer, [])
  const [openCard, setOpenCard] = useState(null)
  const [wait, setWait] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    const name = localStorage.getItem("name")
    if(name) setName(name)
    if(match.params.id){
      firebase.ref(`games/${match.params.id}/turn`).on("value", (snapshot) => {
        const turn = snapshot.val()
        if(turn === name) setWait(false)
        else setWait(true)
        console.log("name:",name, "turn:",turn, "wait:",wait);
      })

      firebase.ref(`games/${match.params.id}/board`).on("value", (snapshot) => {
        const board = snapshot.val()
        console.log(board);
        if(board)
          dispatch({ type: "POPULATE", board })
      })

    }
    // eslint-disable-next-line 
  },[])
  const handleCheckPairs = (index) => {
    setWait(true)
    
    setTimeout(() => {
      dispatch({ type:"CHECK", index, open: openCard })
      setOpenCard(null)
      setWait(false)
      firebase.ref(`games/${match.params.id}`).update({turn: name})
    }, 600)
  }

  return (
    <BoardContext.Provider value={{ dispatch, openCard, setOpenCard, wait }}>
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
