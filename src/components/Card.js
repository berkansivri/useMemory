import React, { useContext } from 'react'
import BoardContext from '../context/board-context'
const Card = ({ index, name, isOpen }) => {
  const { frameworks, dispatch } = useContext(BoardContext)

  const handleCardClick = () => {
    const hasOpenCard = frameworks.find(f => f.isOpen === true && f.isMatch === false)
    console.log(hasOpenCard);
    dispatch({ type:"OPEN", index })
    if(hasOpenCard) {
      setTimeout(() => {
        dispatch({ type:"CHECK", index, open: hasOpenCard.index })
      }, 600)
    }
  }
  return (
    <div className={"card" + (isOpen ? " opened" : "")} onClick={handleCardClick}>
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
