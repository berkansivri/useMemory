import React, { useState, useEffect } from 'react'
import Board from './Board'
import GameContext from '../context/game-context'
import Players from './Players'
import database from '../firebase/firebase'
import { Row, Col, Container } from 'react-bootstrap'
import InviteModal from './InviteModal'

const Game = ({ match, history }) => {
  
  const gameId = match.params.id
  const [turn, setTurn] = useState("")
  const [wait, setWait] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(true)
  const [players, setPlayers] = useState([])
  const [localPlayer, setLocalPlayer] = useState(JSON.parse(localStorage.getItem("player")))

  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(localPlayer))
    database.ref(`games/${gameId}/players/${localPlayer.id}`).update({ isOnline: true })
  }, [localPlayer, gameId])

  const nextTurn = () => {
    const nextTurnIndex = (players.findIndex((user) => user.id === localPlayer.id) + 1) % players.length
    database.ref(`games/${gameId}`).update({ turn: players[nextTurnIndex].id })
  }

  return (
    <GameContext.Provider value={{gameId, turn, setTurn, localPlayer, wait, setWait, setPlayers, nextTurn, players, setLocalPlayer, showInviteModal, setShowInviteModal}}>
      <Container fluid>
        <Row className="justify-content-around">
          {history.location.state && <InviteModal />}
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
