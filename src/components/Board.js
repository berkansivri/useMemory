import React from 'react'
import frameworks from '../selectors/framework'
import Card from './Card'

const Board = () => {
  const randomFrameworks = frameworks(12)
  const gameFrameworks = [...randomFrameworks, ...randomFrameworks]

  console.log(gameFrameworks);
  return (
    <div className="board">
      {gameFrameworks.map((framework,i) =>(
        <Card key={i}/>
      ))}
    </div>
  )
}

export { Board as default }