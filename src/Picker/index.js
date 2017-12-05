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
    pickColor: PropTypes.func,
  }
  static defaultProps = {
    src: "/sec3.png",
    width: 1300,
    height: 769,
    glassWidth: 200,
    glassHeight: 200,
    scale: 1,
  }

  constructor (props) {
    super(props)
    this.iamgeContainerRef = ref => this.image = ref
    this.getImageRef = ref => this.imageCanvas = ref
    this.glassCanvasRef = ref => this.glassCanvas = ref
    this.glassContainerRef = ref => this.glassContainer = ref
    this.state = {
      visibility: HIDDEN,
      glassLeft: 0,
      glassTop: 0,
      color: '#fff'
    }
  }

  componentDidMount () {
    this.imageCtx = this.imageCanvas.getContext('2d')
    this.glassCtx = this.glassCanvas.getContext('2d')
    this.image.onload = () => this.renderImageCanvas()
  }

  renderImageCanvas = () => {
    const { width, height } = this.props
    this.imageCtx.drawImage(this.image, 0, 0, width, height)
  }

  calculateCenterPoint = (e) => {
    const { left, top } = this.image.getBoundingClientRect()
    this.centerPoint = {
      centerX: Math.floor(e.clientX - left),
      centerY: Math.floor(e.clientY - top)
    }
  }

  handleMove = (e) => {
    this.image.complete && this.state.visibility === HIDDEN && this.setState({ visibility: VISIBLE })

    this.calculateCenterPoint(e)
    const { glassHeight, glassWidth, scale } = this.props
    const { centerX, centerY } = this.centerPoint
    const glassLeft = Math.floor(centerX - glassWidth / 2)
    const glassTop = Math.floor(centerY - glassHeight / 2)

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
    const { pickColor } = this.props
    const { centerX, centerY } = this.centerPoint
    const { data } = this.imageCtx.getImageData(centerX, centerY, 1, 1)
    const color = transform2rgba(data)
    this.setState({ color })
    pickColor && pickColor(color)
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
    const { width, height, glassWidth, glassHeight, src } = this.props
    const { visibility, glassLeft, glassTop, color } = this.state
    return <div className="mb-picker-container">
      <img
        ref={this.iamgeContainerRef}
        className="mb-picker-image"
        crossOrigin="anonymous"
        src={src}>
      </img>
      <canvas
        width={width}
        height={height}
        ref={this.getImageRef}
        onMouseMove={this.handleMove}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        style={{ width, height, opacity: 0 }}>
      </canvas>
      <div className="mb-glass"
        ref={this.glassContainerRef}
        style={{ width: glassWidth, height: glassHeight, visibility, left: glassLeft, top: glassTop }}>
        <canvas
          ref={this.glassCanvasRef}
          width={glassWidth}
          height={glassHeight}
          style={{ width: glassWidth, height: glassHeight }}>
        </canvas>
        <div
          style={{ width: glassWidth, height: glassHeight / 4, top: glassHeight / 2 + 20 }}
          className="mb-glass-text">
          <div className="mb-rgba-color">{color}</div>
          <div className="mb-hex-color">{rgb2hex_a(color).hex}</div>
        </div>
      </div>
    </div>
  }
}


const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}

const rgb2hex_a = (rgb) => {
  const result = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+(\.\d)?)[\s+]?/i)
  return (result && result.length >= 4) ?
    {
      hex: "#" +
        ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[3], 10).toString(16)).slice(-2),
      o: +result[4]
    } : rgb
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