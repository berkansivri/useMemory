import React, { useState, useEffect, useContext } from 'react'
import GameContext from '../context/game-context'
import { ListGroup, ListGroupItem, Button, Card, Badge } from 'react-bootstrap'
import useInterval from '../hooks/useInterval'

const Players = () => {
  const { dbRef, localPlayer, dispatch, turn, setWait, setPlayers, players, setTurn, wait, setShowInviteModal, nextTurn, frameworks } = useContext(GameContext)
  const [timer, setTimer] = useState(10)
  
  useEffect(() => {
    let tempTurn = null
    dbRef.child("turn").on("value", (snapshot) => {
      const turnId = snapshot.val()
      tempTurn = turnId

      setTimer(10)
      setTurn(turnId)
      if(turnId === localPlayer.id) setWait(false)
      else setWait(true)
    })

    dbRef.child("players").on("value", (snapshot) => {
      const val = snapshot.val()
      // eslint-disable-next-line
      const users = Object.entries(val).reduce((a,u) => (u[1].isOnline && a.push({ id: u[0], ...u[1] }), a ), [])
      setPlayers(users)
      if(wait) setTimer(10)
      if(users.findIndex(u => u.id === tempTurn) === -1) {
        let turnIndex = (Object.keys(val).indexOf(tempTurn) + 1) % users.length
        dbRef.update({ turn: users[turnIndex].id })
      }
    })
    
    dbRef.child(`players/${localPlayer.id}`).update({ isOnline: true })
    dbRef.child(`players/${localPlayer.id}`).onDisconnect().update({ isOnline: false })
    // eslint-disable-next-line
  }, [])
  
  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(localPlayer))
  }, [localPlayer])


  useInterval(async () => {
    console.log("use interval timer:", timer);
    if(timer > 1) setTimer(timer - 1)
    else if(!wait && players.length > 1) {
      await nextTurn()
    }
  }, 1000)

  useEffect(() => {
    console.log(timer);
    // eslint-disable-next-line
    const opens = frameworks.reduce((m,e,i) => (e.isOpen === true && e.isMatch === false && m.push(i), m), [])
    if(opens.length) dispatch({ type:"CLOSE", index: opens[0], open: opens[1] })
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
          {players.map(p =>
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
