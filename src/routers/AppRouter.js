import React from 'react'
import Home from '../components/Home'
import Game from '../components/Game'
import Invite from '../components/Invite'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const AppRouter = () => (
  <Router>
     <Route path="/" exact component={Home} />
     <Route path="/game/:id?" component={Game} />
     <Route path="/invite/:id?" component={Invite} />
  </Router>
)

export default AppRouter
