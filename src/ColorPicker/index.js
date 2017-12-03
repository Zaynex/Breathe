import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
const PI2 = Math.PI * 2
const transform2rgba = (arr) => {
  arr[3] = parseFloat(arr[3] / 255)
  return 'rgba(' + arr.join(', ') + ')'
}
export default class ColorPicker extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    originalRadius: PropTypes.number,
    scale: PropTypes.number,
    deviceRatio: PropTypes.number,
    getColor: PropTypes.func,
  }
  static defaultProps = {
    originalRadius: 100,
    scale: 3,
    imageWidth: 700,
    imageHeight: 400,
    deviceRatio: 2,
    src: "/sec3.png",
    getColor: (color) => console.log(`[color]:${color}`)
  }

  constructor (props) {
    super(props)
    this.originalRadius = props.originalRadius * props.deviceRatio
    this.scale = props.scale
    this.getElemRef = ref => this.$elem = ref
    this.originalRectangle = {}
    this.centerPoint = {}
  }
  componentDidMount () {
    const { src, imageHeight, imageWidth, deviceRatio } = this.props
    // Do not use this.context, 不然你会爆炸的
    this.ctx = this.$elem.getContext('2d')
    // 控制实际 DOM 大小
    this.$elem.style.width = imageWidth + "px"
    this.$elem.style.height = imageHeight + "px"

    // 控制画布大小
    this.$elem.width = imageWidth * deviceRatio
    this.$elem.height = imageHeight * deviceRatio

    // 确保资源加载成功后再render
    fetch(src).then(this.renderCanvansBackground)
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentWillUnmount () {
    this.clearAll()
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  renderCanvas = (event, scale) => {
    this.clearAll()
    this.renderCanvasBackground()
    this.getColorAndDrawGlass(event, scale)
  }

  renderCanvasBackground = () => {
    const { src, imageWidth, imageHeight, deviceRatio } = this.props
    const imageSource = new Image()
    imageSource.src = src
    // 因为画布大小 * ratio, 所以在 draw 时注意需要 * ratio
    this.ctx.drawImage(imageSource, 0, 0, imageWidth * deviceRatio, imageHeight * deviceRatio)
  }

  getColorAndDrawGlass = (e, scale) => {
    // 距离视口的位移
    const { left, top } = this.$elem.getBoundingClientRect()
    // 存储当前鼠标移动位置的在canvas中的点,以此数据作为圆心
    this.centerPoint = {
      centerX: Math.round(e.clientX - left),
      centerY: Math.round(e.clientY - top)
    }
    this.calOriginalRectangle()
    this.drawGlass(scale)
    this.pickColor()
  }

  calOriginalRectangle = () => {
    const { deviceRatio } = this.props
    const { centerX, centerY } = this.centerPoint
    console.log(`[centerX:${centerX}], [centerY:${centerY}]`)

    // 当前点击的x,y即为绘制区域的left 和 top 坐标点
    this.originalRectangle.originalX = centerX * deviceRatio - this.originalRadius
    this.originalRectangle.originalY = centerY * deviceRatio - this.originalRadius
    // 绘制区域的宽高，即为半径的两倍
    this.originalRectangle.originalW = this.originalRadius * 2
    this.originalRectangle.originalH = this.originalRadius * 2
  }

  drawGlass = (scale) => {
    const { deviceRatio } = this.props
    const { centerX, centerY } = this.centerPoint
    const { originalH, originalW, originalX, originalY } = this.originalRectangle
    console.log(`this.originalRectangle:`, originalX, originalY, originalW, originalH)
    this.scaleGlassRectangle = {
      scaleX: centerX * deviceRatio - originalW * scale / 2,
      scaleY: centerY * deviceRatio - originalH * scale / 2,
      scaleW: originalW * scale,
      scaleH: originalH * scale
    }
    const { scaleX, scaleY, scaleW, scaleH } = this.scaleGlassRectangle

    console.log(`this.scaleGlassRectangle:`, scaleX, scaleY, scaleW, scaleH)

    this.ctx.save()
    this.ctx.beginPath()
    // 让圆心跟随鼠标移动。由于目前 画布是 * device 状态，每移动 1px 实际在 画布移动 1 * px
    this.ctx.arc(centerX * deviceRatio, centerY * deviceRatio, this.originalRadius, 0, PI2, false)
    this.ctx.clip()

    // const imageData = this.ctx.getImageData(centerX, centerY, this.originalRadius, this.originalRadius)

    // let newCanvas = document.createElement('canvas')
    // let newxtx = newCanvas.getContext('2d')
    // newCanvas.width = newCanvas.height = this.originalRadius
    // newxtx.drawImage(imageData, 0, 0, this.originalRadius, this.originalRadius)
    // document.body.appendChild(newCanvas)
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
    this.ctx.arc(centerX * deviceRatio, centerY * deviceRatio, this.originalRadius, 0, PI2, false)
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
    this.renderCanvas(e, this.scale)
  }

  handleKeyDown = (e) => {
    if (e.key.toLowerCase() === 'escape') {
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
    const { imageWidth, imageHeight, deviceRatio } = this.props
    // width 和 height 为 canvas 画布大小
    // css 设定的为DOM层面的大小
    // 具体 画布和DOM大小关系转换 见 --->  待补充
    return <canvas
      ref={this.getElemRef}
      onMouseLeave={this.handleMouseLeave}
      onMouseMove={this.handlemouseMove}
      onMouseDown={this.handleMouseDown}
    >
      Your browser doesn't support canvas
    </canvas>
  }
}
