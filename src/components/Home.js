import React, { useState, useEffect } from 'react'
import database from '../firebase/firebase'
import getFrameworks from '../selectors/framework'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import NotFound from './NotFound'

const Home = ({ match, history }) => {
  const [username, setUsername] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const gameId = match.params.id

  useEffect(() => {
    if(gameId) {
      database.ref(`games`).child(gameId).once("value", (snapshot) => {
        if(!snapshot.val()) {
          history.push("404")
        }
      })
    }
  //eslint-disable-next-line
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(username.length === 0) return
    
    let boxCount = 12
    if(!match.params.id) {
      database.ref("games").push().then((ref) => {
        switch (difficulty) {
          case "easy": boxCount = 12
            break;
          case "medium": boxCount = 18
            break;
          case "hard": boxCount = 35
            break;
          default:
            break;
        }
        const board = getFrameworks(boxCount)
        database.ref(`games/${ref.key}`).update({ board, type: boxCount, winner: null })
        database.ref(`games/${ref.key}/players`).push({ username, point: 0, isReady: false }).then((playerRef) => {
          localStorage.setItem("player", JSON.stringify({ game: ref.key, id:playerRef.key, username, point: 0, isReady: true }))
            history.push(`/game/${ref.key}`, "owner")
        })
      })
    } else {
      database.ref(`games/${gameId}/players`).push({ username, point: 0, isReady: false }).then((ref) => {
        localStorage.setItem("player", JSON.stringify({ game: ref.key, id:ref.key, username, point: 0, isReady: false }))
        history.push(`/game/${gameId}`)
      })
    }
  }

  const selectDifficulty = () => {
    if(!match.params.id){
      return (
        <Form.Group as={Row} className="mt-3 mb-0">
          {['easy', 'medium', 'hard'].map((type,index) => (
            <Col sm={4} md={4} key={index}>
              <Form.Check
                type="radio"
                label={type}
                name="formHorizontalRadios"
                id="formHorizontalRadios1"
                onClick={() => setDifficulty(type)}
              />
            </Col>
          ))}
      </Form.Group>
      )
    }
  }
  if(match.url !== "/404") {
    return (
      <Modal.Dialog>
        <Modal.Header className="justify-content-center">
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Control type="text" placeholder="Name" onChange={(e) => setUsername(e.target.value.substring(0,10))}></Form.Control>
            {selectDifficulty()}
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="justify-content-center">
          <Button type="submit" variant="primary" onClick={handleSubmit}>{match.params.id ? "Join Game" : "Create Board"}</Button>
        </Modal.Footer>
      </Modal.Dialog>
    )
  } else {
    return (
      <NotFound />
    )
  }
}

export { Home as default }
