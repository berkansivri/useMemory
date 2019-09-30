import React, { useEffect, useContext } from 'react'
import Card from './Card'
import GameContext from '../context/game-context'

const Board = () => {
  const { setWait, audio, turn, nextTurn, canUpdateTurn, setCanUpdateTurn, openCard, setOpenCard, players, localPlayer, setLocalPlayer, frameworks, fwDispatch, dbRef } = useContext(GameContext)

  useEffect(() => {
    if(turn !== localPlayer.id) {
      dbRef.child("board").on("value", (snapshot) => {
        const board = snapshot.val()
        fwDispatch({ type: "POPULATE", board })
      })
    } else {
      dbRef.child("board").off()
    }
    // eslint-disable-next-line
  }, [turn])
  
  useEffect(() => {
    async function updateFrameworks() {
      if(turn === localPlayer.id && frameworks.length > 0) {
        await dbRef.update({ board: frameworks })
        if(canUpdateTurn){
          await nextTurn()
          setCanUpdateTurn(false)
        }
        handleCheckWinner()
      }
    }
    updateFrameworks()
    // eslint-disable-next-line
  }, [frameworks])

  const handleCardClick = async (index) => {
    audio.src = process.env.PUBLIC_URL + "/open.wav"
    audio.play()
    fwDispatch({ type:"OPEN", index })
    if(openCard !== null)  {
      setWait(true)
      setTimeout(async () => await handleCheckMatch(index, openCard), 600)
    } else {
      setOpenCard(index)
    }
  }
  
  const handleCheckMatch = async (index, open) => {
    setOpenCard(null)
    if(frameworks[index].name === frameworks[open].name) {
      audio.src = process.env.PUBLIC_URL + "/match.mp3"
      audio.play()
      fwDispatch({ type:"MATCH", index, open })
      setLocalPlayer({ ...localPlayer, point: ++localPlayer.point })
      setWait(false)
    } else {
      if(players.length === 1) setWait(false)
      else setCanUpdateTurn(true)
      fwDispatch({ type:"CLOSE", index, open })
    }
  }

  const handleCheckWinner = () => {
    if(frameworks.every(x => x.isMatch === true) && players.length > 0) {
      const winner = players.reduce((prev,curr) => (prev.point > curr.point) ? prev : curr)
      dbRef.child("winner").push({ ...winner })
    }
  }

  return (
    <div className="board">
      {frameworks.map((framework, index) => {
        return (
          <Card key={index} index={index} {...framework} cardClick={() => handleCardClick(index)} />
        )
      })}
    </div>
  )
}

export { Board as default }
