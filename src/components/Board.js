import React, {  useEffect, useContext } from 'react'
import Card from './Card'
import GameContext from '../context/game-context'
import getFrameworks from '../selectors/framework'

const Board = () => {
  const { wait, nextTurn, players, localPlayer, updateLocalPlayer, frameworks, dispatch, dbRef } = useContext(GameContext)
  const audio = new Audio()
  
  useEffect(() => {
    if(wait) {
      dbRef.child("board").on("value", (snapshot) => {
        const board = snapshot.val()
        dispatch({ type: "POPULATE", board })
      })
    } else {
      dbRef.child("board").off()
    }
    // eslint-disable-next-line
  }, [wait])
  
  useEffect(() => {
    dbRef.child("board").once("value", (snapshot) => {
      dispatch({ type: "POPULATE", board: snapshot.val() })
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    async function updateFrameworks() {
      if(!wait && frameworks.length > 0) {
        await dbRef.update({ board: frameworks })
        handleCheckWinner()
      }
    }
    updateFrameworks()
    // eslint-disable-next-line
  }, [frameworks])

  const handleCardClick = async (index) => {
    //eslint-disable-next-line
    const opens = frameworks.reduce((m,e,i) => (e.isOpen === true && e.isMatch === false && m.push(i), m), [])
    if(opens.length === 2) return

    audio.src = process.env.PUBLIC_URL + "/open.wav"
    audio.play()
    dispatch({ type:"OPEN", index })
    if(opens.length === 1)  {
      setTimeout(async () => await handleCheckMatch(index, opens[0]), 600)
    }
  }
  
  const handleCheckMatch = async (index, open) => {
    if(frameworks[index].name === frameworks[open].name) {
      audio.src = process.env.PUBLIC_URL + "/match.mp3"
      audio.play()
      dispatch({ type:"MATCH", index, open })
      updateLocalPlayer({ point: ++localPlayer.point })
    } else {
      await nextTurn()
    }
  }

  const handleCheckWinner = () => {
    if(frameworks.every(x => x.isMatch === true)) {
      audio.src = process.env.PUBLIC_URL + "/winner.flac"
      audio.play()
      const winner = players.reduce((prev,curr) => (prev.point > curr.point) ? prev : curr)
      const startNew = window.confirm(`Winner: ${winner.username}! Would you like to start a new game?`)
      if(startNew) {
        const board = getFrameworks(frameworks.length/2)
        dispatch({ type:"POPULATE", board })
      }
    }
  }

  return (
    <div className="board">
      {frameworks.length && frameworks.map((framework, index) => {
        return (
          <Card key={index} index={index} {...framework} cardClick={() => handleCardClick(index)} />
        )
      })}
    </div>
  )
}

export { Board as default }
