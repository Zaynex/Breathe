import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import './index.css'

export default class ColorPicker extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    originalRadius: PropTypes.number,
    glassScale: PropTypes.number,
    deviceRatio: PropTypes.number,
    getColor: PropTypes.func,
    cancelPickerMode: PropTypes.func,
  }
  static defaultProps = {
    originalRadius: 100,
    glassScale: 25,
    src: 'sec3.png',
    imageHeight: 400,
    imageWidth: 700,
    deviceRatio: window.devicePixelRatio || 1,
    getColor: (color) => console.log(color)
  }

  constructor (props) {
    super(props)
    this.originalRadius = props.originalRadius * props.deviceRatio
    this.glassScale = props.glassScale
    this.getElemRef = ref => this.$elem = ref
    this.originalRectangle = {}
    this.centerPoint = {}
    this.RGB = {
      R: 255,
      G: 255,
      B: 255
    }
    this.firstRenderCanvas = true
    this.image = new Image()
    this.image.src = props.src
  }

  componentDidMount () {
    const { cancelPickerMode } = this.props
    this.ctx = this.$elem.getContext('2d')

    this.image.onload = () => this.renderCanvasBackground()
    this.image.onerror = () => cancelPickerMode()
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentDidUpdate () {
    this.clearCanvasRect()
    this.renderCanvasBackground()
  }

  componentWillUnmount () {
    this.clearCanvasRect()
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  renderCanvas = (e) => {
    if (!this.firstRenderCanvas) {
      this.clearCanvasRect()
      this.renderCanvasBackground()
    }
    this.getColorAndDrawGlass(e)
    this.firstRenderCanvas = false
  }

  renderCanvasBackground = () => {
    const { imageWidth, imageHeight, deviceRatio } = this.props
    this.$elem.style.width = imageWidth + 'px'
    this.$elem.style.height = imageHeight + 'px'

    this.image.width = imageWidth + 'px'
    this.image.height = imageHeight + 'px'
    this.$elem.width = imageWidth * deviceRatio
    this.$elem.height = imageHeight * deviceRatio

    this.ctx.drawImage(this.image, 0, 0, imageWidth * devicePixelRatio, imageHeight * devicePixelRatio)
  }

  getColorAndDrawGlass = (e) => {
    this.calCenterPoint(e)
    this.calOriginalRectangle()
    this.calScaleGlassRectangle()
    this.drawGlass()
    this.pickColor()
  }

  calCenterPoint = (e) => {
    const { deviceRatio } = this.props
    const { left, top } = this.$elem.getBoundingClientRect()
    this.centerPoint = {
      centerX: Math.floor(e.clientX - left) * deviceRatio,
      centerY: Math.floor(e.clientY - top) * deviceRatio
    }
  }

  calOriginalRectangle = () => {
    const { centerX, centerY } = this.centerPoint
    this.originalRectangle.originalX = centerX - this.originalRadius
    this.originalRectangle.originalY = centerY - this.originalRadius
    this.originalRectangle.originalW = this.originalRadius * 2
    this.originalRectangle.originalH = this.originalRadius * 2
  }

  calScaleGlassRectangle = () => {
    const { glassScale } = this.props
    const { centerX, centerY } = this.centerPoint
    const { originalH, originalW } = this.originalRectangle
    this.scaleGlassRectangle = {
      scaleX: centerX - originalW * glassScale / 2,
      scaleY: centerY - originalH * glassScale / 2,
      scaleW: originalW * glassScale,
      scaleH: originalH * glassScale
    }
  }

  drawGlass = () => {
    this.ctx.save()

    this.drawGlassImage()

    this.drawColorFont()

    this.ctx.restore()

    this.drawCenterRect()

    this.drawGlassBorder()


  }

  drawGlassImage = () => {
    const { centerX, centerY } = this.centerPoint
    const { originalH, originalW, originalX, originalY } = this.originalRectangle
    const { scaleX, scaleY, scaleW, scaleH } = this.scaleGlassRectangle
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, this.originalRadius, 0, PI2, false)
    this.ctx.clip()

    this.ctx.imageSmoothingEnabled = false
    this.ctx.webkitImageSmoothingEnabled = false
    this.ctx.msImageSmoothingEnabled = false
    this.ctx.mozImageSmoothingEnabled = false

    this.ctx.drawImage(this.$elem,
      originalX, originalY,
      originalW, originalH,
      scaleX, scaleY,
      scaleW, scaleH
    )
  }

  drawGlassBorder = () => {
    const { centerX, centerY } = this.centerPoint
    this.ctx.beginPath()

    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, this.originalRadius - 5,
      centerX, centerY, this.originalRadius
    )
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
    gradient.addColorStop(0.8, 'silver')
    gradient.addColorStop(0.9, 'silver')
    gradient.addColorStop(1, 'rgba(150, 150, 150, 0.9)')

    this.ctx.strokeStyle = gradient
    this.ctx.lineWidth = 5
    this.ctx.arc(centerX, centerY, this.originalRadius, 0, PI2, false)
    this.ctx.stroke()
  }

  drawCenterRect = () => {
    const { glassScale } = this.props
    const { centerX, centerY } = this.centerPoint
    this.ctx.beginPath()
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = '#000'
    // this.ctx.strokeRect(centerX - devicePixelRatio * 1, centerY - devicePixelRatio * 1, devicePixelRatio * 2, devicePixelRatio * 2)
    this.ctx.strokeRect(centerX - 10, centerY - 10, 20, 20)

    this.ctx.stroke()
  }

  drawColorFont = () => {
    const { glassScale } = this.props
    const { centerX, centerY } = this.centerPoint
    const { scaleW } = this.scaleGlassRectangle
    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(0, 0, 0, .7)'
    const { R, G, B } = this.RGB
    this.ctx.fillRect(centerX - scaleW / 2 + 20 * devicePixelRatio, centerY + 20 * devicePixelRatio, scaleW, 40 * devicePixelRatio)
    this.ctx.fillStyle = '#fff'
    this.ctx.lineWidth = `${0.1 * devicePixelRatio}`
    this.ctx.font = `${12 * devicePixelRatio}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`R:${R} G:${G} B:${B}`, centerX, centerY + 45 * devicePixelRatio)
    this.ctx.stroke()
  }

  handleMouseLeave = () => {
    this.clearCanvasRect()
    this.renderCanvasBackground()
    this.pickColor()
  }

  handlemouseMove = (e) => {
    this.renderCanvas(e)
  }

  handleKeyDown = (e) => {
    const { cancelPickerMode } = this.props
    if (e.key.toLowerCase() === 'escape') {
      this.clearCanvasRect()
      cancelPickerMode && cancelPickerMode()
    }
  }

  handleMouseDown = (e) => {
    this.getColor(e)
  }

  getColor = (e) => {
    const { getColor } = this.props
    this.pickColor()
    getColor && getColor(this.color)
  }

  pickColor = () => {
    const { centerX, centerY } = this.centerPoint
    const { data } = this.ctx.getImageData(centerX, centerY, 1, 1)
    this.color = transform2rgba(data)
    this.RGB = {
      R: data[0],
      G: data[1],
      B: data[2],
    }
  }

  clearCanvasRect = () => {
    const { width, height } = this.$elem
    this.ctx.clearRect(0, 0, width, height)
  }

  render () {
    const { imageHeight, imageWidth } = this.props
    return <canvas
      ref={this.getElemRef}
      onMouseLeave={this.handleMouseLeave}
      onMouseMove={this.handlemouseMove}
      onMouseDown={this.handleMouseDown}
      className="canvas"
      style={{ width: imageWidth, height: imageHeight }}
    >{"Your browser doesn't support canvas"}</canvas>
  }
}


const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}

const PI2 = Math.PI * 2
