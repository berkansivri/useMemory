import React, { useState, useEffect, useContext } from 'react'
import database from '../firebase/firebase'
import GameContext from '../context/game-context'
import { ListGroup, ListGroupItem, Button, Card, Badge } from 'react-bootstrap'
import useInterval from '../hooks/useInterval'

const Players = () => {
  const { localPlayer, dispatch, turn, gameId, setWait, setPlayers, players, setTurn, wait, setShowInviteModal, nextTurn, frameworks } = useContext(GameContext)
  const [timer, setTimer] = useState(15)
  
  useEffect(() => {
    let tempTurn = null
    database.ref(`games/${gameId}/turn`).on("value", (snapshot) => {
      const turnId = snapshot.val()
      setTurn(turnId)
      tempTurn = turnId
      setTimer(10)
      if(turnId === localPlayer.id) setWait(false)
      else setWait(true)
    })

    database.ref(`games/${gameId}/players`).on("value", (snapshot) => {
      const val = snapshot.val()
      const users = Object.entries(val).map(x=> ({ id: x[0], ...x[1] }))
      setPlayers(users)
      console.log(tempTurn);
      if(users.find(u => u.id === tempTurn).isOnline === false) {
        nextTurn(users)
      }
    })
    
    database.ref(`games/${gameId}/players/${localPlayer.id}`).update({ isOnline: true })
    database.ref(`games/${gameId}/players/${localPlayer.id}`).onDisconnect().update({ isOnline: false })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(localPlayer))
  }, [localPlayer])


  useInterval(async () => {
    if(timer > 0) setTimer(timer - 1)
    else if(!wait && players.length > 1) {
      await nextTurn()
    }
  }, 1000)

  useEffect(() => {
    // eslint-disable-next-line
    const opens = frameworks.reduce((m,e,i) => (e.isOpen === true && e.isMatch === false && m.push(i), m), [])
    dispatch({ type:"CLOSE", index: opens[0], open: opens[1] })
    // eslint-disable-next-line
  }, [turn])
  
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
              <Badge variant="success" pill className="float-left" style={{fontSize:"90%"}}>{p.point}</Badge>
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
