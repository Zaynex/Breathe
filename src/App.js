import React, { Component, PureComponent } from 'react'
import './App.css'
import RouterConfig from './Config/router'
class App extends Component {
  render () {
    return (
      <div className="container">
        <h1>React Demos that I code from work</h1>
        <RouterConfig />
      </div>
    )
  }
}

export default App;
