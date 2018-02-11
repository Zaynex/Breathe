import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { debounce } from 'lodash'
import scrollParent from './scrollParent'
import './index.css'


const defaultBoundingClientRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }
const LISTEN_FLAG = 'data-lazyload-listened'
const listeners = []
let pending = []
export default class LazyLoad extends PureComponent {

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

let finalLazyLoadHandler = null
class Lazy extends Component {
  static propTypes = {
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    children: PropTypes.object,
    placeholder: PropTypes.object,
  }
  static defaultProps = {
    offset: 0
  }
  constructor (props) {
    super(props)
    this.isVisible = false
  }

  shouldComponentUpdate () {
    return this.isVisible
  }
  componentDidMount () {
    const node = ReactDOM.findDOMNode(this)
    const parentNode = scrollParent(node)

    finalLazyLoadHandler = debounce(lazyLoadHandlers, 300)
    const listenerCount = 1 + (+parentNode.getAttribute(LISTEN_FLAG))
    if (listenerCount === 1) {
      parentNode.addEventListener('scroll', finalLazyLoadHandler, false)
    }
    parentNode.setAttribute(LISTEN_FLAG, listenerCount)

    listeners.push(this)
    checkInvision(this)
  }

  componentWillUnmount () {
    const parent = scrollParent(ReactDOM.findDOMNode(this))
    if (parent && typeof parent.getAttribute === 'function') {
      const listenerCount = (+parent.getAttribute(LISTEN_FLAG)) - 1
      if (listenerCount === 0) {
        parent.removeEventListener('scroll', finalLazyLoadHandler, false)
        parent.removeAttribute(LISTEN_FLAG)
      } else {
        parent.setAttribute(LISTEN_FLAG, listenerCount)
      }
    }
    const index = listeners.indexOf(this);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  render () {
    return !this.isVisible ? (this.props.placeholder ? this.props.placeholder : <PlaceHolder />) : this.props.children
  }
}
class Item extends PureComponent {
  render () {
    return <div className="load-item-box" style={{ width: 100, height: 100 }}>
      <div className="load-item-content">Iten </div>
    </div>
  }
}


const PlaceHolder = () => <div style={{ width: 100, height: 100 }}>I am loading</div>
const lazyLoadHandlers = () => {
  for (let i = 0; i < listeners.length; ++i) {
    const listener = listeners[i]
    checkInvision(listener)
  }
  purgePending()
}

const purgePending = function purgePending () {
  pending.forEach((component) => {
    const index = listeners.indexOf(component)
    if (index !== -1) listeners.splice(index, 1)
  })
  pending = []
}

const checkInvision = (component) => {
  const node = ReactDOM.findDOMNode(component)
  const parentNode = scrollParent(node)
  if (component.isVisible) return
  const visible = checkOverflowVisbile(component, parentNode)
  if (visible) {
    if (!component.isVisible) {
      component.isVisible = true
      component.forceUpdate()
    }
  } else {
    component.isVisible = false
  }
}

const checkOverflowVisbile = (component, parentNode) => {
  const node = ReactDOM.findDOMNode(component)
  let parentTop
  let parentHeight

  try {
    ({ top: parentTop, height: parentHeight } = parentNode.getBoundingClientRect())
  } catch (e) {
    ({ top: parentTop, height: parentHeight } = defaultBoundingClientRect)
  }

  const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight

  const interSectionTop = Math.max(parentTop, 0)
  const interSectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - interSectionTop

  let top
  let height
  try {
    ({ top, height } = node.getBoundingClientRect())
  } catch (e) {
    ({ top, height } = defaultBoundingClientRect)
  }

  const offsetTop = top - interSectionTop

  const offsets = Array.isArray(component.props.offset) ?
    component.props.offset : Array(2).fill(component.props.offset)

  return (offsetTop - offsets[0] <= interSectionHeight) && (offsetTop + height + offsets[1] >= 0)
}
