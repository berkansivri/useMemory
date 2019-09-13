import React from 'react'
import Home from '../components/Home'
import Board from '../components/Board'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const AppRouter = () => (
  <Router>
     <Route path="/" exact component={Home} />
     <Route path="/game/:id?" component={Board} />
  </Router>
)

export default AppRouter
