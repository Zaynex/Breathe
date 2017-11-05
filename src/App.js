import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ScrollLoadResource from './ScrollLoadResource'

class App extends Component {
  render () {
    return (
      <div className="container">
        <ScrollLoadResource />
      </div>
    )
  }
}

export default App;
