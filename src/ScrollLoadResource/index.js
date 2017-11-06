import React, { PureComponent } from 'react'
import { debounce } from 'lodash'
import './index.css'

const COUNT = 100
const IMGARRAY = new Array(COUNT).fill('test.jpg')
const BASEHEIGHT = 100
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
    const scrollTop = this.$elem.scrollTop
    const offsetHeight = this.$elem.offsetHeight
    // 首屏渲染图片的数量
    const firstScrrenImageCount = Math.ceil(offsetHeight / BASEHEIGHT)
    // 最终加载的图片数量（过滤滑动过程中加载的图片）
    let loadImageArr = []

    // 针对滑动未超过一屏的情况
    if (scrollTop < offsetHeight) {
      const loadScreenImageCount = Math.ceil(scrollTop / BASEHEIGHT)
      for (let i = 0; i < loadScreenImageCount; i++) {
        loadImageArr.push(firstScrrenImageCount + i)
      }
    } else {
      const loadImageScreenIndex = Math.floor(scrollTop / BASEHEIGHT)
      // 在有些情况下，位移的顶部和底部各显示半张图片，因此会比满屏加载多一张，通过是否整除来判定
      const renderOneMore = (scrollTop / BASEHEIGHT).toString().includes('.') ? 1 : 0
      for (let i = 0; i < firstScrrenImageCount + renderOneMore; i++) {
        loadImageArr.push(loadImageScreenIndex + i)
      }
    }
    console.log(loadImageArr)
  }

  componentWillUnmount () {
    this.$elem.removeEventListener('mousewheel', this.debounceMouseWheel)
  }

  getRef = ref => this.$elem = ref

  render () {
    return <div ref={this.getRef} className="imageList">
      {IMGARRAY.map((v, i) => <div key={i} style={{ height: BASEHEIGHT, background: RANDOM_COLOR() }}>{i}</div>)}
    </div>
  }
}
