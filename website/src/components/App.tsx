import * as React from 'react'
import { Component } from 'react'
import Header from './Header'
import { Switch, Route, Redirect } from 'react-router-dom'
import LernortList from './LernortList'
import CreateLernort from './CreateLernort'
import Login from './Login'
import Search from './Search'

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/new/1" />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/create" component={CreateLernort} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/top" component={LernortList} />
            <Route exact path="/new/:page" component={LernortList} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
