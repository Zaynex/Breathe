import React, { Component } from 'react'
import './App.css'
import ScrollLoadResource from './ScrollLoadResource'
import ColorPicker from './ColorPicker'
import { EventHandle } from './Components'
class App extends Component {
  render () {
    return (
      <div className="container">
        <ColorPicker />
        <EventHandle />
      </div>
    )
  }
}

export default App;
