import React, { useState } from 'react'
import Modal from 'react-modal'
import database from '../firebase/firebase'

const Invite = ({ match, history }) => {
  const [username, setUsername] = useState("")  
  const [mdlOpen] = useState(true)

  const handleJoin = () => {
    const gameId = match.params.id
    localStorage.setItem("username", username)
    database.ref(`games/${gameId}/users`).push({ username, isOnline: true })
    history.push(`/game/${gameId}`)
  }
  return (
    <div>
      <Modal
          isOpen={mdlOpen}
          ariaHideApp={false}
          closeTimeoutMS={300}
          className="modal"
          shouldCloseOnEsc={true}
        >
          <h3 className="modal__title">Your Name</h3>
          <div className="modal__body">
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleJoin} className="button">Join</button>
          </div>
        </Modal>
    </div>
  )
}

export { Invite as default }