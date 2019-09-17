import React from 'react'
import Home from '../components/Home'
import Game from '../components/Game'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const AppRouter = () => (
  <Router>
     <Route path="/:id?" exact component={Home} />
     <Route path="/game/:id" component={Game} />
  </Router>
)

export default AppRouter
