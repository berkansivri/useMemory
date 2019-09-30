import { useState, useEffect } from 'react'

const useLocalPlayer = (dbRef) => {
  const [localPlayer, setLocalPlayer] = useState(JSON.parse(localStorage.getItem("player")))

  useEffect(() => {
    dbRef.child("players").once("value", (snapshot) => {
      const val = snapshot.val()
      if(!val || val.length === 0 || Object.keys(val).indexOf(localPlayer.id) === -1) {
        dbRef.child("players").push({ username: localPlayer.username, point: localPlayer.point }).then((snapshot) => {
          setLocalPlayer({ id: snapshot.key, username: localPlayer.username, point: localPlayer.point })
        })
      }
    })

    dbRef.child(`players/${localPlayer.id}`).onDisconnect().remove()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(localPlayer))
    dbRef.child(`players/${localPlayer.id}`).update({ ...localPlayer })
    //eslint-disable-next-line
  }, [localPlayer])

  return { localPlayer, setLocalPlayer }
}

export { useLocalPlayer as default }
