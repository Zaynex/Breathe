import React, { PureComponent } from 'react'
import { debounce } from 'lodash'
import './index.css'
const COUNT = 100
const COLUMN = 2
const imageCase = 'https://modao.cc/images/landing/homepage/new/sec3@phone.png?20171012b'
const TESTARRAY = []
for (let i = 0; i < COUNT; i++) {
  TESTARRAY.push({ title: `title${i}`, src: `${imageCase}`, index: i })
}
const HEIGHT = 110
const EXTRAHEIGHT = 10
const BASEGAP = HEIGHT + EXTRAHEIGHT
const fetchImageResource = (src) => {
  return fetch(src).then(() => src)
}
// blob
// const fetchImageResourceWithBlob = (src) => {
//   return fetch(src).then(response => response.blob())
// }

export default class ScrollLoadResource extends PureComponent {
  constructor (props) {
    super(props)
    this.debounceMouseWheel = debounce(this.handleMouseWheel, 500)
    this.cacheResource = []
    this.receiveResource = []
    this.getContainerRef = ref => this.$elem = ref
  }

  componentDidMount () {
    this.offsetHeight = this.$elem.offsetHeight
    // 满屏容纳的图片数量
    this.fullScrrenResourceCount = Math.ceil(this.offsetHeight / BASEGAP) * COLUMN

    const firstScreenResource = TESTARRAY.slice(0, this.fullScrrenResourceCount)
    this.fetchResource(firstScreenResource)
    this.$elem.addEventListener('mousewheel', this.debounceMouseWheel, false)
  }

  componentWillUnmount () {
    this.$elem.removeEventListener('mousewheel', this.debounceMouseWheel)
  }


  handleMouseWheel = () => {
    const scrollResource = this.calculateScrollResource()
    this.fetchResource(scrollResource)
  }

  calculateScrollResource = () => {
    const scrollTop = this.$elem.scrollTop
    let scrollResource = []

    // 针对滑动未超过一屏的情况
    if (scrollTop < this.offsetHeight) {
      const loadScreenImageCount = Math.ceil(scrollTop / BASEGAP) * COLUMN
      for (let i = 0; i < loadScreenImageCount; i++) {
        scrollResource.push(TESTARRAY[this.fullScrrenResourceCount + i])
      }
    } else {
      const screenIndex = Math.floor(scrollTop / BASEGAP) * COLUMN
      // 在有些情况下，位移的顶部和底部各显示半张图片，因此会比满屏加载多一张，通过是否整除来判定
      const renderOneMore = (scrollTop / BASEGAP).toString().includes('.') ? 1 * COLUMN : 0
      for (let i = 0; i < this.fullScrrenResourceCount + renderOneMore; i++) {
        const idx = screenIndex + i
        idx < COUNT && scrollResource.push(TESTARRAY[idx])
      }
    }
    return scrollResource
  }

  renderImage = (dom, src) => {
    dom && (dom.style.background = `url(${src}) no-repeat center center`)
    dom && dom.classList.add('loaded')
  }

  // renderImageWithBlob = async (dom, blob) => {
  //   const fileReader = new FileReader()
  //   fileReader.readAsDataURL(blob)
  //   fileReader.onloadend = () => {
  //     dom.style.backgroundImage = `url(${fileReader.result})`
  //   }
  // }

  fetchQueue = () => {
    if (this.receiveResource.length) {
      const { src, index } = this.receiveResource.shift()

      // ---- Core Test Case --- \\
      // console.log(this.cacheResource)
      // console.log(this.receiveResource)
      // const self = this
      // setTimeout(function () {
      //   fetchImageResource(testImage).then(function (fetchsrc) {
      //     self.renderImage(self.$elem.children[index].children[0], fetchsrc)
      //     self.cacheResource.push(fetchsrc)
      //   }).then(() => self.fetchQueue())
      // }, 4000)

      fetchImageResource(src).then((src) => {
        this.renderImage(this.$elem.children[index].children[0], src)
        this.cacheResource.push(src)
      }).then(() => this.fetchQueue())
    }
  }

  fetchResource = (resource) => {
    this.receiveResource = resource
    this.fetchQueue()
  }

  render () {
    return <div ref={this.getContainerRef} className="imageList">
      {TESTARRAY.map(({ title, src, index }) => <div key={index} data-src={src} className="imageItem" style={{ height: HEIGHT, marginBottom: EXTRAHEIGHT }}>
        <div className="imageContent"></div><span className="imageTitle">{title}</span>
      </div>)}
    </div>
  }
}
