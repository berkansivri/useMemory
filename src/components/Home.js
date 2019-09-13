import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import database from '../firebase/firebase'
import getFrameworks from '../selectors/framework'

const Home = ({ history }) => {
  const [mdlOpen, setMdlOpen] = useState(false)
  const [name, setName] = useState("")
  
  const handleOnMultiplayerGame = () => {
    database.ref("games").push({ player1:name, turn: name }).then((ref) => {
      localStorage.setItem("name", name)
      const frameworkNames = getFrameworks(12)
      const board = frameworkNames.map((name, index) => ({ name, index, isOpen: false, isMatch: false }))
      database.ref(`games/${ref.key}`).update({ board })
      history.push(`/game/${ref.key}`)
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
          className="modal"
          shouldCloseOnEsc={true}
        >
          <h3 className="modal__title">Your Name</h3>
          <div className="modal__body">
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleOnMultiplayerGame} className="button">Okay</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export { Home as default }
