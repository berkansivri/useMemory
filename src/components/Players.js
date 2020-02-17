import React, { useEffect, useContext } from 'react'
import GameContext from '../context/game-context'
import { ListGroup, ListGroupItem, Button, Card, Badge } from 'react-bootstrap'
import useInterval from '../hooks/useInterval'

const Players = () => {
  const { dbRef, localPlayer, timer, setTimer, setLocalPlayer, isCreator, turn, setWait, players, setTurn, setShowInviteModal, nextTurn } = useContext(GameContext)
  
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
    else if(timer !== null && players.length > 1) {
      await nextTurn()
    }
  }, 1000)

  const countdown = (player) => {
    if(player.id === turn) {
      return (
        <Badge variant="dark" pill className="float-right" style={{fontSize:"90%"}}>{timer}</Badge>
      )
    }
  }

  const readyState = (p) => {
    if(!turn) {
      return (
        <Badge pill variant={p.isReady ? "primary" : "secondary"} style={{fontSize:"10px"}} className="float-right mt-1">Ready</Badge>
      )
    }
  }

  const ReadyStartButton = () => {
    if(isCreator)
    {
      const everyoneReady = players && players.every((p) => p.isReady)
      return (
        <Button style={{fontSize:"13px"}} variant={everyoneReady ? "success" : "secondary"} size="sm"
          disabled={!!turn}
          onClick={() => {
            if(everyoneReady) {
              dbRef.update({ turn: localPlayer.id })
            }
          }} >Start</Button>
      )
    } else {
      return (
        <Button style={{fontSize:"13px"}} variant={localPlayer.isReady ? "success" : "secondary"} size="sm"
          disabled={!!turn}
          onClick={() => {
            setLocalPlayer({ ...localPlayer, isReady: !localPlayer.isReady })         
          }} >I'm Ready</Button>
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
              {readyState(p)}
              {countdown(p)}
            </ListGroupItem>)
          }
        </ListGroup>
      </Card.Body>
      <Card.Footer className="p-1 text-center">
        <div>
          {ReadyStartButton()}
        </div>
        <div className="mt-1">
          <Button style={{fontSize:"13px"}} size="sm" variant="warning" onClick={() => setShowInviteModal(true)}>Invite Link</Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

export { Players as default }
