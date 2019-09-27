import React, { useEffect, useContext } from 'react'
import GameContext from '../context/game-context'
import { ListGroup, ListGroupItem, Button, Card, Badge } from 'react-bootstrap'
import useInterval from '../hooks/useInterval'

const Players = () => {
  const { dbRef, localPlayer, timer, setTimer, fwDispatch, turn, setWait, players, setTurn, wait, setShowInviteModal, nextTurn, frameworks } = useContext(GameContext)
  
  useEffect(() => {
    dbRef.child("turn").on("value", (snapshot) => {
      const turnId = snapshot.val()
      if(turnId) {
        setTimer(10)
        setTurn(turnId)
        if(turnId === localPlayer.id) setWait(false)
        else setWait(true)
      }
    })
 
    // eslint-disable-next-line
  }, [])

  useInterval(async () => {
    if(timer > 1) setTimer(timer - 1)
    else if(!wait && players.length > 1) {
      await nextTurn()
    }
  }, 1000)

  useEffect(() => {
    // eslint-disable-next-line
    const opens = frameworks.reduce((m,e,i) => (e.isOpen === true && e.isMatch === false && m.push(i), m), [])
    if(opens.length) fwDispatch({ type:"CLOSE", index: opens[0], open: opens[1] })
    // eslint-disable-next-line
  }, [turn])
  
  const handleStartGame = () => {
    dbRef.update({ turn: localPlayer.id })
  }

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
          {players && players.map(p =>
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
          <Button style={{fontSize:"13px"}} variant="success" size="sm" className="p-1 ml-2" 
          disabled={!!turn}
          onClick={() => { handleStartGame() }} >Start</Button>
      </Card.Footer>
    </Card>
  )
}

export { Players as default }
