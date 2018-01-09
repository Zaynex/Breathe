import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'

const TODOS = ["Get coffee", "Eat cookies"]

class TodoList extends PureComponent {
  render () {
    return (<ul>
      {this.props.todos.map(todo =>
        <li key={todo}><ThemedText>{todo}</ThemedText></li>
      )}
    </ul>)
  }
}


class Theme {
  constructor (color) {
    this.color = color
    this.subscriptions = []
  }

  setColor (color) {
    this.color = color
    this.subscriptions.forEach(f => f())
  }

  subscribe (f) {
    this.subscriptions.push(f)
  }
}


export class SlideBar extends Component {
  constructor (p, c) {
    super(p, c)
    this.state = { color: "blue" }
  }

  render () {
    return <ThemeProvider color={this.state.color}>
      <button onClick={this.makeRed.bind(this)}>
        <ThemedText>Red please!</ThemedText>
      </button>
      <TodoList todos={TODOS} />
    </ThemeProvider>
  }

  makeRed () {
    this.setState({ color: "red" })
  }
}
let i = 1
class ThemeProvider extends Component {
  getChildContext () {
    console.log(`render${i++}次`)
    return { color: this.props.color }
  }

  render () {
    return <div>{this.props.children}</div>
  }
}
ThemeProvider.childContextTypes = {
  color: PropTypes.string
}

class ThemedText extends Component {
  componentWillReceiveProps (nextProps, nextContext) {
    console.log(nextContext, 'nextContext')
  }
  render () {
    return <div style={{ color: this.context.color }}>
      {this.props.children}
    </div>
  }
}
ThemedText.contextTypes = {
  color: PropTypes.string,
}

// class ThemeProvider extends Component {
//   constructor (p, c) {
//     super(p, c)
//     this.theme = new Theme(this.props.color)
//   }

//   componentWillReceiveProps (next) {
//     this.theme.setColor(next.color)
//   }

//   getChildContext () {
//     return { theme: this.theme }
//   }
//   render () {
//     return <div>{this.props.children}</div>
//   }
// }
// ThemeProvider.childContextTypes = {
//   theme: PropTypes.object,
// }

// class ThemedText extends Component {
//   componentDidMount () {
//     this.context.theme.subscribe(() => this.forceUpdate())
//   }
//   render () {
//     return <div style={{ color: this.context.theme.color }}>
//       {this.props.children}
//     </div>
//   }
// }

// ThemedText.contextTypes = {
//   theme: PropTypes.object,
// }