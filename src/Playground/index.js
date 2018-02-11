import React, { PureComponent, Component } from 'react'
import { SlideBar, Animation, AutoLoad } from '../Components'
/**
 * 父组件 willmount
 * 子组件 willmount
 * 子组件 didmount
 * 父组件 didimount
 *
 */
export default class Background extends PureComponent {
  render () {
    return <div>
      {
        IMGLIST.map(src => <AutoLoad src={src} key={src} style={{ width: 500, height: 600 }} />)
      }
    </div>
  }
}

const IMGLIST = [
  'sdasd',
  'https://cdn.dribbble.com/users/994264/screenshots/3774430/_illom.png',
  'https://cdn.dribbble.com/users/63407/screenshots/4075904/dribbble_style_women_3.png',
  'http://n.sinaimg.cn/blog/crawl/20170803/HxCz-fyitamv4614405.jpg',
  'http://image11.m1905.cn/mdb/uploadfile/2017/1102/thumb_1_300_410_20171102050610939941.jpg',
]
