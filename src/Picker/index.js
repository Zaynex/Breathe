import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './index.css'

const INIT_NUMBER = 10
const HIDDEN = 'hidden'
const VISIBLE = 'visible'
const LIGHTGRAY = 'lightgray'
const CENTERGRID = 'black'

export default class Picker extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    glassHeight: PropTypes.number,
    glassWidth: PropTypes.number,
    scale: PropTypes.number,
    deviceRatio: PropTypes.number,
  }
  static defaultProps = {
    src: "/sec3.png",
    width: 1300,
    height: 769,
    glassWidth: 200,
    glassHeight: 200,
    scale: 1,
    deviceRatio: 1
  }

  constructor (props) {
    super(props)
    this.getImageRef = ref => this.imageCanvas = ref
    this.glassCanvasRef = ref => this.glassCanvas = ref
    this.glassContainerRef = ref => this.glassContainer = ref
    this.image = new Image()
    this.image.src = props.src
    this.image.crossOrigin = "Anonymous"
    this.image.setAttribute('crossOrigin', '')
    this.state = {
      visibility: HIDDEN,
      glassLeft: 0,
      glassTop: 0,
    }
  }

  componentDidMount () {
    this.imageCtx = this.imageCanvas.getContext('2d')
    this.glassCtx = this.glassCanvas.getContext('2d')
    this.image.onload = () => this.renderImageCanvas()
  }

  renderImageCanvas = () => {
    const { width, height, deviceRatio } = this.props
    this.imageCtx.drawImage(this.image, 0, 0, width * deviceRatio, height * deviceRatio)
    // this.offlineCanvas = document.createElement("canvas")
    // this.offlineCanvas.width = width
    // this.offlineCanvas.height = height
    // this.offlineCtx = this.offlineCanvas.getContext('2d')
    // this.offlineCtx.drawImage(this.image, 0, 0, width, height)
  }

  calculateCenterPoint = (e) => {
    const { left, top } = this.imageCanvas.getBoundingClientRect()
    this.centerPoint = {
      centerX: Math.floor(e.clientX - left),
      centerY: Math.floor(e.clientY - top)
    }
  }

  handleMove = (e) => {
    this.state.visibility === HIDDEN && this.setState({ visibility: VISIBLE })
    this.calculateCenterPoint(e)
    const { glassHeight, glassWidth, scale } = this.props
    const { centerX, centerY } = this.centerPoint
    const glassLeft = `${Math.floor(centerX - glassWidth / 2)}px`
    const glassTop = `${Math.floor(centerY - glassHeight / 2)}px`

    this.setState({
      glassLeft,
      glassTop
    })

    // fix upper
    if (centerY < 0) { this.clearGlassRect() }
    this.glassCtx.clearRect(0, 0, glassWidth, glassHeight)
    if (scale < 1) {
      console.warn(`Can't make the galss scale less than 1, It will make bed invision`)
    }

    const finallyScale = INIT_NUMBER * (scale < 1 ? 1 : scale)
    drawImageSmoothingEnable(this.glassCtx, false)

    this.glassCtx.drawImage(this.imageCanvas,
      Math.floor(centerX - (glassWidth / 2) / finallyScale), Math.floor(centerY - (glassHeight / 2) / finallyScale),
      Math.floor(glassWidth / finallyScale), Math.floor(glassHeight / finallyScale),
      -INIT_NUMBER, -INIT_NUMBER,
      glassWidth, glassHeight
    )
    drawGrid(this.glassCtx, LIGHTGRAY, INIT_NUMBER, INIT_NUMBER)
    drawCenterRect(this.glassCtx, CENTERGRID, Math.floor(glassWidth / 2 - INIT_NUMBER), Math.floor(glassHeight / 2 - INIT_NUMBER), INIT_NUMBER, INIT_NUMBER)
    this.getColor()
  }

  getColor = () => {
    const { getColor } = this.props
    const { centerX, centerY } = this.centerPoint
    const { data } = this.imageCtx.getImageData(centerX - 1, centerY - 1, 1, 1)
    const result = transform2rgba(data)
    getColor && getColor(result)
  }

  handleClick = () => {
    this.getColor()
  }

  clearGlassRect = () => {
    const { glassHeight, glassWidth } = this.props
    this.glassCtx.clearRect(0, 0, glassWidth, glassHeight)
    this.setState({ visibility: HIDDEN })
  }

  handleMouseLeave = () => {
    this.clearGlassRect()
  }

  render () {
    const { width, height, glassWidth, glassHeight, deviceRatio } = this.props
    const { visibility, glassLeft, glassTop } = this.state
    // want use offline canvas so there have much test canvas
    return <div className="picker-container">
      <canvas
        width={width * deviceRatio}
        height={height * deviceRatio}
        ref={this.getImageRef}
        onMouseMove={this.handleMove}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        style={{ width, height }}
        className="image">
      </canvas>
      <div className="glass"
        ref={this.glassContainerRef}
        style={{ width: glassWidth, height: glassHeight, visibility, left: glassLeft, top: glassTop }}>
        <canvas
          ref={this.glassCanvasRef}
          width={glassWidth}
          height={glassHeight}>
        </canvas>
      </div>
    </div>
  }
}


const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}

const drawGrid = (context, color, stepx, stepy) => {
  context.strokeStyle = color
  context.lineWidth = 0.5

  for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
    context.beginPath()
    context.moveTo(i, 0)
    context.lineTo(i, context.canvas.height)
    context.stroke()
  }

  for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
    context.beginPath()
    context.moveTo(0, i)
    context.lineTo(context.canvas.width, i)
    context.stroke()
  }
}

const drawImageSmoothingEnable = (context, enable) => {
  context.mozImageSmoothingEnabled = enable
  context.webkitImageSmoothingEnabled = enable
  context.msImageSmoothingEnabled = enable
  context.imageSmoothingEnabled = enable
}

const drawCenterRect = (context, color, x, y, width, height) => {
  context.strokeStyle = color
  context.lineWidth = 1
  context.strokeRect(x, y, width, height)
}