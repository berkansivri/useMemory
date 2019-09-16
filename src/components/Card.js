import React, { useContext } from 'react'
import BoardContext from '../context/board-context'

const Card = ({ index, name, isOpen, isMatch }) => {

  const { frameworks, dispatch, wait, setWait } = useContext(BoardContext)
  const handleCardClick = () => {
    if(wait || isOpen || isMatch) return
    
    const openCard = frameworks.findIndex(x=> x.isOpen === true && x.isMatch === false)
    dispatch({ type:"OPEN", index })
    if(openCard > -1) {
      setWait(true)

      setTimeout(() => {
        dispatch({ type:"CHECK", index, open: openCard })
        setWait(false)
      }, 600)
    }
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
