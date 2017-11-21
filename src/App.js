import React, { Component } from 'react'
import './App.css'
import ScrollLoadResource from './ScrollLoadResource'
import ColorPicker from './ColorPicker'
class App extends Component {
  render () {
    return (
      <div className="container">
        <ColorPicker />
      </div>
    )
  }
}

export default App;
