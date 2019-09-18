import React, { useState, useEffect, useContext } from 'react'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'
import { ListGroup, ListGroupItem, Button, Card, Badge } from 'react-bootstrap'

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

  const countdown = (player) => {
    if(player.id === turn) {
      return (
        <Badge variant="dark" pill className="float-right" style={{fontSize:"90%"}}>{timer}</Badge>
      )
    }
  }

  return (
    <Card border="info">
      <Card.Header className="p-2">Players</Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {players.length > 0 && players.filter(x=> x.isOnline).map(p => 
            <ListGroupItem variant="dark" style={{fontSize:"13px"}} className={"d-inline px-1 py-1" + (p.id === turn ? " active" : "")} key={p.id}>
              {p.username} 
              {countdown(p)}
            </ListGroupItem>)
          }
        </ListGroup>
      </Card.Body>
      <Card.Footer className="p-1 text-center">
          <Button style={{fontSize:"13px"}} className="p-1" size="sm" variant="warning" onClick={() => setShowInviteModal(true)}>Invite Link</Button>
      </Card.Footer>
    </Card>
  )
}

export { Players as default }
