import React, { PureComponent,Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { debounce } from 'lodash'
import './index.css'


const defaultBoundingClientRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }
const LISTEN_FLAG = 'data-lazyload-listened'
const listeners = []
let pending = []
export default class LazyLoad extends PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    return <div className='lazy-load'>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
      <Lazy><Item /></Lazy>
    </div>
  }
}

let finalLazyLoadHandle = null
class Lazy extends Component {
  static propTypes = {
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  }
  static defaultProps = {
    offset: 0
  }
  constructor (props) {
    super(props)
    this.isVisible = false
  }

  shouldComponentUpdate() {
    return this.isVisible
  }
  componentDidMount () {
    const node = ReactDOM.findDOMNode(this)
    const parentNode = node.parentNode

    finalLazyLoadHandle = debounce(lazyLoadHandlers, 300)
    const listenerCount = 1 + (+parentNode.getAttribute(LISTEN_FLAG))
    if(listenerCount == 1) {
      parentNode.addEventListener('scroll', finalLazyLoadHandle, false)
    }
    parentNode.setAttribute(LISTEN_FLAG, listenerCount)

    listeners.push(this)
    checkInvision(this)
  }

  render () {
    return !this.isVisible ? <div style={{width: 100, height: 100}}>I am loading</div> : this.props.children
  }
}
class Item extends PureComponent {
  render () {
    return <div className="load-item-box" style={{ width: 100, height: 100 }}>
      <div className="load-item-content">Iten </div>
    </div>
  }
}


const defaultBoundingClintRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }

const lazyLoadHandlers = () => {
  for(let i = 0; i < listeners.length; ++i) {
    const listener = listeners[i]
    checkInvision(listener)
  }
}

const purgePending = function purgePending() {
  pending.forEach((component) => {
    const index = listeners.indexOf(component)
    if(index !== -1) listeners.splice(index, 1)
  })
  pending = []
}

const checkInvision = (component) => {
  const node = ReactDOM.findDOMNode(component)
  const parentNode = node.parentNode
  if(component.isVisible) return
  const visible = checkOverflowVisbile(component, parentNode)
  if(visible) {
    if(!component.isVisible) {
      if(component.props.once) {
        pending.push(component)
      }
      component.isVisible = true
      component.forceUpdate()
    }
  }
}

const checkOverflowVisbile = (component, parentNode) => {
  const node = ReactDOM.findDOMNode(component)
  let parentTop
  let parentHeight

  try {
    ({ top: parentTop, height: parentHeight } = parentNode.getBoundingClientRect())
  } catch (e) {
    ({ top: parentTop, height: parentHeight } = defaultBoundingClintRect)
  }

  const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight

  const interSectionTop = Math.max(parentTop, 0)
  const interSectionHeight = Math.min(window.innerHeight, parentTop + parentHeight) - interSectionTop

  console.log(`[interSectionTop]`, interSectionTop)
  console.log(`[interSectionHeight]`, interSectionHeight)

  let top
  let height
  try {
    ({ top, height } = node.getBoundingClientRect())
  } catch (e) {
    ({ top, height } = defaultBoundingClintRect)
  }

  const offsetTop = top - interSectionTop

  const offsets = Array.isArray(component.props.offset) ?
    component.props.offset : Array(2).fill(component.props.offset)

  return (offsetTop - offsets[0] <= interSectionHeight) && (offsetTop + height + offsets[1] >= 0)
}


window.listeners = listeners