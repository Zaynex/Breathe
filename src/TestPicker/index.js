import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Picker from '../Picker'
import './index.css'
export default class TestPicker extends PureComponent {

  constructor (props) {
    super(props)
    this.state = { color: '#fff' }
  }
  pickColor = (color) => {
    this.setState({ color })
  }
  render () {
    const { color } = this.state
    return <div>
      <Picker
        pickColor={this.pickColor}
        src="https://zaynex.github.io/Breathe/sec3.png" />
      <div className="test-color" style={{ background: color }}></div>
    </div>
  }
}



// Step 1
// export default class TestPicker extends PureComponent {
//   static propTypes = {
//     src: PropTypes.string.isRequired,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//   }
//   static defaultProps = {
//     width: 1300,
//     height: 769,
//     src: '/sec3.png'
//   }
//   // 在初始化阶段注册 ref 回调函数去获得 DOM 的实例
//   constructor (props) {
//     super(props)
//     this.imageCanvasRef = ref => this.imageCanvas = ref
//     this.image = new Image()
//     this.image.src = props.src

//   }
//   // 请注意，一定要在图片加载完全之后才开始绘制 Canvas
//   componentDidMount () {
//     this.image.onload = () => this.renderImageCanvas()
//   }

//   renderImageCanvas = () => {
//     const { width, height } = this.props
//     this.imageCtx = this.imageCanvas.getContext('2d')
//     this.imageCtx.drawImage(this.image, 0, 0, width, height)
//   }

//   render () {
//     const { width, height, src } = this.props
//     return <div>
//       <canvas
//         width={width}
//         height={height}
//         style={{ width, height }}
//         onMouseMove={this.handleMouseMove}
//         ref={this.imageCanvasRef}>
//       </canvas>
//       <div className="glass"></div>
//     </div>
//   }
// }


// step 2
// export default class TestPicker extends PureComponent {
//   static propTypes = {
//     src: PropTypes.string.isRequired,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//   }
//   static defaultProps = {
//     width: 1300,
//     height: 769,
//     src: '/sec3.png'
//   }
//   // 在初始化阶段注册 ref 回调函数去获得 DOM 的实例
//   constructor (props) {
//     super(props)
//     this.imageCanvasRef = ref => this.imageCanvas = ref
//     this.glassCanvasRef = ref => this.glassCanvas = ref
//     this.image = new Image()
//     this.image.src = props.src
//     this.state = {
//       left: 0,
//       top: 0
//     }

//   }
//   // 请注意，一定要在图片加载完全之后才开始绘制 Canvas
//   componentDidMount () {
//     this.image.onload = () => this.renderImageCanvas()
//   }

//   renderImageCanvas = () => {
//     const { width, height } = this.props
//     this.imageCtx = this.imageCanvas.getContext('2d')
//     this.imageCtx.drawImage(this.image, 0, 0, width, height)
//   }

//   handleMouseMove = (e) => {
//     // 计算当前鼠标相对 canvas 中的位置
//     this.calculateCenterPoint({ clientX: e.clientX, clientY: e.clientY })
//   }

//   calculateCenterPoint = ({ clientX, clientY }) => {
//     const { left, top } = this.imageCanvas.getBoundingClientRect()
//     this.centerPoint = {
//       centerX: Math.floor(clientX - left),
//       centerY: Math.floor(clientY - top)
//     }
//     const { centerX, centerY } = this.centerPoint
//     this.setState({ left: centerX, top: centerY })
//     console.log(this.centerPoint)
//   }

//   render () {
//     const { width, height, src } = this.props
//     const { left, top } = this.state
//     return <div style={{ position: 'relative' }}>
//       <canvas
//         width={width}
//         height={height}
//         style={{ width, height }}
//         onMouseMove={this.handleMouseMove}
//         ref={this.imageCanvasRef}>
//       </canvas>
//       <canvas
//         className="glass"
//         ref={this.glassCanvas}
//         width={glassWidth}
//         height={glassHeight}
//         style={{ left: left - glassWidth / 2, top: top - glassHeight / 2, width: glassWidth, height: glassHeight }}>
//       </canvas>
//     </div>
//   }
// }
// const glassWidth = 100
// const glassHeight = 100



// step 3
// export default class TestPicker extends PureComponent {
//   static propTypes = {
//     src: PropTypes.string.isRequired,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//     scale: PropTypes.number,
//   }
//   static defaultProps = {
//     width: 1300,
//     height: 769,
//     src: '/sec3.png',
//     scale: 1
//   }
//   // 在初始化阶段注册 ref 回调函数去获得 DOM 的实例
//   constructor (props) {
//     super(props)
//     this.imageCanvasRef = ref => this.imageCanvas = ref
//     this.glassCanvasRef = ref => this.glassCanvas = ref
//     this.image = new Image()
//     this.image.src = props.src
//     this.state = {
//       left: 0,
//       top: 0
//     }

//   }
//   // 请注意，一定要在图片加载完全之后才开始绘制 Canvas
//   componentDidMount () {
//     this.imageCtx = this.imageCanvas.getContext('2d')
//     this.glassCtx = this.glassCanvas.getContext('2d')
//     this.image.onload = () => this.renderImageCanvas()
//   }

//   renderImageCanvas = () => {
//     const { width, height } = this.props
//     this.imageCtx.drawImage(this.image, 0, 0, width, height)
//   }

//   handleMouseMove = (e) => {
//     const { scale } = this.props
//     // 计算当前鼠标相对 canvas 中的位置
//     this.calculateCenterPoint({ clientX: e.clientX, clientY: e.clientY })

//     const { centerX, centerY } = this.centerPoint
//     this.glassCtx.clearRect(0, 0, glassWidth, glassHeight)
//     const finallyScale = INIT_NUMBER * (scale < 1 ? 1 : scale)

//     drawImageSmoothingEnable(this.glassCtx, false)
//     this.glassCtx.drawImage(this.image,
//       Math.floor(centerX - (glassWidth / 2) / finallyScale), Math.floor(centerY - (glassHeight / 2) / finallyScale),
//       Math.floor(glassWidth / finallyScale), Math.floor(glassHeight / finallyScale),
//       0, 0,
//       glassWidth, glassHeight
//     )
//   }

//   calculateCenterPoint = ({ clientX, clientY }) => {
//     const { left, top } = this.imageCanvas.getBoundingClientRect()
//     this.centerPoint = {
//       centerX: Math.floor(clientX - left),
//       centerY: Math.floor(clientY - top)
//     }
//     const { centerX, centerY } = this.centerPoint
//     this.setState({ left: centerX, top: centerY })
//     console.log(this.centerPoint)
//   }

//   render () {
//     const { width, height, src } = this.props
//     const { left, top } = this.state
//     return <div style={{ position: 'relative', cursor: 'none' }}>
//       <canvas
//         width={width}
//         height={height}
//         style={{ width, height }}
//         onMouseMove={this.handleMouseMove}
//         ref={this.imageCanvasRef}>
//       </canvas>
//       <canvas
//         className="glass"
//         ref={this.glassCanvasRef}
//         width={glassWidth}
//         height={glassHeight}
//         style={{ left: left - glassWidth / 2, top: top - glassHeight / 2, width: glassWidth, height: glassHeight }}>
//       </canvas>
//     </div>
//   }
// }
// const glassWidth = 100
// const glassHeight = 100
// const INIT_NUMBER = 10
// const drawImageSmoothingEnable = (context, enable) => {
//   context.mozImageSmoothingEnabled = enable
//   context.webkitImageSmoothingEnabled = enable
//   context.msImageSmoothingEnabled = enable
//   context.imageSmoothingEnabled = enable
// }



// step4
// export default class TestPicker extends PureComponent {
//   static propTypes = {
//     src: PropTypes.string.isRequired,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//     scale: PropTypes.number,
//   }
//   static defaultProps = {
//     width: 1300,
//     height: 769,
//     src: '/sec3.png',
//     scale: 1
//   }
//   // 在初始化阶段注册 ref 回调函数去获得 DOM 的实例
//   constructor (props) {
//     super(props)
//     this.imageCanvasRef = ref => this.imageCanvas = ref
//     this.glassCanvasRef = ref => this.glassCanvas = ref
//     this.image = new Image()
//     this.image.src = props.src
//     this.state = {
//       left: 0,
//       top: 0
//     }

//   }
//   // 请注意，一定要在图片加载完全之后才开始绘制 Canvas
//   componentDidMount () {
//     this.imageCtx = this.imageCanvas.getContext('2d')
//     this.glassCtx = this.glassCanvas.getContext('2d')
//     this.image.onload = () => this.renderImageCanvas()
//   }

//   renderImageCanvas = () => {
//     const { width, height } = this.props
//     this.imageCtx.drawImage(this.image, 0, 0, width, height)
//   }

//   handleMouseMove = (e) => {
//     const { scale } = this.props
//     // 计算当前鼠标相对 canvas 中的位置
//     this.calculateCenterPoint({ clientX: e.clientX, clientY: e.clientY })

//     const { centerX, centerY } = this.centerPoint
//     this.glassCtx.clearRect(0, 0, glassWidth, glassHeight)
//     const finallyScale = INIT_NUMBER * (scale < 1 ? 1 : scale)

//     drawImageSmoothingEnable(this.glassCtx, false)
//     this.glassCtx.drawImage(this.image,
//       Math.floor(centerX - (glassWidth / 2) / finallyScale), Math.floor(centerY - (glassHeight / 2) / finallyScale),
//       Math.floor(glassWidth / finallyScale), Math.floor(glassHeight / finallyScale),
//       0, 0,
//       glassWidth, glassHeight
//     )

//     drawGrid(this.glassCtx, GRID_COLOR, INIT_NUMBER, INIT_NUMBER)
//     this.getColor()
//   }

//   calculateCenterPoint = ({ clientX, clientY }) => {
//     const { left, top } = this.imageCanvas.getBoundingClientRect()
//     this.centerPoint = {
//       centerX: Math.floor(clientX - left),
//       centerY: Math.floor(clientY - top)
//     }
//     const { centerX, centerY } = this.centerPoint
//     this.setState({ left: centerX, top: centerY })
//     console.log(this.centerPoint)
//   }

//   getColor = () => {
//     const { centerX, centerY } = this.centerPoint
//     const { data } = this.imageCtx.getImageData(centerX, centerY, 1, 1)
//     const color = transform2rgba(data)
//     this.color = color
//     console.log(color)
//   }

//   render () {
//     const { width, height, src } = this.props
//     const { left, top } = this.state
//     return <div style={{ position: 'relative' }}>
//       <canvas
//         width={width}
//         height={height}
//         style={{ width, height }}
//         onMouseMove={this.handleMouseMove}
//         ref={this.imageCanvasRef}>
//       </canvas>
//       <canvas
//         className="glass"
//         ref={this.glassCanvasRef}
//         width={glassWidth}
//         height={glassHeight}
//         style={{ left: left - glassWidth / 2, top: top - glassHeight / 2, width: glassWidth, height: glassHeight }}>
//       </canvas>
//       <div style={{ background: `${this.color}`, width: 100, height: 100 }}></div>
//     </div>
//   }
// }

// const GRID_COLOR = 'lightgray'
// const CENTERGRID_COLOR = 'black'
// const glassWidth = 100
// const glassHeight = 100
// const INIT_NUMBER = 10
// const drawImageSmoothingEnable = (context, enable) => {
//   context.mozImageSmoothingEnabled = enable
//   context.webkitImageSmoothingEnabled = enable
//   context.msImageSmoothingEnabled = enable
//   context.imageSmoothingEnabled = enable
// }

// const drawGrid = (context, color, stepx, stepy) => {
//   context.strokeStyle = color
//   context.lineWidth = 0.5

//   for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
//     context.beginPath()
//     context.moveTo(i, 0)
//     context.lineTo(i, context.canvas.height)
//     context.stroke()
//   }

//   for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
//     context.beginPath()
//     context.moveTo(0, i)
//     context.lineTo(context.canvas.width, i)
//     context.stroke()
//   }
// }

// const transform2rgba = (arr) => {
//   arr[3] = parseFloat(arr[3] / 255)
//   return `rgba(${arr.join(', ')})`
// }

