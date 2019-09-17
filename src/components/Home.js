import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import database from '../firebase/firebase'
import getFrameworks from '../selectors/framework'

const Home = ({ history }) => {
  const [mdlOpen, setMdlOpen] = useState(false)
  const [username, setUsername] = useState("")
  
  const handleOnMultiplayerGame = () => {
    database.ref("games").push().then((ref) => {
      const board = getFrameworks(12)
      database.ref(`games/${ref.key}`).update({ board })
      database.ref(`games/${ref.key}/players`).push({ username, isOnline: true, point: 0 }).then((playerRef) => {
        localStorage.setItem("player", JSON.stringify({ id:playerRef.key, username, point: 0 }))
        database.ref(`games/${ref.key}`).update({ turn: playerRef.key }).then(() => {
          history.push(`/game/${ref.key}`)
        })
      })
    })
  }
  
  return (
    <div>
      <div>
        <Link to="/game">Single Player</Link>
      </div>
      <div>
        <button onClick={() => setMdlOpen(true) }>Multi Player</button>
        <Modal
          isOpen={mdlOpen}
          ariaHideApp={false}
          closeTimeoutMS={300}
          className="rmodal"
          shouldCloseOnEsc={true}
        >
          <h3 className="rmodal__title">Your Name</h3>
          <div className="rmodal__body">
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleOnMultiplayerGame} className="button">Okay</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export { Home as default }
