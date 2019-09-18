import React, { useState, useEffect, useContext } from 'react'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap'

const Players = () => {
  const { localPlayer, turn, gameId, setWait, setPlayers, players, setTurn, wait, setShowInviteModal, nextTurn } = useContext(GameContext)
  const [timer, setTimer] = useState(15)
  
  useEffect(() => {
    database.ref(`games/${gameId}/players`).on("value", (snapshot) => {
      const users = Object.entries(snapshot.val()).map(x=> ({ id: x[0], ...x[1] }))
      setPlayers(users)
    })

    database.ref(`games/${gameId}/turn`).on("value", (snapshot) => {
      const turnId = snapshot.val()
      setTurn(turnId)
      setTimer(15)
      if(turnId === localPlayer.id) setWait(false)
      else setWait(true)
    })

    database.ref(`games/${gameId}/players/${localPlayer.id}`).onDisconnect().update({ isOnline: false })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let interval = null
    if(timer > 0){
      interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
    } else if(!wait){
      clearInterval(interval)
      nextTurn()
    }
    return () => clearInterval(interval);
  }, [wait, timer, nextTurn])

  return (
    <div>
      <p>Players</p>
      <ListGroup>
        {players.length > 0 && players.filter(x=> x.isOnline).map(p => 
          <ListGroupItem className={ "py-1" + (p.id === turn ? " active" : "")} key={p.id}>{p.username} 
          {p.id === turn ? ` (${timer})` : ''}</ListGroupItem>)
        }
      </ListGroup>
      <span>
        <Button style={{marginTop: "30px"}} size="sm" variant="info" onClick={() => setShowInviteModal(true)}>Show Invite Link</Button>
      </span>
    </div>
  )
}

export { Players as default }
