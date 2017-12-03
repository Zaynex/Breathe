import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import './index.css'

// todo 解决上边距渲染问题
const INIT_NUMBER = 10
export default class Picker extends Component {
  static propTypes = {
    src: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    glassHeight: PropTypes.number,
    glassWidth: PropTypes.number,
    scale: PropTypes.number,
  }
  static defaultProps = {
    src: "/test.jpeg",
    width: 750,
    height: 300,
    glassWidth: 200,
    glassHeight: 200,
    scale: 1
  }
  constructor (props) {
    super(props)
    this.getImageRef = ref => this.imageCanvas = ref
    this.glassCanvasRef = ref => this.glassCanvas = ref
    this.glassContainerRef = ref => this.glassContainer = ref
    this.rectRef = ref => this.rectContainer = ref
    this.image = new Image()
    this.image.src = props.src
  }

  componentDidMount () {
    this.imageCtx = this.imageCanvas.getContext('2d')
    this.glassCtx = this.glassCanvas.getContext('2d')
    this.image.onload = () => this.renderImageCanvas()
  }

  renderImageCanvas = () => {
    const { width, height } = this.props
    this.imageCtx.drawImage(this.image, 0, 0, width, height)
    this.offlineCanvas = document.createElement("canvas")
    this.offlineCanvas.width = width
    this.offlineCanvas.height = height
    this.offlineCtx = this.offlineCanvas.getContext('2d')
    this.offlineCtx.drawImage(this.image, 0, 0, width, height)
  }

  calculateCenterPoint = (e) => {
    const { left, top } = this.imageCanvas.getBoundingClientRect()
    this.centerPoint = {
      centerX: Math.floor(e.clientX - left),
      centerY: Math.floor(e.clientY - top)
    }
  }

  handleMove = (e) => {
    this.calculateCenterPoint(e)
    const { width, height, glassHeight, glassWidth, scale } = this.props
    const { centerX, centerY } = this.centerPoint
    this.glassContainer.style.display != 'block' && (this.glassContainer.style.display = 'block')

    this.glassLeft = (centerX - glassWidth / 2) + 'px'
    this.glassTop = (centerY - glassHeight / 2) + 'px'

    this.glassContainer.style.left = this.glassLeft
    this.glassContainer.style.top = this.glassTop

    this.glassCtx.clearRect(0, 0, glassWidth, glassHeight)
    if (scale < 1) {
      console.warn(`Can't make the galss scale small than 1, It will make bed invision`)
    }
    const finallyScale = INIT_NUMBER * (scale < 1 ? 1 : scale)
    drawImageSmoothingEnable(this.glassCtx, false)
    this.glassCtx.drawImage(this.imageCanvas,
      Math.floor(centerX - glassWidth / finallyScale), Math.floor(centerY - glassHeight / finallyScale),
      glassWidth / finallyScale, glassHeight / finallyScale,
      0, 0,
      glassWidth, glassHeight
    )

    drawGrid(this.glassCtx, 'lightgray', INIT_NUMBER, INIT_NUMBER)
    this.calculateCenterPoint(e)
    drawCenterRect(this.glassCtx, 'black', glassWidth / 2 - INIT_NUMBER, glassHeight / 2 - INIT_NUMBER, INIT_NUMBER, INIT_NUMBER)
    this.getColor()

  }

  getColor = () => {
    const { centerX, centerY } = this.centerPoint
    const { data } = this.imageCtx.getImageData(centerX - 1, centerY - 1, 1, 1)
    const result = transform2rgba(data)
    this.testColorRef.style.background = result
  }
  handleClick = (e) => {
    this.getColor()
  }

  handleMouseLeave = (e) => {
    const { width, height, glassHeight, glassWidth } = this.props
    this.glassCtx.clearRect(0, 0, glassWidth, glassHeight)
    this.glassContainer.style.display = 'none'
  }
  render () {
    const { width, height, glassWidth, glassHeight } = this.props
    return <div>
      <div className="container">
        <canvas
          width={width}
          height={height}
          ref={this.getImageRef}
          onMouseMove={this.handleMove}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          className="image">
        </canvas>
        <div className="glass-container">
        </div>
        <div className="glass"
          ref={this.glassContainerRef}
          style={{ width: glassWidth, height: glassHeight }}>
          <canvas
            ref={this.glassCanvasRef}
            width={glassWidth}
            height={glassHeight}>
          </canvas>
        </div>
        <span className="rect"
          ref={this.rectRef}
        ></span>

      </div>
      <div ref={ref => this.testColorRef = ref} style={{ width: 100, height: 100 }}></div>
    </div>
  }
}


const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}


const drawGrid = (context, color, stepx, stepy) => {
  context.strokeStyle = color;
  context.lineWidth = 0.5;

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
  context.strokeRect(x, y, 10, 10)
}