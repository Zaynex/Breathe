import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'


// const _widgetsByName = MB.currentScreen._widgetsByName.image_view
// const { width: imageSourceWidth, height: imageSourceHeight, imageSrc } = _widgetsByName

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
    glassScale: 3,
    imageWidth: 700,
    imageHeight: 400,
    deviceRatio: window.devicePixelRatio,
    src: '/sec3.png',
    getColor: (color) => console.log(color)
  }

  constructor (props) {
    super(props)
    this.originalRadius = props.originalRadius * props.deviceRatio
    this.glassScale = props.glassScale
    this.getElemRef = ref => this.$elem = ref
    this.originalRectangle = {}
    this.centerPoint = {}
    fetch(props.src).then(res => res.blob()).then(blob => {
      this.objURL = URL.createObjectURL(blob)
    })
  }

  componentDidMount () {
    // Do not use this.context, 不然你会爆炸的
    this.ctx = this.$elem.getContext('2d')
    this.renderCanvasBackground()
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentDidUpdate () {
    this.clearAll()
    this.renderCanvasBackground()
  }

  componentWillUnmount () {
    this.clearAll()
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  renderCanvas = (event, glassScale) => {
    this.clearAll()
    this.renderCanvasBackground()
    this.getColorAndDrawGlass(event, glassScale)
  }

  renderCanvasBackground = () => {
    const { src, imageWidth, imageHeight, deviceRatio } = this.props
    const imageSource = new Image()
    // 因为画布大小 * ratio, 所以在 draw 时注意需要 * ratio
    // 控制实际 DOM 大小
    this.$elem.style.width = imageWidth + "px"
    this.$elem.style.height = imageHeight + "px"

    // 控制画布大小
    this.$elem.width = imageWidth * deviceRatio
    this.$elem.height = imageHeight * deviceRatio

    imageSource.src = this.objURL ? this.objURL : src
    if (!imageSource.complete) {
      imageSource.onload = () => this.ctx.drawImage(imageSource, 0, 0, imageWidth * deviceRatio, imageHeight * deviceRatio)
    } else {
      this.ctx.drawImage(imageSource, 0, 0, imageWidth * deviceRatio, imageHeight * deviceRatio)
    }
  }

  getColorAndDrawGlass = (e, glassScale) => {
    const { deviceRatio } = this.props
    // 距离视口的位移
    const { left, top } = this.$elem.getBoundingClientRect()
    // 存储当前鼠标移动位置的在canvas中的点,以此数据作为圆心
    // 让圆心跟随鼠标移动。由于目前 画布是 * device 状态，每移动 1px 实际在 画布移动 1 * px
    this.centerPoint = {
      centerX: Math.floor(e.clientX - left) * deviceRatio,
      centerY: Math.floor(e.clientY - top) * deviceRatio
    }
    this.calOriginalRectangle()
    this.drawGlass(glassScale)
    this.pickColor()
  }

  calOriginalRectangle = () => {
    const { centerX, centerY } = this.centerPoint
    console.log(`[centerX:${centerX}], [centerY:${centerY}]`)

    // 当前点击的x,y即为绘制区域的left 和 top 坐标点
    this.originalRectangle.originalX = centerX - this.originalRadius
    this.originalRectangle.originalY = centerY - this.originalRadius
    // 绘制区域的宽高，即为半径的两倍
    this.originalRectangle.originalW = this.originalRadius * 2
    this.originalRectangle.originalH = this.originalRadius * 2
  }

  drawGlass = (glassScale) => {
    const { centerX, centerY } = this.centerPoint
    const { originalH, originalW, originalX, originalY } = this.originalRectangle
    console.log(`this.originalRectangle:`, originalX, originalY, originalW, originalH)
    this.scaleGlassRectangle = {
      scaleX: centerX - originalW * glassScale / 2,
      scaleY: centerY - originalH * glassScale / 2,
      scaleW: originalW * glassScale,
      scaleH: originalH * glassScale
    }
    const { scaleX, scaleY, scaleW, scaleH } = this.scaleGlassRectangle

    console.log(`this.scaleGlassRectangle:`, scaleX, scaleY, scaleW, scaleH)

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, this.originalRadius, 0, PI2, false)
    this.ctx.clip()

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
    this.ctx.arc(centerX, centerY, this.originalRadius, 0, PI2, false)
    this.ctx.stroke()
  }

  clearAll = () => {
    // 清除的是画布大小，不是实际 DOM 大小
    const { width, height } = this.$elem
    this.ctx.clearRect(0, 0, width, height)
  }

  handleMouseLeave = () => {
    this.clearAll()
    this.renderCanvasBackground()
  }

  handlemouseMove = (e) => {
    this.renderCanvas(e, this.glassScale)
  }

  handleKeyDown = (e) => {
    const { cancelPickerMode } = this.props
    if (e.key.toLowerCase() === 'escape') {
      this.clearAll()
      cancelPickerMode && cancelPickerMode()
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
    const { centerX, centerY } = this.centerPoint
    const { data } = this.ctx.getImageData(centerX, centerY, 1, 1)
    this.color = transform2rgba(data)
  }

  render () {
    const { imageHeight, imageWidth } = this.props
    return <canvas
      ref={this.getElemRef}
      onMouseLeave={this.handleMouseLeave}
      onMouseMove={this.handlemouseMove}
      onMouseDown={this.handleMouseDown}
      style={{ width: imageWidth, height: imageHeight }}
    >{"Your browser doesn't support canvas"}</canvas>
  }
}


const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}

const PI2 = Math.PI * 2
