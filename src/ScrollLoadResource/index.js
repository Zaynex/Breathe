import React, { PureComponent } from 'react'
import { debounce } from 'lodash'
import { createAsyncTaskQueue } from '../utils/index'
import './index.css'
const COUNT = 100
const IMGARRAY = new Array(COUNT).fill('test.jpg')
const BASEHEIGHT = 112
const RANDOM_COLOR = () => '#' + (Math.random() * 0xffffff << 0).toString(16)
const testImage = 'https://modao.cc/images/landing/homepage/new/sec3@phone.png?20171012b'
const fetchImageResource = (src) => {
  return fetch(src).then(() => src)
}

// blob
// const fetchImageResourceWithBlob = (src) => {
//   return fetch(src).then(response => response.blob())
// }

const __ENV__ = process.env.NODE_ENV === 'development'

export default class ScrollLoadResource extends PureComponent {
  constructor (props) {
    super(props)
    this.debounceMouseWheel = debounce(this.handleMouseWheel, 500)
    this.cacheResource = []
  }

  componentDidMount () {
    this.offsetHeight = this.$elem.offsetHeight
    this.firstScrrenImageCount = Math.ceil(this.offsetHeight / BASEHEIGHT)
    const firstScreenLoadArr = [...Array(this.firstScrrenImageCount).keys()]
    this.fetchResource(firstScreenLoadArr)
    this.$elem.addEventListener('mousewheel', this.debounceMouseWheel, false)
  }

  handleMouseWheel = () => {
    const loadImageResourceArr = this.calculateLoadResource()
    this.fetchResource(loadImageResourceArr)
  }

  calculateLoadResource = () => {
    const scrollTop = this.$elem.scrollTop
    // 首屏渲染图片的数量
    this.firstScrrenImageCount = Math.ceil(this.offsetHeight / BASEHEIGHT)
    // 最终加载的图片数量（过滤滑动过程中加载的图片）
    let loadImageResourceArr = []

    // 针对滑动未超过一屏的情况
    if (scrollTop < this.offsetHeight) {
      const loadScreenImageCount = Math.ceil(scrollTop / BASEHEIGHT)
      for (let i = 0; i < loadScreenImageCount; i++) {
        loadImageResourceArr.push(this.firstScrrenImageCount + i)
      }
    } else {
      const loadImageScreenIndex = Math.floor(scrollTop / BASEHEIGHT)
      // 在有些情况下，位移的顶部和底部各显示半张图片，因此会比满屏加载多一张，通过是否整除来判定
      const renderOneMore = (scrollTop / BASEHEIGHT).toString().includes('.') ? 1 : 0
      for (let i = 0; i < this.firstScrrenImageCount + renderOneMore; i++) {
        loadImageResourceArr.push(loadImageScreenIndex + i)
      }
    }
    return loadImageResourceArr
  }

  renderImage = async (dom, src) => {
    // 模拟异步操作
    setTimeout(() => {
      dom && (dom.style.backgroundImage = `url(${src})`)
      dom && dom.classList.add('loaded')
    })
  }

  // renderImageWithBlob = async (dom, blob) => {
  //   const fileReader = new FileReader()
  //   fileReader.readAsDataURL(blob)
  //   fileReader.onloadend = () => {
  //     dom.style.backgroundImage = `url(${fileReader.result})`
  //   }
  // }

  fetchResource = (currentResource) => {
    const { pushTask, getTaskQueueSize } = createAsyncTaskQueue()
    __ENV__ && console.log(`currentResource`, currentResource)
    __ENV__ && console.log(`this.lastResourceArr`, this.lastResourceArr)
    __ENV__ && console.log(`this.cacheResource`, this.cacheResource)

    currentResource.forEach(imageSource => {
      if (this.cacheResource.includes(imageSource)) return
      pushTask(async () => {
        console.log(`fetch Resources task add ${getTaskQueueSize()}`, IMGARRAY[imageSource])
        // await fetchImageResource(imageSource)
        // 确保请求的src是已经加载过的资源
        const afterFetchSrc = await fetchImageResource(testImage)
        // 这种方式就是从缓存中取数据，或者在图片资源加载完之后将其转换为 blob
        // const blobImage = await fetchImageResourceWithBlob(testImage)

        await this.renderImage(this.$elem.children[imageSource], afterFetchSrc)
      })
    })
    this.lastResourceArr = currentResource
    this.cacheResource = this.cacheResource.concat(currentResource)
  }

  componentWillUnmount () {
    this.$elem.removeEventListener('mousewheel', this.debounceMouseWheel)
  }

  getRef = ref => this.$elem = ref

  render () {
    return <div ref={this.getRef} className="imageList">
      {IMGARRAY.map((v, i) => <div key={i} className="imageItem" style={{ height: BASEHEIGHT, background: RANDOM_COLOR() }}>{i}</div>)}
    </div>
  }
}
