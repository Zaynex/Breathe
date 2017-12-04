import React, { PureComponent } from 'react'
import './App.css'
import RouterConfig from './Config/router'
class App extends PureComponent {
  render () {
    return (
      <div className="container">
        <h1>React Demos</h1>
        <RouterConfig />
      </div>
    )
  }
}

export default App;
