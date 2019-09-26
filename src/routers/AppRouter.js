import React from 'react'
import Home from '../components/Home'
import Game from '../components/Game'
import NotFound from '../components/NotFound'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/:id?" exact component={Home} />
        <Route path="/game/:id" component={Game} />
        <Route component={NotFound}/>
      </Switch>
    </div>
  </Router>
)

export default AppRouter
