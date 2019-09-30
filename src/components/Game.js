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
import getFrameworks from '../selectors/framework'

const Game = ({ match, history }) => {
  
  const gameId = match.params.id
  const isCreator = !!history.location.state
  const dbRef = database.ref(`games/${gameId}`)
  const [turn, setTurn] = useState("")
  const [wait, setWait] = useState(true)
  const [openCard, setOpenCard] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(true)
  const [canUpdateTurn, setCanUpdateTurn] = useState(false)
  
  const [frameworks, fwDispatch] = useReducer(frameworkReducer, [])
  const { players } = usePlayers(dbRef)
  const { localPlayer, setLocalPlayer } = useLocalPlayer(dbRef)
  const [timer, setTimer] = useState(null)
  const audio = new Audio()

  useEffect(() => {
    if(!localPlayer && localPlayer.game !== gameId) history.push(`/${gameId}`)

    dbRef.child("board").once("value", (snapshot) => {
      fwDispatch({ type: "POPULATE", board: snapshot.val() })
    })

    dbRef.child("winner").on("child_added", (snapshot) => {
      audio.src = process.env.PUBLIC_URL + "/winner.flac"
      audio.play()
      const winner = snapshot.val()
      setTimeout(() => {
        const startNew = window.confirm(`Winner: ${winner.username}! Would you like to start a new game?`)
        if(startNew) {
          snapshot.ref.remove()
          dbRef.child("type").once("value", (snapshot) => {
            setLocalPlayer({ ...localPlayer, point: 0 })
            const board = getFrameworks(snapshot.val())
            nextTurn()
            fwDispatch({ type:"POPULATE", board })
          })
        } else {
          dbRef.off()
          window.location.href = "/"
        }
      },200)
    })
    //eslint-disable-next-line
  }, [])
  
  useEffect(() => {
    const opens = frameworks.reduce((m,e,i) => (e.isOpen === true && e.isMatch === false && m.push(i), m), [])
    if(opens.length) fwDispatch({ type:"CLOSE", index: opens[0], open: opens[1] })
    //eslint-disable-next-line
  }, [turn])

  const nextTurn = () => {
    if(players.length > 1) {
      let nextTurnIndex = (players.findIndex((user) => user.id === turn) + 1) % players.length
      return dbRef.update({ turn: players[nextTurnIndex].id })
    }
  }

  if(frameworks) {
    return (
      <GameContext.Provider value={{ dbRef, audio, timer, isCreator, canUpdateTurn, setCanUpdateTurn, openCard, setOpenCard, setTimer, frameworks, fwDispatch, gameId, turn, setTurn, localPlayer, setLocalPlayer, wait, setWait, nextTurn, players, showInviteModal, setShowInviteModal}}>
        <Container fluid>
          <Row className="justify-content-around">
            {isCreator && <InviteModal />}
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
