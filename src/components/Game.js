import React, { useState, useReducer } from 'react'
import Board from './Board'
import GameContext from '../context/game-context'
import Players from './Players'
import database from '../firebase/firebase'
import { Row, Col, Container } from 'react-bootstrap'
import InviteModal from './InviteModal'
import frameworkReducer from '../reducers/framework'
import playerReducer from '../reducers/player'

const Game = ({ match, history }) => {
  
  const gameId = match.params.id
  const [turn, setTurn] = useState("")
  const [wait, setWait] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(true)
  const [players, pDispatch] = useReducer(playerReducer, [])
  const [localPlayer, setLocalPlayer] = useState(JSON.parse(localStorage.getItem("player")))
  const [frameworks, fwDispatch] = useReducer(frameworkReducer, [])
  const dbRef = database.ref(`games/${gameId}`)
  
  const updateLocalPlayer = (props) => {
    dbRef.child(`players/${localPlayer.id}`).update({ ...props }).then(() => {
      setLocalPlayer({ ...localPlayer })
    })
  }

  const nextTurn = () => {
    if(players.length > 1) {
      let nextTurnIndex = (players.findIndex((user) => user.id === turn) + 1) % players.length
      return dbRef.update({ turn: players[nextTurnIndex].id })
    }
  }

  return (
    <GameContext.Provider value={{ dbRef, frameworks, fwDispatch, gameId, turn, setTurn, localPlayer, wait, setWait, pDispatch, nextTurn, players, updateLocalPlayer, showInviteModal, setShowInviteModal}}>
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
