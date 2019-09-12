import React, { useReducer } from 'react'
import getFrameworks from '../selectors/framework'
import Card from './Card'
import frameworkReducer from '../reducers/frameworks'
import BoardContext from '../context/board-context'

const Board = () => {
  const frameworkNames = getFrameworks(12)
  const gameFrameworks = []

  for(let i = 0; i < frameworkNames.length; i++) {
    gameFrameworks.push({ name: frameworkNames[i], index: i, isOpen: false, isMatch: false })
  }
  const [frameworks, dispatch] = useReducer(frameworkReducer, gameFrameworks)

  return (
    <BoardContext.Provider value={{ frameworks, dispatch }}>
      <div className="board">
        {frameworks.map((framework) => {
          return (
            <Card key={framework.index} {...framework}/>
          )
        })}
      </div>
    </BoardContext.Provider>
  )
}

export { Board as default }
