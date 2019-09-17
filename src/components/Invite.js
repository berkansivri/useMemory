import React, { useState } from 'react'
import Modal from 'react-modal'
import database from '../firebase/firebase'

const Invite = ({ match, history }) => {
  const [username, setUsername] = useState("")  
  const [mdlOpen] = useState(true)

  const handleJoin = () => {
    const gameId = match.params.id
    database.ref(`games/${gameId}/players`).push({ username, isOnline: true, point: 0 }).then((ref) => {
      localStorage.setItem("player", JSON.stringify({ id:ref.key, username, point: 0 }))
      history.push(`/game/${gameId}`)
    })
  }
  return (
    <div>
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
            <button onClick={handleJoin} className="button">Join</button>
          </div>
        </Modal>
    </div>
  )
}

export { Invite as default }
