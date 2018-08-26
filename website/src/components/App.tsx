import * as React from 'react'
import { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'
import Buttons from './Buttons'
import Home from './Home'
import { Switch, Route, Redirect } from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="center w85">
                    <Header />
                    <div className="ph3 pv1 background-gray">
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to="/home" />} />
                            <Route exact path="/buttons" component={Buttons} />
                            <Route exact path="/home" component={Home} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default App
