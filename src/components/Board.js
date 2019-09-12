import React, { useState, useReducer } from 'react'
import getFrameworks from '../selectors/framework'
import Card from './Card'
import frameworkReducer from '../reducers/framework'
import BoardContext from '../context/board-context'

const Board = () => {
  
  const frameworkNames = getFrameworks(12)
  const gameFrameworks = frameworkNames.map((name, index) => ({ name, index, isOpen: false, isMatch: false }))

  const [frameworks, dispatch] = useReducer(frameworkReducer, gameFrameworks)
  const [openCard, setOpenCard] = useState(null)
  const [wait, setWait] = useState(false)

  const handleCheckPairs = (index) => {
    setWait(true)
    
    setTimeout(() => {
      dispatch({ type:"CHECK", index, open: openCard })
      setOpenCard(null)
      setWait(false)
    }, 600)
  }

  return (
    <BoardContext.Provider value={{ dispatch, openCard, setOpenCard, wait }}>
      <div className="board">
        {frameworks.map((framework) => {
          return (
            <Card key={framework.index} {...framework} check={handleCheckPairs}/>
          )
        })}
      </div>
    </BoardContext.Provider>
  )
}

export { Board as default }
