import React, { useContext } from 'react'
import BoardContext from '../context/board-context'
import database from '../firebase/firebase'

const Card = ({ index, name, isOpen, isMatch, check }) => {

  const { dispatch, openCard, setOpenCard, wait, gameId } = useContext(BoardContext)
  const handleCardClick = () => {
    console.log(wait);
    if(wait || isOpen || isMatch) return
    dispatch({ type:"OPEN", index })
    database.ref(`games/${gameId}/board/${index}`).update({isOpen: true})
    
    if(openCard !== null) check(index)
    else  setOpenCard(index)
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
