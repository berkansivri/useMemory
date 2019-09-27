import React, { useState, useReducer, useEffect } from 'react'
import Board from './Board'
import GameContext from '../context/game-context'
import Players from './Players'
import database from '../firebase/firebase'
import { Row, Col, Container } from 'react-bootstrap'
import InviteModal from './InviteModal'
import frameworkReducer from '../reducers/framework'
import usePlayers from '../hooks/usePlayers'
import useLocalPlayer from '../hooks/useLocalPlayer'
import NotFound from './NotFound'

const Game = ({ match, history }) => {
  
  const gameId = match.params.id
  const dbRef = database.ref(`games/${gameId}`)
  const [turn, setTurn] = useState("")
  const [wait, setWait] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(true)
  
  const [frameworks, fwDispatch] = useReducer(frameworkReducer, [])
  const { players } = usePlayers(dbRef)
  const { localPlayer, setLocalPlayer } = useLocalPlayer(dbRef)
  const [timer, setTimer] = useState(10)

  useEffect(() => {
    if(!localPlayer && localPlayer.game !== gameId) history.push(`/${gameId}`)
    //eslint-disable-next-line
  }, [])

  const nextTurn = () => {
    if(players.length > 1) {
      let nextTurnIndex = (players.findIndex((user) => user.id === turn) + 1) % players.length
      return dbRef.update({ turn: players[nextTurnIndex].id })
    }
  }

  if(frameworks) {
    return (
      <GameContext.Provider value={{ dbRef, timer, setTimer, frameworks, fwDispatch, gameId, turn, setTurn, localPlayer, setLocalPlayer, wait, setWait, nextTurn, players, showInviteModal, setShowInviteModal}}>
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
  } else {
    return (
      <NotFound />
    )
  }
}

export { Game as default }
