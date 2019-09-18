import React, { useState, useEffect, useRef } from 'react'
import Board from './Board'
import GameContext from '../context/game-context'
import Players from './Players'
import database from '../firebase/firebase'
import { Modal, Button, Form, InputGroup, Overlay, Tooltip, Row, Col, Container } from 'react-bootstrap'

const Game = ({ match, history }) => {
  const gameId = match.params.id
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)
  const [turn, setTurn] = useState("")
  const [wait, setWait] = useState(false)
  const [players, setPlayers] = useState([])
  const target = useRef(null)
  const [localPlayer, setLocalPlayer] = useState(JSON.parse(localStorage.getItem("player")))

  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(localPlayer))
    database.ref(`games/${gameId}/players/${localPlayer.id}`).update({ isOnline: true })
  }, [localPlayer, gameId])

  useEffect(() => {
    if(history.location.state){ 
      setShowInviteModal(true)
    }
  }, [history])

  const nextTurn = () => {
    const nextTurnIndex = (players.findIndex((user) => user.id === localPlayer.id) + 1) % players.length
    database.ref(`games/${gameId}`).update({ turn: players[nextTurnIndex].id })
  }

  return (
    <GameContext.Provider value={{gameId, turn, setTurn, localPlayer, wait, setWait, setPlayers, nextTurn, players, setLocalPlayer, setShowInviteModal}}>
      <Container fluid>
        <Row className="justify-content-around">
          {
            <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>This is your invite link</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <InputGroup>
              <Form.Control ref={target} type="text" value={window.location.host + "/" + gameId} disabled />
              <Overlay target={target.current} show={showCopyTooltip} placement="top">
                {props => (
                  <Tooltip id="overlay-example" {...props}>
                    Copied!
                  </Tooltip>
                )}
              </Overlay>
              <InputGroup.Append  onClick={() => {
                navigator.clipboard.writeText(window.location.host + "/" + gameId)
                setShowCopyTooltip(true)
              }}>
                <InputGroup style={{cursor:"pointer"}} className="btn btn-primary" id="inputGroupPrepend">Copy</InputGroup>
              </InputGroup.Append>
            </InputGroup>
            </Modal.Body>

            <Modal.Footer>
              <div>Share this link to invite your opponents to game</div>
              <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Ok</Button>
            </Modal.Footer>
          </Modal>
          }
          <Col xs={3} sm={3} md={2} xl={2} className="my-0 px-0 py-0">
            <Players />
          </Col>
          <Col xs={9} sm={9} md={10} xl={9} className="pl-2 pr-0">
            <Board />
          </Col>
        </Row>
      </Container>
    </GameContext.Provider>
  )
}

export { Game as default }
