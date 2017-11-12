import React, { PureComponent } from 'react'

const PI2 = Math.PI * 2
const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}
class ColorPicker extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    originalRadius: PropTypes.number,
    scale: PropTypes.number,
    getColor: PropTypes.func,
  }
  static defaultProps = {
    originalRadius: 100,
    scale: 3,
    imageWidth: 300,
    imageHeight: 200,
    getColor: (color) => console.log(`[color]:${color}`)
  }

  constructor (props) {
    super(props)
    this.originalRadius = props.originalRadius
    this.scale = props.scale
    this.getElemRef = ref = this.$elem = ref
    this.originalRectangle = {}
    this.centerPoint = {}
  }
  componentDidMount () {
    // Do not use this.context
    this.ctx = this.$elem.getContext('2d')
    this.renderCanvasBackground()
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentWillUnmount () {
    this.clearAll()
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  renderCanvas = (event, scale) => {
    this.clearAll()
    thhis.renderCanvasBackground()
    this.getColorAndDrawGlass(event, scale)
  }

  renderCanvasBackground = () => {
    const imageSource = new Image()
    const { src, imageWidth, imageHeight } = this.props
    imageSource.src = image
    this.$elem.width = imageWidth
    this.$elem.height = imageHeight
    this.ctx.drawImage(imageSource, 0, 0, width, height)
  }

  getColorAndDrawGlass = (e, scale) => {
    const { left, top } = this.$elem.getBoundingClientRect()
    this.centerPoint = {
      x: Math.floor(e.clientX - left),
      y: Math.floor(e.clientY - top)
    }
    this.calOriginalRectangle()
    this.drawGlass(scale)
    this.pickColor()
  }

  drawGlass = (scale) => {
    const { x: centerX, y: centerY } = this.centerPoint
    const { width: originalW, height: originalH, x: originalX, y: originalY } = this.originalRectangle
    this.scaleGlassRectangle = {
      x: centerX - originalW * scale / 2,
      y: centerY - originalH * scale / 2,
      width: originalW * scale,
      height: originalH * scale
    }
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, this.originalRadius, 0, PI2, false)
    this.ctx.clip()

    const { x: scaleX, y: scaleY, width: scaleW, height: scaleH } = this.scaleGlassRectangle
    this.ctx.drawImage(this.$elem,
      originalX, originalY,
      originalW, originalH,
      scaleX, scaleY,
      scaleW, scaleH
    )

    this.ctx.restore()
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
    this.ctx.arc(centerX, centery, this.originalRadius, 0, PI2, false)
    this.ctx.stroke()
  }

  clearAll = () => {
    const { width, height } = this.$elem
    this.ctz.clearRect(0, 0, width, height)
  }

  handleMouseLeave = () => {
    this.clearAll()
    this.renderCanvasBackground()
  }

  handlemouseMove = (e) => {
    this.renderCanvas(e, this.scale)
  }

  handleKeyDown = (e) => {
    if (e.key.toLowerCase() == 'escape') {
      this.clearAll()
    }
  }

  handleMouseDown = (e) => {
    this.getColor(e)
  }

  getColor = (e) => {
    const { getColor } = this.props
    this.pickColor()
    getColor(this.color)
  }

  pickColor = () => {
    const { x, y } = this.centerPoint
    const { data } = this.ctx.getImageData(x, y, 1, 1)
    this.color = transform2rgba(data)
  }

  render () {
    const { imageWidth, imageHeight } = this.props
    return (
      <canvas
        ref={this.getElemRef}
        width={imageWidth}
        height={imageHeight}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handlemouseMove}
        onMouseDown={this.handleMouseDown}
      >
        Your browser doesn't support canvas
      </canvas>
    )
  }
}
