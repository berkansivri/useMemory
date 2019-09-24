import React, {  useEffect, useContext } from 'react'
import Card from './Card'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'
import getFrameworks from '../selectors/framework'

const Board = () => {
  const { setWait, nextTurn, gameId, players, localPlayer, updateLocalPlayer, frameworks, dispatch } = useContext(GameContext)
  const audio = new Audio()
  
  useEffect(() => {
    database.ref(`games/${gameId}/board`).on("value", (snapshot) => {
      dispatch({ type: "POPULATE", board: snapshot.val() })
      console.log(snapshot.val().filter(x=> x.isOpen === true && x.isMatch === false).map(x=> x.name))
    })
  }, [gameId, dispatch])

  // useEffect(() => {
  //   async function updateFrameworks() {
  //     if(frameworks.length > 0) {
  //       console.log(frameworks.filter(x=> x.isOpen === true && x.isMatch === false).map(x=> x.name))
  //       await database.ref(`games/${gameId}`).update({ board: frameworks })
  //       handleCheckWinner()
  //     }
  //   }
  //   updateFrameworks()
  //   // eslint-disable-next-line
  // }, [frameworks, gameId])

  const handleCardClick = async (index) => {
    const open = frameworks.findIndex(x=> x.isOpen === true && x.isMatch === false)
    audio.src = process.env.PUBLIC_URL + "/open.wav"
    audio.play()
    dispatch({ type:"OPEN", index })
    await database.ref(`games/${gameId}`).update({ board: frameworks })
    if(open !== -1)  {
      setWait(true)
      await handleCheckMatch(index, open)
    }
  }
  
  const handleCheckMatch = async (index, open) => {
    return new Promise(async (resolve,reject) => {
      if(frameworks[index].name === frameworks[open].name) {
        audio.src = process.env.PUBLIC_URL + "/match.mp3"
        audio.play()
        dispatch({ type:"MATCH", index, open })
        updateLocalPlayer({ point: ++localPlayer.point })
        await database.ref(`games/${gameId}`).update({ board: frameworks })
        setWait(false)
        resolve()
      } else {
        dispatch({ type:"CLOSE", index, open })
        await database.ref(`games/${gameId}`).update({ board: frameworks })
        if(players.length > 1) await nextTurn();
        else setWait(false)
        resolve()
      }
      if(frameworks.filter(x => x.Match === true).length === frameworks.length){
        handleCheckWinner()
      }
    })
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
