import * as React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  props: any
render() {
  return (
    <div>
      <div>
        <div>Ideenraum & Makerspace Eberswalde</div>
        <Link to="/" className="ml1 no-underline black">
          Home
        </Link>
        <div className="ml1">|</div>
        <Link to="/buttons" className="ml1 no-underline black">
          Buttons
        </Link>
      </div>
    </div>
  )
}
}

export default withRouter(Header)
