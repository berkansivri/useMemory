import React, { useContext } from 'react'
import GameContext from '../context/game-context'

const Card = ({ name, isOpen, isMatch, cardClick }) => {

  const { wait } = useContext(GameContext)

  const handleCardClick = () => {
    if(wait || isOpen || isMatch) return

    cardClick()
  }

  return (
    <div className={"card" + (isOpen ? " opened" : "") + (isMatch ? " matched" : "")} onClick={handleCardClick}>
      <div className="front">
        ?
      </div>
      <div className="back">
        <img src={`${process.env.PUBLIC_URL}/logos/${name}.png`} alt={name}/>
      </div>
    </div>
  )
}

export { Card as default }
