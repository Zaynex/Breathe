import React, { PureComponent } from 'react'
import './index.css'
export class Animation extends PureComponent {
  state = { show: false }
  handleToggle = () => {
    this.setState((prevState) => ({
      show: !prevState.show
    }))
  }
  render () {
    const { show } = this.state
    return <div>
      <button onClick={this.handleToggle}>Toggle</button>
      {<Message show={show} />}
    </div>
  }
}

class Message extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      animate: false,
      show: false
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.show === false) return this.unMountShow()
    if (nextProps.show === true) {
      this.setState({
        show: true
      })
      setTimeout(() => {
        this.setState({ animate: true })
      }, 20)
    }
  }

  unMountShow = () => {
    this.setState({
      animate: false
    })
  }

  handleEnd = () => {
    if (!this.props.show) {
      this.setState({
        show: false
      })
    }
  }

  render () {
    const { animate, show } = this.state
    const animation = animate ? 'animate' : 'reset'
    const className = `${animation} message`
    return show ? <div className={className} onTransitionEnd={this.handleEnd} ></div> : null
  }
}



// class App extends React.Component {
//   constructor (props) {
//     super(props)
//     this.transitionEnd = this.transitionEnd.bind(this)
//     this.mountStyle = this.mountStyle.bind(this)
//     this.unMountStyle = this.unMountStyle.bind(this)
//     this.state = { //base css
//       show: false,
//       style: {
//         fontSize: 60,
//         opacity: 0,
//         transition: 'all 2s ease',
//       }
//     }
//   }

//   componentWillReceiveProps (newProps) { //check for the mounted props
//     if (!newProps.mounted)
//       return this.unMountStyle() //call outro animation when mounted prop is false
//     this.setState({ //remount the node when the mounted prop is true
//       show: true
//     })
//     setTimeout(this.mountStyle, 10) //call the into animiation
//   }

//   unMountStyle () { //css for unmount animation
//     this.setState({
//       style: {
//         fontSize: 60,
//         opacity: 0,
//         transition: 'all 1s ease',
//       }
//     })
//   }

//   mountStyle () { // css for mount animation
//     this.setState({
//       style: {
//         fontSize: 60,
//         opacity: 1,
//         transition: 'all 1s ease',
//       }
//     })
//   }

//   componentDidMount () {
//     setTimeout(this.mountStyle, 10) //call the into animiation
//   }

//   transitionEnd () {
//     if (!this.props.mounted) { //remove the node on transition end when the mounted prop is false
//       this.setState({
//         show: false
//       })
//     }
//   }

//   render () {
//     return this.state.show && <h1 style={this.state.style} onTransitionEnd={this.transitionEnd}>Hello</h1>
//   }
// }


// export class Animation extends React.Component {
//   constructor (props) {
//     super(props)
//     this.buttonClick = this.buttonClick.bind(this)
//     this.state = {
//       showChild: false,
//     }
//   }
//   buttonClick () {
//     this.setState({
//       showChild: !this.state.showChild
//     })
//   }
//   render () {
//     return <div>
//       <App onTransitionEnd={this.transitionEnd} mounted={this.state.showChild} />
//       <button onClick={this.buttonClick}>{this.state.showChild ? 'Unmount' : 'Mount'}</button>
//     </div>
//   }
// }