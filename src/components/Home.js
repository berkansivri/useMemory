import React, { useState } from 'react'
import database from '../firebase/firebase'
import getFrameworks from '../selectors/framework'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'

const Home = ({ match, history }) => {
  const [username, setUsername] = useState("")
  const [difficulty, setDifficulty] = useState("")
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(username.length === 0) return
    
    let boxCount = 2
    if(!match.params.id) {
      database.ref("games").push().then((ref) => {
        switch (difficulty) {
          case "easy": boxCount = 2
            break;
          case "medium": boxCount = 21
            break;
          case "hard": boxCount = 35
            break;
          default:
            break;
        }
        const board = getFrameworks(boxCount)
        database.ref(`games/${ref.key}`).update({ board, type: difficulty })
        database.ref(`games/${ref.key}/players`).push({ username, isOnline: true, point: 0 }).then((playerRef) => {
          localStorage.setItem("player", JSON.stringify({ id:playerRef.key, username, point: 0 }))
          database.ref(`games/${ref.key}`).update({ turn: playerRef.key }).then(() => {
            history.push(`/game/${ref.key}`, "owner")
          })
        })
      })
    } else {
      const gameId = match.params.id
      database.ref(`games/${gameId}/players`).push({ username, isOnline: true, point: 0 }).then((ref) => {
        localStorage.setItem("player", JSON.stringify({ id:ref.key, username, point: 0 }))
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

  return (
    <Modal.Dialog>
      <Modal.Header className="justify-content-center">
        <Modal.Title>Enter your name</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Control type="text" placeholder="Name" onChange={(e) => setUsername(e.target.value)}></Form.Control>
          {selectDifficulty()}
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="justify-content-center">
        <Button type="submit" variant="primary" onClick={handleSubmit}>{match.params.id ? "Join Game" : "Create Board"}</Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}

export { Home as default }
