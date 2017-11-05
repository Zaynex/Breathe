import React, { PureComponent } from 'react'
import './index.css'
import { debounce } from 'lodash'
const COUNT = 100
const IMGARRAY = new Array(COUNT).fill('test.jpg')
const BASEHEIGHT = 112
const RANDOM_COLOR = () => '#' + (Math.random() * 0xffffff << 0).toString(16)
export default class ScrollLoadResource extends PureComponent {

  constructor (props) {
    super(props)
    this.debounceMouseWheel = debounce(this.handleMouseWheel, 100)
  }
  componentDidMount () {
    this.$elem.addEventListener('mousewheel', this.debounceMouseWheel, false)
  }

  handleMouseWheel = () => {
    // wheel 时渲染
    const scrollTop = this.$elem.scrollTop
    const offsetHeight = this.$elem.offsetHeight
    // 首屏渲染图片的数量
    const firstScrrenImageCount = Math.ceil(offsetHeight / BASEHEIGHT)

    // 最终加载的图片数量（过滤滑动过程中加载的图片）
    let loadImageArr = []
    if (scrollTop < offsetHeight) {
      // 针对滑动未超过一屏的情况
      const loadScreenImageCount = Math.ceil(scrollTop / BASEHEIGHT)
      // 从起始点的后一位开始, + 1
      for (let i = 1; i < loadScreenImageCount + 1; i++) {
        loadImageArr.push(firstScrrenImageCount + i)
      }
    } else {
      const loadImageScreenIndex = Math.ceil(scrollTop / BASEHEIGHT)
      // 在有些情况下，位移的顶部和底部各显示半张图片，因此会比满屏加载多一张
      const renderOneMore = (scrollTop / offsetHeight).toString().includes('.') ? 2 : 1
      // 从起始点的后一位开始, + 1
      // 因为存在开在中间的情况，简单期间直接加载单屏数量的总数 + 1
      for (let i = 1; i < firstScrrenImageCount + renderOneMore; i++) {
        loadImageArr.push(loadImageScreenIndex + i)
      }
    }
  }

  componentWillUnmount () {
    this.$elem.removeEventListener('mousewheel', this.debounceMouseWheel)
  }
  getRef = ref => this.$elem = ref
  render () {
    return <div ref={this.getRef} className="imageList">
      {IMGARRAY.map((v, i) => <div key={v + i} style={{ height: BASEHEIGHT, background: RANDOM_COLOR() }} />)}
    </div>
  }
}
